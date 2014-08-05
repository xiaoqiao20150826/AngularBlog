/**
 *  // Blog만을 위한 카테고리인데. BlogCategory 라고해야하나.? 
 */
var _ = require('underscore');

var H = require('../common/helper.js');

var ROOT_ID = 'root';

var Category = module.exports = function () {
	
	this.id  = null;//db의 자동 할당된 아이디 사용.
	this.title = '';
	this.postCount = 0;
	this.deep = 1;  // 1,2,3,....;
	this.parentId = ROOT_ID;
}

Category.createBy= function(model) {
	if(model == null) 
		return new Category();
	else {
		return H.createTargetFromSources(Category, model);
	};
};

var _rootCategory = (function() {
	return Category.createBy({id:ROOT_ID, deep:0, parentId:''});
})();

Category.getRoot = function () {
	return _rootCategory;
}
// instance
Category.prototype.isEmpty = function() {
	if(this.id == null || this.title == '') return true;
	else return false;
}
Category.prototype.hasPost = function () {
	if(this.postCount > 0) return true;
	else return false;
}