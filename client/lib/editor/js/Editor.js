
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
	/**
	 * constructor , instance fields
	 */ 
	var H = require('util/helper')
	var nodeDecorator = require('part/nodeDecorator')
	  , History = require('part/History')
	  , RangeManager = require('part/RangeManager')
	  , ButtonManager = require('event/ButtonManager')
	
	var Editor = module.exports = function Editor(contentText, imageUploadCallback) {
		// 1.editor 대상이 될 프레임.
		this._id = DEFAULT_ID;
		this._frameId = DEFAULT_FRAME_ID;
		this._contentFrame = document.getElementById(this._frameId);
		if(!(this._contentFrame)) throw id+" must be id of frame";
		this._contentDoc = this._contentFrame.contentDocument;

		this._initContent(contentText);
		this._contentBody = this._contentDoc.body;
		
		//3. 의존성 모듈 초기화.
		this._initDepedencies(imageUploadCallback)
		
		//4. 포커스
		this.lastFocus();
	};
	Editor.prototype._initDepedencies = function (imageUploadCallback) {
		this._imageUploadCallback = imageUploadCallback || function(){}
		
		this._decorator = nodeDecorator;
		this._history = new History(this);
		this._rangeManager = new RangeManager(this);
		this._btnManager = new ButtonManager(this);
		
		this._btnManager.assignEvent(); //이건 분리해놓을필요있나.
	}
	Editor.prototype._initContent = function _init(contentText) {
		if(contentText == null || contentText == undefined || contentText == '') contentText = '<p></p>'
		
		var wysiwygHTML = '<html lang="ko"><head>'
				+ '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'
				+ '<link rel="stylesheet" href="/resource/lib/editor/css/editorContent.css">'
				+ '<title>Wygiwyg Panel</title>'
				+ '</head>'
				+ '<body id="wysiwyg" contenteditable="true">'
				+ contentText
				+ '</body></html>';	
			
		this._contentDoc.write(wysiwygHTML);
		this._contentDoc.close(); 			//close 호출되야함.  왜?? 없어도 되던데.
	};

	//	public method function
	Editor.prototype.focus = function() {
		this._contentBody.focus();
	};
	Editor.prototype.lastFocus = function() {
		var lastLine = this._contentBody.lastElementChild
		  , newSpan  = document.createElement('span');
		
		newSpan.innerHTML = "&#8203;";   
		lastLine.appendChild(newSpan);
		
		var range =this._rangeManager.getDefaultRange(newSpan);
		range.isSingleCaret = true;
		
		this._rangeManager.updateRange(range);
		this.focus();
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