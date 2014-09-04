/**
 * 
 */

$$namespace.include(function (require, module) {

	
	
	var AdminView = module.exports = function (categoryView) {
		this.categoryView = categoryView
	}

	AdminView.prototype.get$insertFormOfCategory = function () { return this.categoryView.get$insertForm() }
	AdminView.prototype.get$deleteFormOfCategory = function () { return this.categoryView.get$deleteForm() }
	
	AdminView.prototype.assignEffect = function (blogMap) {
	}
	
})

