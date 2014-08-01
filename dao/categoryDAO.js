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
categoryDAO.findAll = function (done) {
	done.hook4dataFn(Category.createBy);
	var where = where || {}
		,select = select || {}
		,callback = done.getCallback();
	  _db.find(where,select).exec(callback);
}
categoryDAO.findByTitle = function (done, title) {
	var where = {_id : title}
	categoryDAO.findOne(done, where);
}
categoryDAO.findOne = function (done, where, select) {
	done.hook4dataFn(Category.createBy);
	var where = where || {}
	   ,select = select || {}
	   ,callback = done.getCallback();
	_db.findOne(where,select).exec(callback);
};


		// insert
categoryDAO.insertByTitle = function(done, title) {
	var category = Category.createBy({title:title});
	categoryDAO.insertOne(done, category);
};
categoryDAO.insertOne = function (done, category) {
	_create(done, category);
};
function _create(done, data) {
	var errFn = done.getErrFn();
	
	done.setErrFn(function (err) {
		if(err.code == '11000') return done.next(true); 
		else return errFn(err);
	})
	done.hook4dataFn(Category.createBy);
	_db.create(data, done.getCallback());
};

		//update
categoryDAO.pushChildTitleToCategory = function(done, childTitle, toCategory) {
	if(!(H.exist(toCategory._id))) throw new Error('_id은 필수 when update');
	var where = {_id : toCategory._id}
	,data = {$addToSet : {childTitles : childTitle}};
	
	_update(done, where, data);
};
categoryDAO.removeChildTitleFromCategory = function (done, childTitle, fromCategory) {
	var where = {_id : fromCategory._id}
	,data = {$pull : {childTitles : childTitle}};
	
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
categoryDAO.removeByTitle = function (done, title) {
	var where = {_id: title};
	_remove(done, where);
};
categoryDAO.removeOne = function (done, category) {
	var where = {_id: category.title};
	_remove(done, where);
};
function _remove(done, where) {
	_db.remove(where, done.getCallback());
}


/* helper */		
function _getSchema() {
	return {
        '_id' : String,
        'title' : String,
        'childTitles' : Array
		};
};