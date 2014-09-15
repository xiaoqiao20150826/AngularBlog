(function() {
	
	// 
	var modules = [
	                  "/resources/lib/editor/js/iframeContent.js",
	                  
	                  "/resources/lib/editor/js/part/treeSearcher.js",
	                  "/resources/lib/editor/js/part/styleAppender.js",//
	                  "/resources/lib/editor/js/part/nodeDecorator.js",
	                  "/resources/lib/editor/js/part/History.js",//
	                  "/resources/lib/editor/js/part/RangeManager.js",//
	                  
	                  "/resources/lib/editor/js/event/eventHelper.js",// 
	                  "/resources/lib/editor/js/event/dropHelper.js",// 
	                  "/resources/lib/editor/js/event/ButtonManager.js",

	                  "/resources/lib/editor/js/event/content/keyListner.js",//
	                  "/resources/lib/editor/js/event/content/imageWrapper.js",//
	                  "/resources/lib/editor/js/event/content/imageListener.js",//
	                  
	                  "/resources/lib/editor/js/event/button/basic.js",
	                  "/resources/lib/editor/js/event/button/undoRedo.js",
	                  "/resources/lib/editor/js/event/button/fontSize.js",
	                  "/resources/lib/editor/js/event/button/fontColor.js",
	                  "/resources/lib/editor/js/event/button/backgroundColor.js",
	                  "/resources/lib/editor/js/event/button/inOutdent.js",
	                  "/resources/lib/editor/js/event/button/lineHeight.js",
	                  "/resources/lib/editor/js/event/button/lineStyle.js",
	                  "/resources/lib/editor/js/event/button/image.js",
//	                  
	                  "/resources/lib/editor/js/Editor.js"
	                  
	                  ];
	$$namespace.load(modules, function (require, loadedModules) {
		var Editor = require('/js/Editor')
		var editor = new Editor();
	});
	
})()
