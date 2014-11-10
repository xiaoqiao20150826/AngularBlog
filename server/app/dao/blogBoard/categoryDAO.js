/**
 *   정의 후 createRoot.
 */

var debug = require('debug')('nodeblog:dao:categoryDAO')
var _ = require('underscore')
  , H = require('../../common/helper.js')
  , Done = H.Done
  , Status = require('../../common/Status.js')
  , Category = require('../../domain/blogBoard/Category.js')
  , Joiner = require('../util/Joiner.js')

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId4Schema = Schema.ObjectId
  , ObjectId = mongoose.Types.ObjectId
  , categorySchema = new Schema(_getSchema())
  , _db = mongoose.model('Category', categorySchema)  
//////////////////////////////
var categoryDAO = module.exports = {};

//find
categoryDAO.findById = function (done, id) {
	var where = {_id: id}
	categoryDAO.findOne(done, where);
}
categoryDAO.findByIds = function (done, ids) {
	ids = _.compact(ids)
	var where = {'_id': {$in : ids}}
		,select = select || {};
		
	categoryDAO.findAll(done, where, select)
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
categoryDAO.findFirstCreated = function (done) {
	done.hook4dataFn(Category.createBy);
	var where = where || {}
	  , select = select || {}
	  , sorter = {created: 1}
	  , callback = done.getCallback();
	_db.findOne(where,select).sort().exec(callback);
};
categoryDAO.findIdsOfIncludeChildIdAndAllCategories = function (done, categoryId) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()

	var result = {}  
	return H.call4promise(categoryDAO.findAll)
	 		.then(function (_allCategories) {
	 			result.allCategories = H.deepClone(_allCategories);
	 			result.categoryIds = idsOfAllChildAndCategory(categoryId, _allCategories);
				 
				return dataFn(result);
		   })
			.catch(errFn)
}

// categoryId와 그 자식의 모든 id를 모아서 반환.
function idsOfAllChildAndCategory (categoryId, allCategories) {
	var category = Category.createBy({id: categoryId})
	  , joiner = new Joiner(allCategories, 'parentId')
	
	joiner.setKey4aggregateToParent('id',',')
	var root = joiner.findNode(category, 'id')
	
	var categoryOfTree = joiner.treeTo(root, 'id')
      , ids = categoryOfTree['id'].split(',')
      
    return ids
}

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
//단한번만 호출된다. 
categoryDAO.createRoot = function (done) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	var root = Category.makeRoot();
	
	H.call4promise(categoryDAO.findFirstCreated)
	 .then(function (category) {
		 if(category.isEmpty()) {
			 return H.call4promise(_create, root)
			  		 .then(function (rootCategory) {
						 debug('create rootCategory', rootCategory)
						 Category.rootId = rootCategory.id
						 return dataFn(rootCategory)
					 })
					 .catch(function (err) { console.error('fail create root ', err)})				 
		 } else {
			 debug('found rootCategory', category)
			 Category.rootId = category.id
			 return dataFn(category)
		 }
	 })
	 .catch(function (err) {
		 console.error('fail create root ', err)
		 errFn(err)
	 })
}

//removeCancler test 용
categoryDAO.insertOne = function(done, category) {
	_create(done, category)
};
function _create(done, data) {
	done.hook4dataFn(Category.createBy);
	
	if(!data._id) data._id = new ObjectId()
	
	_db.create(data, done.getCallback());
};

		//update
categoryDAO.increasePostCountById = function(done, id) {
	var where = {_id : id}
	,data = {$inc : {postCount : 1}};
	
	_update(done, where, data);
};
categoryDAO.decreasePostCountById = function(done, id) {
	var where = {_id : id}
	,data = {$inc : {postCount : -1}};
	
	_update(done, where, data);
};

categoryDAO.decreasePostCountByIdAndCountMap = function(done, idAndCountMap) {
	var dataFn = done.getDataFn()
	  , successStatus = Status.makeSuccess()
	  , categoryIds = _.keys(idAndCountMap)
	  
	var idAndCountList = _.map(categoryIds, function(v, i){
		return {id : v, count : idAndCountMap[v]}
	})
	debug('idAndCountList', idAndCountList)  
	H.asyncLoop(idAndCountList , categoryDAO.decreasePostCountByIdAndCount, new Done(lastCallback, eachErrFn))
	
	function lastCallback(statuses) {
		if(_.isEmpty(statuses)) return dataFn(successStatus)
		
		for(var i in statuses) {
			var status = statuses[i]
			if(status.isError()) return dataFn(status.appendMessage('category'+i+' delete fail')) 
		}
		
		return dataFn(successStatus)
	}
	function eachErrFn(err) {
		return dataFn(Status.makeError('err :'+ err))
	}
};
categoryDAO.decreasePostCountByIdAndCount = function(done, idAndCount) {
	var where = {_id : idAndCount.id}
	  , data = {$inc : {postCount : (idAndCount.count * -1) }};
	var dataFn = done.getDataFn()
	done.setErrFn(function (err) {
		return dataFn(Status.makeError('$decreasePostCountByIdAndCount faile', err))
	})
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
	done.hook4dataFn(function (result) {
		debug('update arg', result)
		return Status.makeForUpdate(result)
	})
	//TODO: writeConcern 는 무엇을 위한 설정일까. //매치되는 doc없으면 새로 생성안해.//매치되는 doc 모두 업데이트
	var config = config || {upsert: false , multi:true}
	   ,callback = done.getCallback();
	_db.update(where, data, config, callback);
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
		 if(category.isEmpty()) return Status.makeError('err : not found category by '+ category.id);
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
		debug('remove arg', data)
		return Status.makeForRemove(data)
	})
	_db.remove(where, done.getCallback());
}


/* helper */		
function _getSchema() {
	return {
		'_id': {type:ObjectId4Schema}, // default로 값을 할당하면 create 후 id가 반환되지않는다.
        'title' : String,
        'postCount' : Number,
        'parentId' : String,
        'created' : Date
		};
};
