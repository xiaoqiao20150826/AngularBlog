/**
 *  // Blog만을 위한 카테고리인데. BlogCategory 라고해야하나.? 
 */
var _ = require('underscore');
var H = require('../common/helper.js');

var Joiner = require('./Joiner')

var ROOT_ID = 'root'
var Category = module.exports = function () {
// 왜 _id가 아니라 id인지 기억안나면 mongodb 자료볼것.
	this.id  = null;//db의 자동 할당된 아이디 사용. 
	this.title = '';
	this.postCount = 0;
	this.parentId = Category.rootId;
	this.created = Date.now();
}

Category.rootId = ''; // Categorydao에서 초기화시 createRoot 하여 id를 받아옴.

Category.createBy= function(model) {
	if(model == null) 
		return new Category();
	else {
		return H.createTargetFromSources(Category, model);
	};
};

Category.makeRoot = function () {
	return Category.createBy({id:Category.rootId, title:'root', parentId:'', categories:[]})
}
Category.getRootId = function () {
	return Category.rootId;
}
Category.getAllId = function () {
	return '';
}
Category.isRoot = function(categoryId) {
	if(categoryId == Category.rootId || categoryId == ROOT_ID || _.isEmpty(categoryId)) return true;
	else return false;
}

Category.getJoiner4sumToChild = function getJoiner4sumToChild(categories, key4sumTo, delimiter) {
	return Category.getJoiner4sumTo(categories, key4sumTo, delimiter, true)
}
Category.getJoiner4sumToParent = function (categories, key4sumTo, delimiter) {
	return Category.getJoiner4sumTo(categories, key4sumTo, delimiter, false)
}
Category.getJoiner4sumTo = function (categories, key4sumTo, delimiter, isToChild) { 
	var categoryJoiner = new Joiner(categories, 'parentId', 'categories')
	categoryJoiner.setIdentifierKey('id')
	categoryJoiner.setKey4sumTo(key4sumTo, delimiter, isToChild)
	return categoryJoiner
}


// instance
Category.prototype.isEmpty = function() {
	if(this.id == null || this.id == '') return true;
	else return false;
}
Category.prototype.hasPost = function () {
	if(this.postCount > 0) return true;
	else return false;
}
