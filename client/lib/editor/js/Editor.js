
/**
 *  class Editor
 *  
 */

$$namespace.include(function(require, module) {
	/*
	 * private static field
	 */

	var DEFAULT_ID = "editor"
	  , DEFAULT_FRAME_ID = "editorContent"
	  , DEFAULT_CONTENT_BODY_ID = "wysiwyg";
	/**
	 * constructor , instance fields
	 */ 
	var H = require('util/helper')
	var nodeDecorator = require('part/nodeDecorator')
	  , History = require('part/History')
	  , RangeManager = require('part/RangeManager')
	  , ButtonManager = require('event/ButtonManager')
	
	var Editor = module.exports = function Editor(contentText, imageUploadCallback) {
		this._imageUploadCallback = imageUploadCallback || function(){}
		
		this._id = DEFAULT_ID;
		this._frameId = DEFAULT_FRAME_ID;
		this._contentFrame = document.getElementById(this._frameId);
		if(!(this._contentFrame)) throw id+" must be id of frame";
		
		this._contentDoc = this._contentFrame.contentDocument;
		this._contentBody = this._contentDoc.body;
		
		this._decorator = nodeDecorator;
		
		this._history = new History(this);
		this._rangeManager = new RangeManager(this);
		this._btnManager = new ButtonManager(this); //TODO: 일관성. 생성시 누구는 new누구는 그냥이라니.
		
		this._init(contentText);
	};
	//TODO : 리펙토링 - 각 작업 분리해야지.
	Editor.prototype._init = function _init(contentText) {
		if(contentText == null || contentText == undefined || contentText == '') contentText = '<p>&#8203</p>'
		
		var contentBody = this.getContentBody();	
		contentBody.innerHTML = contentText
		contentBody.setAttribute('id', DEFAULT_CONTENT_BODY_ID)
		contentBody.setAttribute('contenteditable', true)
		
		this._btnManager.assignEvent()
		var node = this._contentDoc.getElementsByTagName('p')[0];
		var range =this._rangeManager.getDefaultRange(node);
		this._rangeManager.updateRange(range);
		
		this.focus();
	};

	//	public method function
	Editor.prototype.focus = function() {
		this._contentBody.focus();
	};
	//-------------update selectedNode ----------------
		// 줄 단위로 가운데, 왼쪽..등 이동할때 사용하네.
	Editor.prototype.updateSelectedNodeByExecCommand = function (cmd, bool, value) {
		this._contentDoc.execCommand(cmd, bool, value);
	};
	Editor.prototype.updateNodesInLines = function(lines,style) {
		var	rangeManager = this._rangeManager
		  , range = rangeManager.getCaretedRange()
		
		this._decorator.decorateAllNodeInLines(lines,style);
		//재설정해야되나?
		rangeManager.updateRange(range); 
	};
	Editor.prototype.updateSelectedLine = function(style) {
		var	rangeManager = this._rangeManager
		  , range = rangeManager.getCurrentRange()
		  , lines = this._decorator.decorateLineByRange(range,style)
		//범위재설정이 필요없구나.
		return lines;
	};
	Editor.prototype.updateSelectedNodes = function(style) {
		var	rangeManager = this._rangeManager
		  , range = rangeManager.getCurrentRange()
		  , startAndEndNodes = this._decorator.decorateNodesByRange(range,style)
		
//		2. 범위 업데이트
		rangeManager.updateRange(startAndEndNodes);
	};
	//------------------------------------------------
	Editor.prototype.saveAndFocus = function() {
		this._history.save();
		this.focus();
	};
	//------------------ content update--------------------
	Editor.prototype.replaceContent = function(contentData) {
		this._contentBody.innerHTML = contentData.innerHTML;
		this._rangeManager.updateRange(contentData.range);
	};
	//--------------------------------------------------
	
	/*
	 * public method getXX
	 */
	Editor.prototype.getContentFrame = function() {return this._contentFrame;	};
	Editor.prototype.getContentDoc = function() {return this._contentDoc;	};
	Editor.prototype.getContentBody = function() {return this._contentBody;	};
	
	
	Editor.prototype.getHistory = function() {return this._history;	};
	Editor.prototype.getDecorator = function() {return this._decorator;	};
	Editor.prototype.getRangeManager = function() {return this._rangeManager;	};
	Editor.prototype.getCurrentSelection = function() { return this._rangeManager.getCurrentSelection()	};
	
	Editor.prototype.getCaretedContent = function() {
		return this._rangeManager.getTemperalyCaretedContent(); //단어 확인 해야함..
	};
	Editor.prototype.getEditorElementsByClassName = function (className) {
		var editorId = "#"+this._id;
		return document.querySelectorAll(editorId +" "+className);
	};
	Editor.prototype.getEditorElementById = function (id) {
		var editorId = "#"+this._id;
		return document.querySelector(editorId +" "+id);
	};
	Editor.prototype.getContentElementById = function (id) {
		return this._contentDoc.getElementById(id);
	};
	Editor.prototype.get$lines = function () { return $(this._contentBody).find('p') }
	var CHAR_FOR_CARET = String.fromCharCode(8203)
	Editor.prototype.getCaretChar = function () { return CHAR_FOR_CARET}
	//------기타
	
	//------------------------helper	
	//submit(for insert) 할 때 textarea에 값 넣기 위함.
	Editor.prototype.getContentText = function () {
		var bodyNode = this.getContentBody();
		var text = String(bodyNode.innerHTML);
		if("<p>​</p>"== text) text = ''; // 이게맞겠지? 아닌가?
		return text
	}
	Editor.prototype.insertContent = function (text) {
		return this.getContentBody().innerHTML = text
	};
	Editor.prototype.insertImageToContent = function (imageUrl) {
        var rangeManager = this.getRangeManager() 
    	  , range = rangeManager.getCurrentRange()			
    	
    	var imgNode = document.createElement("img");
    	imgNode.setAttribute("src",imageUrl);
    	imgNode.setAttribute("style","width:100px;");
    	
    	return range.commonAncestorContainer.parentNode.appendChild(imgNode);
	}
	Editor.prototype.getImageUploadCallback = function () { return this._imageUploadCallback }
});
//@ sourceURL=editor/Editor.js