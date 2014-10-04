
$$namespace.include(function(require, module) {
	var H = this.require('/util/helper') 
	  , ajax = this.require('/util/ajax') 

		
	//
	var AdminController = module.exports = function (app) {
		this.app = app
	}
	
	AdminController.prototype.onHandler = function () {
		var app = this.app
		var viewManager = this.app.getViewManager()
		  , adminView = viewManager.getAdminView()
		
		app.onSubmit(adminView.get$insertFormOfCategory(), this.insertFormOfCategory1(adminView))
		app.onSubmit(adminView.get$deleteFormOfCategory(), this.deleteFormOfCategory1(adminView))
	}
	
	AdminController.prototype.insertFormOfCategory1 = function (adminView) {
		
		return function (e) {
			var $form = adminView.get$insertFormOfCategory()
			var queryString = decodeURI($form.serialize())
			  , queryMap = H.queryStringToMap(queryString)
			  , newCategory = { parentId : queryMap.categoryId //select의 name
					  		  , newTitle : queryMap.newTitle
					  		  };
			
			if(_.isEmpty(newCategory.newTitle)) {
				alert('newTitle should not be empty');
				return e.preventDefault();
			}
			
			ajax.call(dataFn, 'admin/category/insert', newCategory);
			function dataFn (resultString) {
					alert(resultString);
					return H.redirect('/admin');
			}
			
			return e.preventDefault();
		}
	}
	AdminController.prototype.deleteFormOfCategory1 = function (adminView) {
		return function (e) {
			var $form = adminView.get$deleteFormOfCategory()
			var queryString = decodeURI($form.serialize())
			  , queryMap = H.queryStringToMap(queryString)
			  , categoryId = queryMap.categoryId
			
			ajax.call(dataFn, 'admin/category/delete', queryMap);
			function dataFn (resultString) {
					alert(resultString);
					H.redirect('/admin');
			}
			
			return e.preventDefault();
		}
	}
});

//@ sourceURL=/controller/AdminController.js