/**
 * 
 */
var debug = require('debug')('nodeblog:dao:categoryDAO')
var _ = require('underscore')
  , H = require('../common/helper.js')
  , Category = require('../domain/Category.js')
  , Status = require('../domain/Status.js')

var DEFAULT_TITLE = '기본';
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
categoryDAO.findByIds = function (done, ids) {
	ids = mustNotContainRootAndEmpty(ids)
	var where = {'_id': {$in : ids}}
		,select = select || {};
		
	categoryDAO.findAll(done, where, select)
}
function mustNotContainRootAndEmpty(ids) {
	return _.filter(ids, function(id) {
		return !(Category.isRoot(id) ) && !(_.isEmpty(id))
	})
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
categoryDAO.findAll = function (done, where, select) {
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
		 									 , parentId: parent.id });
	
	debug('parentCategory', parent)
	debug('newChildCategory', newChildCategory)
	H.call4promise(categoryDAO.hasDuplicateChildTitleFromParent, parent, title)
	 .then(function (hasDuplicateChildTitle) {
		 if(hasDuplicateChildTitle) 
			 return Status.makeError('err : already exist category title');
		 else 
			 return H.call4promise(_create, newChildCategory); 
	 })
	 .then(function(statusOrNewCategory) {
		 if(Status.isStatusType(statusOrNewCategory)) return statusOrNewCategory;
		 else return Status.makeSuccess();
		 //TODO: create에 성공 실패에 맞게 처리해야할텐데.
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
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	var parentId = category.parentId
	  , categoryId = category.id;
	
	H.call4promise(categoryDAO.hasDuplicateChildTitleFromParentId, parentId, newTitle)
	 .then(function (hasDuplicateChildTitle) {
		 if(hasDuplicateChildTitle) 
			 return Status.makeError('already exist category title');
		 else 
			 return H.call4promise(categoryDAO.updateTitleById, categoryId, newTitle); 
	 })
	 .then(dataFn)
	 .catch(errFn)
};
categoryDAO.updateTitleById = function(done, id, title) {
	var where = {_id : id}
	,data = {$set: {title: title}};
	
	_update(done, where, data);
};
function _update(done, where, data, config) {
	done.hook4dataFn(function (isSuccess) {
		debug('update arg', arguments)
		return Status.makeForUpdate(data)
	})
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
// $return 
//      1) status instance
categoryDAO.removeById = function (done, id) {
	var where = {_id: id};
	
	H.call4promise(categoryDAO.findById, id)
	 .then(function (category){
		 if(category.isEmpty()) return Status.makeError('err : not found category by'+ category.id);
		 if(category.hasPost()) return Status.makeError('err : cannot remove because category has post '+ category.postCount);
		 return H.call4promise(categoryDAO.findChildsFromParent, category);
	 })
	 .then(function(statusOrChilds) {
		 if(Status.isStatusType(statusOrChilds)) {return statusOrChilds; }
		 else {
			 var childs = statusOrChilds;
			 if(!(_.isEmpty(childs))) return Status.makeError('err : cannot remove because category has child categories');
			 
			 if(_.isEmpty(childs)) return H.call4promise(_remove, where);
		 }
	 })
	 .then(function (resultStatus) {
		 done.return(resultStatus);
	 })
	 .catch(done.getErrFn())
	
	
};
function _remove(done, where) {
	done.hook4dataFn(function (data) {
		debug('remove arg', arguments)
		return Status.makeForRemove(data)
	})
	_db.remove(where, done.getCallback());
}


/* helper */		
function _getSchema() {
	return {
        'title' : String,
        'postCount' : Number,
        'parentId' : String
		};
};