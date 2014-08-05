/**
 * 
 */
var _ = require('underscore')
  , H = require('../common/helper.js')
  , Category = require('../domain/Category.js');

// 싱글톤 (포함되는 참조변수 초기화 후 싱글톤 반환)
var _db; //콜백함수를 위해 this없이 접근할 수 있도록..
var categoryDAO = module.exports = (function init() {
	var self = {};
	
	var mongoose = require('mongoose')
	  , Schema = mongoose.Schema
	  , categorySchema = new Schema(_getSchema());
	_db = mongoose.model('Category', categorySchema);
	
	return self;
})();


		//find
categoryDAO.findById = function (done, id) {
	var where = {_id: id}
	categoryDAO.findOne(done, where);
}

categoryDAO.hasDuplicateChildTitleFromParent = function (done, parent, title) {
	var parentId = parent.id;
	return categoryDAO.hasDuplicateChildTitleFromParentId(done, parentId, title);
}
categoryDAO.hasDuplicateChildTitleFromParentId = function (done, parentId, title) {
	done.hook4dataFn(function (category) {
		if(category.isEmpty()) return false;
		else return true;
	})
	var where = {title: title, parentId: parentId}
	categoryDAO.findOne(done, where);
}

categoryDAO.findChildsFromParent = function (done, parent) {
	var where = {parentId: parent.id}
	categoryDAO.findAll(done, where);
}
categoryDAO.findOne = function (done, where, select) {
	done.hook4dataFn(Category.createBy);
	var where = where || {}
	   ,select = select || {}
	   ,callback = done.getCallback();
	_db.findOne(where,select).exec(callback);
};
categoryDAO.findAll = function (done, where) {
	done.hook4dataFn(Category.createBy);
	var where = where || {}
		,select = select || {}
		,callback = done.getCallback();
	  _db.find(where,select).exec(callback);
}


		// insert
// 부모의 직계 자식들중 일치하는 title이 있는지 확인. 
categoryDAO.insertChildToParentByTitle = function(done, parent, title) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	
	var newChildCategory = Category.createBy({ title:title
		 									 , deep: (++parent.deep)
		 									 , parentId: parent.id });
	
	H.call4promise(categoryDAO.hasDuplicateChildTitleFromParent, parent, title)
	 .then(function (hasDuplicateChildTitle) {
		 if(hasDuplicateChildTitle) 
			 return 'err : already exist category title';
		 else 
			 return H.call4promise(_create, newChildCategory); 
	 })
	 .then(dataFn)
	 .catch(errFn)
	
};
function _create(done, data) {
	done.hook4dataFn(Category.createBy);
	_db.create(data, done.getCallback());
};

		//update
categoryDAO.increasePostCountById = function(done, id) {
	var where = {_id : id}
	,data = {$inc : {postCount : 1}};
	
	_update(done, where, data);
};
categoryDAO.updateTitleByCategory = function(done, category, newTitle) {
	done.hook4dataFn(function (successMessageOrErrString) {
		if(_.isString(successMessageOrErrString)) return successMessageOrErrString; 
		
		if(successMessageOrErrString == 1) return 'success';
		else return 'err : update fail by db';
	});
	
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	var parentId = category.parentId
	  , categoryId = category.id;
	
	H.call4promise(categoryDAO.hasDuplicateChildTitleFromParentId, parentId, newTitle)
	 .then(function (hasDuplicateChildTitle) {
		 if(hasDuplicateChildTitle) 
			 return 'already exist category title';
		 else 
			 return H.call4promise(categoryDAO.updateTitleById, categoryId, newTitle); 
	 })
	 .then(dataFn)
	 .catch(errFn)
};
categoryDAO.updateTitleById = function(done, id, title) {
	var where = {_id : id}
	,data = {title: title};
	
	_update(done, where, data);
};
function _update(done, where, data, config) {
	if(!(H.exist(done))) throw new Error('done need when update');
	//TODO: writeConcern 는 무엇을 위한 설정일까. //매치되는 doc없으면 새로 생성안해.//매치되는 doc 모두 업데이트
	var config = config || {upsert: false , multi:true}
	   ,callback = done.getCallback();
	_db.update(where, data, config).exec(callback);
}

		// remove
categoryDAO.removeAll = function (done) {
	var where = {};
	_remove(done,where)
}
// postCount가 0이고 childCategory가 없어야 삭제가능.
categoryDAO.removeById = function (done, id) {
	var where = {_id: id};
	
	H.call4promise(categoryDAO.findById, id)
	 .then(function (category){
		 if(category.isEmpty()) return 'err : not found category by'+ category.id;
		 if(category.hasPost()) return 'err : cannot remove because category has post '+ category.postCount;
		 return H.call4promise(categoryDAO.findChildsFromParent, category);
	 })
	 .then(function(errStringOrChilds) {
		 if(_.isString(errStringOrChilds)) return errStringOrChilds;
		 if(!(_.isEmpty(errStringOrChilds))) return 'err : cannot remove because category has child categories';
		 
		 return H.call4promise(_remove, where);
	 })
	 .then(function(errStringOrSuccessBool) {
		 return done.getDataFn()(errStringOrSuccessBool);
	 })
	 .catch(function(err) {return done.getErrFn()(err)})
	
	
};
function _remove(done, where) {
	done.hook4dataFn(function (success) {
		if(success) return 'success'
		else return 'err : fail';
	})
	_db.remove(where, done.getCallback());
}


/* helper */		
function _getSchema() {
	return {
        'title' : String,
        'postCount' : Number,
        'deep' : Number,
        'parentId' : String
		};
};