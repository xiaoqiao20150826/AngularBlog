
/**
 * 
 */

(function(define, _) {
	// 선로딩...
	define(['/resource/lib/editor/lib/namespace/$$namespace.js'
	       ,'/resource/lib/editor/editorModules.js'
	       ]
	, function() {
		return ['$scope', '$window',  'app.blogBoard.blogBoardDAO',makeEditorController]
	})
	function makeEditorController ($scope, $window, blogBoardDAO) {
//		console.log('editorContr')
		var $parent 	= $scope.$parent
		  , post		= $parent.post
		  , contentText = post.content || '';
		
		var $$editorModules = $window.$$editorModules
		  , $$namespace		= $window.$$namespace;

		//editor.html로 window에 할당된 $$namespace , $$editorModules
		$$namespace.load($$editorModules, function(require) {
			var Editor = require('/js/Editor')
			var $$editor = new Editor(contentText, imageUploadCallback);	
			$parent.$$editor = $$editor;
			
			// etc
			function imageUploadCallback(e, fileElement, editor) {
				var file 	 = fileElement.files[0]
				  , size 	 = file.size
				  , fileName = file.name.slice(0, file.name.indexOf('.'))
				var maxByte  = 2000000;
				if(size > maxByte) {
					alert('file size should be max 2MB');
					fileElement.files = null
					fileElement.value = '' 
					return e.preventDefault();
				}
				
				var formData = new $window.FormData()
				formData.append('file', file);
				blogBoardDAO.uploadImage(formData)
							.then(function(fileInfo) {
								$$editor.insertImageToContent(fileInfo.url);
								$parent.post.fileInfoes.push(fileInfo)
							})
							
			}
		}); 
	}
	
})(define, _)