
$$namespace.include(function(require, module) {
	var H = this.require('/util/helper') 

	var categoryView = this.require('/view/centerFrame/admin/categoryView') 
		
	//
	var adminController = module.exports = {}
	
	adminController.onHandler = function (app) {
		app.onSubmit(categoryView.get$insertForm(), this.insertForm)
		app.onSubmit(categoryView.get$deleteForm(), this.deleteForm)
	}
	
	adminController.insertForm= function (e) {
		var $form = categoryView.get$insertForm()
		var queryString = decodeURI($form.serialize())
		  , queryMap = H.queryStringToMap(queryString)
		  , newCategory = { parentId : queryMap.categoryId //select의 name
				  		  , newTitle : queryMap.newTitle
				  		  };
		
		if(_.isEmpty(newCategory.newTitle)) {
			alert('newTitle should not be empty');
			H.redirect('/admin');
			return e.preventDefault();
		}
		
		H.ajaxCall(dataFn, 'post', 'ajax/category', newCategory);
		return e.preventDefault();
		
		function dataFn (resultString) {
				alert(resultString);
				return H.redirect('/admin');
		}
	}
	adminController.deleteForm = function (e) {
		var $form = categoryView.get$deleteForm()
		var queryString = decodeURI($form.serialize())
		  , queryMap = H.queryStringToMap(queryString)
		  , categoryId = queryMap.categoryId
		
		//root가 나올일이 없는데.
		if(categoryView.isRoot(categoryId)) {
			alert('root can not be remove')
			H.redirect('/admin');
			return e.preventDefault();
		}

		H.ajaxCall(dataFn, 'post', 'ajax/category/delete', queryMap);
		return e.preventDefault();
		
		function dataFn (resultString) {
				alert(resultString);
				H.redirect('/admin');
				return $.prepend();
		}

	}
});

//@ sourceURL=/controller/adminController.js