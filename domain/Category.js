/**
 *  // Blog만을 위한 카테고리인데. BlogCategory 라고해야하나.? 
 */
var _ = require('underscore');

var H = require('../common/helper.js');

var Category = module.exports = function () {
	this._id = '';
	this.title = '';
	this.childTitles = [];
}

Category.createBy= function(model) {
	if(model == null) 
		return new Category();
	else {
		return H.createTargetFromSources(Category, model, function(target, source) {
			if(target._id == '') target._id = target.title;
		});
	};
};

Category.prototype.isParent = function() {
	if(this.title.match('--')) return false;
	else return true;
}