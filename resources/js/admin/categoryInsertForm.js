	

$$namespace.include(function(exports, require) {
	var H = require('helper') 
	
	var CATEGORY_INSERT_FORM_ID = "#categoryInsertForm"
	  , $form;
	var categoryInsertForm = exports.categoryInsertForm = {
			init : function () {
				$form = $(CATEGORY_INSERT_FORM_ID);
				$form.submit(this.insertCategoryAndReLocationAdmin);
			},
			insertCategoryAndReLocationAdmin : function (e) {
				var queryString = decodeURI($form.serialize())
				  , queryMap = H.queryStringToMap(queryString)
				  , newCategory = { parentId : queryMap.categoryId //select의 name
						  		  , newTitle : queryMap.newTitle
						  		  };				
				if(_.isEmpty(newCategory.newTitle)) {
					H.redirect('/admin');
					return e.preventDefault();
				}

				
				H.ajaxCall(dataFn, 'post', 'ajax/category', newCategory);
				return e.preventDefault();
				
				function dataFn (resultString) {
					if(H.isErrMessage(resultString)) {
						alert(resultString);
						H.redirect('/admin');
						return $.prepend();
					} else {
						H.redirect('/admin')
						return $.prepend();
					}
				}
			}
	};
	/// 실행
	categoryInsertForm.init();
});

//@ sourceURL=admin/categoryInsertForm.js