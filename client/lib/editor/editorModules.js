(function() {
	
	// 
	var modules = [
	                  "/resource/lib/editor/js/iframeContent.js",

	                  "/resource/lib/editor/js/util/helper.js",
	                  
	                  "/resource/lib/editor/js/part/treeSearcher.js",
	                  "/resource/lib/editor/js/part/styleAppender.js",//
	                  "/resource/lib/editor/js/part/nodeDecorator.js",
	                  "/resource/lib/editor/js/part/rangeDecorator.js",
	                  "/resource/lib/editor/js/part/History.js",//
	                  "/resource/lib/editor/js/part/RangeManager.js",//
	                  
	                  "/resource/lib/editor/js/event/eventHelper.js",// 
	                  "/resource/lib/editor/js/event/dropHelper.js",// 
	                  "/resource/lib/editor/js/event/ButtonManager.js",

	                  "/resource/lib/editor/js/event/content/keyUtil.js",//
	                  "/resource/lib/editor/js/event/content/keyListener.js",//
	                  "/resource/lib/editor/js/event/content/imageWrapper.js",//
	                  "/resource/lib/editor/js/event/content/imageListener.js",//
	                  
	                  "/resource/lib/editor/js/event/button/basic.js",
	                  "/resource/lib/editor/js/event/button/undoRedo.js",
	                  "/resource/lib/editor/js/event/button/fontSize.js",
	                  "/resource/lib/editor/js/event/button/fontColor.js",
	                  "/resource/lib/editor/js/event/button/backgroundColor.js",
	                  "/resource/lib/editor/js/event/button/inOutdent.js",
	                  "/resource/lib/editor/js/event/button/imageUpload.js",
	                  "/resource/lib/editor/js/event/button/lineHeight.js",
	                  "/resource/lib/editor/js/event/button/lineStyle.js",
//	                  
	                  "/resource/lib/editor/js/Editor.js"
	                  
	                  ];
		
		//전역노출
		window.$$editorModules = modules
})()
//@ sourceURL=editor/editorModules.js