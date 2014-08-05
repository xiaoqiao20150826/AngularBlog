	

(function() {
	var ns = $$namespace.package('com.kang')
	  , utilPackage = ns.package('util')
	  , adminPackage = ns.package('admin')
	  , H = utilPackage.import('helper') 
	  , log = utilPackage.import('log') 
	
	var CATEGORY_INSERT_FORM_ID = "#categoryInsertForm"
	  , $form;
	var categoryInsertForm = adminPackage.export.categoryInsertForm = {
			init : function () {
				$form = $(CATEGORY_INSERT_FORM_ID);
				$form.submit(this.insertCategoryAndReLocationAdmin);
			},
			insertCategoryAndReLocationAdmin : function (e) {
				var queryString = decodeURI($form.serialize())
				  , queryMap = H.queryStringToMap(queryString);
				
				if(_.isEmpty(queryMap.newTitle)) {
					H.redirect('/admin');
					return e.preventDefault();
				}

				
				H.ajaxCall(dataFn, 'post', 'ajax/category', queryMap);
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
})();

//@ sourceURL=admin/categoryInsertForm.js