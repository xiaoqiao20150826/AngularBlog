/**
 *   정의 후 createRoot.
 */

var debug = require('debug')('nodeblog:dao:categoryDAO')

var Q = require('q')
var _ = require('underscore')
  , H = require('../../common/helper.js')
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
categoryDAO.findById = function (id) {
	var where = {_id: id}
	return categoryDAO.findOne(where);
}
categoryDAO.findByIds = function (ids) {
	ids = _.compact(ids)
	var where = {'_id': {$in : ids}}
		,select = select || {};
		
	return categoryDAO.findAll(where, select)
}

categoryDAO.findChilds = function (parentId) {
	var where = {parentId: parentId}
	return categoryDAO.findAll(where);
}
categoryDAO.findOne = function (where, select) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	
	var where = where || {}
	   ,select = select || {}
	   
	_db.findOne(where,select).exec(callback)
	
	return deferred.promise
			  	   .then(Category.createBy);
};


categoryDAO.allIdsOf= function (categoryId) {
	return  categoryDAO.findAll()
				 	   .then(function (_allCategories) {
				 			return _allIds(categoryId, _allCategories);
					   })
}

// categoryId와 그 자식의 모든 id를 모아서 반환.
function _allIds (categoryId, allCategories) {
	var category = Category.createBy({id: categoryId})
	  , joiner = new Joiner(allCategories, 'parentId')
	
	joiner.setKey4aggregateToParent('id',',')
	var root = joiner.findNode(category, 'id')
	
	var categoryOfTree = joiner.treeTo(root, 'id')
      , ids = categoryOfTree['id'].split(',')
      
    return ids
}

categoryDAO.findAll = function (where, select) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	
	var where = where || {}
		,select = select || {}
		
	 _db.find(where,select).exec(callback);
	 
	 return deferred.promise
	 			    .then(Category.createBy);
}


		// insert
// 부모의 직계 자식들중 일치하는 title이 있는지 확인. 
categoryDAO.insertChild = function(parentId, newTitle) {
	if(H.notExist(parentId)) return console.error(parentId + ':this must have parentId')
	if(H.notExist(newTitle)) return console.error(newTitle + ':this must have newTitle')
	
	var newChildCategory = Category.createBy({ title:newTitle, parentId: parentId });
	
	return   categoryDAO.isDuplicate(parentId, newTitle)
						.then(function (isDuplicate) {
							 if(isDuplicate) return Status.makeError('err : already exist category title');
							 else return categoryDAO.insertOne(newChildCategory); 
			 		   	})
};
//부모아이디를 기준으로 형제중에 중복된 title이 있는지 확인해보는 것.
categoryDAO.isDuplicate = function (parentId, newTitle) {
	if(H.notExist(parentId)) return console.error(parentId + ':this must have parentId')
	if(H.notExist(newTitle)) return console.error(newTitle + ':this must have newTitle')
	
	var where = {title: newTitle, parentId: parentId}
	
	return categoryDAO.findOne(where)
					  .then(function (category) {
					  		if(category.isEmpty()) return false;
					  		else return true;
					  })		
}


//단한번만 호출된다. 
categoryDAO.createRoot = function () {
	var root = Category.makeRoot();
	
	return    categoryDAO.findFirstCreated()
						 .then(function (category) {
							 if(category.isEmpty()) {
								 return _create(root)
								  		 .then(function (rootCategory) {
											 debug('create rootCategory', rootCategory)
											 Category.rootId = rootCategory.id
											 return rootCategory
										 })
										 .catch(function (err) { console.error('fail create root ', err)})				 
							 } else {
								 debug('found rootCategory', category)
								 Category.rootId = category.id
								 return category
							 }
						 })
						 .catch(function (err) {console.error('fail create root ', err)})
}

categoryDAO.findFirstCreated = function () {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	
	var where = where || {}
	  , select = select || {}
	  , sorter = {created: 1}
	  
	_db.findOne(where,select).sort().exec(callback);
	  
	return deferred.promise 		  
	  			   .then(Category.createBy);
};


categoryDAO.insertOne = function(category) {
	return _create(category)
};
function _create(data) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	
	if(!data._id) data._id = new ObjectId()
	
	_db.create(data, callback);
	
	return deferred.promise
	   			   .then(Category.createBy)
};

		//update
categoryDAO.increasePostCountById = function(id) {
	var where = {_id : id}
	  , data = {$inc : {postCount : 1}};
	
	return _update(where, data);
};
categoryDAO.decreasePostCountById = function(id) {
	var where = {_id : id}
	  , data = {$inc : {postCount : -1}};
	
	return _update(where, data);
};

categoryDAO.decreasePostCountByIdAndCountMap = function(idAndCountMap) {
	var deferred  = Q.defer()
	
	var successStatus = Status.makeSuccess()
	  , categoryIds = _.keys(idAndCountMap)
	  
	var idAndCountList = _.map(categoryIds, function(v, i){
		return {id : v, count : idAndCountMap[v]}
	})
	
	debug('idAndCountList', idAndCountList)
	
	var statuses = []
	_.reduce(idAndCountList, function (p, idAndCount) {
		
		return p.then(function(status) {
						if(status) statuses.push(status)
						
						return categoryDAO.decreasePostCountByIdAndCount(idAndCount)
				})
				
	},Q())
	.then(function lastCallback() {
		if(_.isEmpty(statuses)) return deferred.resolve(successStatus)
		
		for(var i in statuses) {
			var status = statuses[i]
			if(status.isError()) return deferred.resolve(status.appendMessage('category'+i+' delete fail')) 
		}
		
		return deferred.resolve(successStatus)
	})
	
	//--------------
	return deferred.promise;
};

categoryDAO.decreasePostCountByIdAndCount = function(idAndCount) {
	var deferred  = Q.defer()
	
	var where = {_id : idAndCount.id}
	  , data = {$inc : {postCount : (idAndCount.count * -1) }};
	
	_update(where, data)
		   .then(function(result) { return deferred.resolve(status); })
           .catch(function (err) {
        	  var status = Status.makeError('$decreasePostCountByIdAndCount faile', err)
        	  return deferred.resolve(status);
           });
	//
	return deferred.promise;
};


categoryDAO.updateTitle = function(categoryId, newTitle) {
	if(H.notExist(categoryId)) return console.error(categoryId + ':this must have categoryId')
	if(H.notExist(newTitle)) return console.error(newTitle + ':this must have newTitle')
	
	return  categoryDAO.findById(categoryId)
					   .then(function (category) {
						   return categoryDAO.isDuplicate(category.parentId, newTitle)
					   })
					   .then(function (isDuplicate) {
						   if(isDuplicate)
							   return Status.makeError('already exist category title');
						   else 
							   return categoryDAO._updateTitleById(categoryId, newTitle);				   
					   })
};

categoryDAO._updateTitleById = function(id, title) {
	var where = {_id : id}
	,data = {$set: {title: title}};
	
	return _update(where, data);
};

function _update(where, data, config) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	
	//TODO: writeConcern 는 무엇을 위한 설정일까. //매치되는 doc없으면 새로 생성안해.//매치되는 doc 모두 업데이트
	var config = config || {upsert: false , multi:true}
	
	_db.update(where, data, config, callback);
	
	return deferred.promise
	               .then(function (result) {
	           			debug('update arg', result)
	           			return Status.makeForUpdate(result)
	               	})
}

		// remove
categoryDAO.removeAll = function () {
	var where = {};
	return _remove(where)
}
// postCount가 0이고 childCategory가 없어야 삭제가능.
// $return 
//      1) status instance
categoryDAO.removeById = function (id) {
	var where = {_id: id};
	
	return categoryDAO.findById(id)
			 .then(function (category){
				 if(category.isEmpty()) return Status.makeError('err : not found category by '+ category.id);
				 if(category.hasPost()) return Status.makeError('err : cannot remove because category has post '+ category.postCount);
				 return categoryDAO.findChilds(category.id);
			 })
			 .then(function(statusOrChilds) {
				 if(Status.isStatusType(statusOrChilds)) {return statusOrChilds; }
				 else {
					 var childs = statusOrChilds;
					 if(!(_.isEmpty(childs))) return Status.makeError('err : cannot remove because category has child categories');
					 
					 if(_.isEmpty(childs)) return _remove(where);
				 }
			 })
};
function _remove(done, where) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	
	_db.remove(where, callback);
	
	return deferred.promise
				   .then(function (data) {
						debug('remove arg', data)
						return Status.makeForRemove(data)
					});
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
