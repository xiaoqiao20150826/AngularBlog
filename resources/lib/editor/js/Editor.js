
/**
 *  class Editor
 *  
 */

$$namespace.include(function(require, module) {
	/*
	 * private static field
	 */
	
	var DEFAULT_ID = "editor",
		DEFAULT_FRAME_ID = "editorContent";
	/**
	 * constructor , instance fields
	 */ 
	
	var nodeDecorator = require('part/nodeDecorator')
	  , History = require('part/History')
	  , RangeManager = require('part/RangeManager')
	  , ButtonManager = require('event/ButtonManager')
	
	var Editor = module.exports = function Editor(textareaName) {
		if(!textareaName) throw 'textareaName should be exist for insert and update'
		this._id = DEFAULT_ID;
		this._frameId = DEFAULT_FRAME_ID;
		this._textareaName = textareaName;
		this._contentFrame = document.getElementById(this._frameId);
		if(!(this._contentFrame)) throw id+" must be id of frame";
		
		this._contentDoc = this._contentFrame.contentDocument;
		this._contentBody = this._contentDoc.body;
		
		this._decorator = nodeDecorator;
		
		this._history = new History(this);
		this._rangeManager = new RangeManager(this);
		this._btnManager = new ButtonManager(this); //TODO: 일관성. 생성시 누구는 new누구는 그냥이라니.
		
		this._init();
	};
	/*
	 * public method getXX
	 */
	Editor.prototype.getContentFrame = function() {return this._contentFrame;	};
	Editor.prototype.getContentDoc = function() {return this._contentDoc;	};
	Editor.prototype.getContentBody = function() {return this._contentBody;	};
	Editor.prototype.getTextareaContent = function() {
		var query = 'textarea[name="' + this._textareaName + '"]' 
		return document.querySelector(query);
	};
	
	
	Editor.prototype.getHistory = function() {return this._history;	};
	Editor.prototype.getDecorator = function() {return this._decorator;	};
	Editor.prototype.getRangeManager = function() {return this._rangeManager;	};
	
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

	//	public method function
	Editor.prototype.focus = function() {
		this._contentBody.focus();
	};
	//-------------update selectedNode ----------------
	Editor.prototype.updateSelectedNodeByExecCommand = function (cmd, bool, value) {
		this._contentDoc.execCommand(cmd, bool, value);
	};
	Editor.prototype.updateNodesInLines = function(lines,style) {
		var	rangeManager = this._rangeManager;
		//1. 데코레이트,
		var range = rangeManager.getCaretedRange();
		this._decorator.decorateAllNodeInLines(lines,style);
		rangeManager.updateRange(range); 
	};
	Editor.prototype.updateSelectedLine = function(style) {
		var	rangeManager = this._rangeManager;
		//1. 데코레이트, 
		var range = rangeManager.getCurrentRange();
		var lines = this._decorator.decorateLineBy(range,style);
		
		return lines;
	};
	Editor.prototype.updateSelectedNodes = function(style) {
		var	rangeManager = this._rangeManager;
		//1. 데코레이트, 
		var range = rangeManager.getCurrentRange();
		var textNodes = this._decorator.decorateNodesBy(range,style);
		
//		2. 범위 업데이트
		rangeManager.updateRange(textNodes);
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
	Editor.prototype.isInitContent = function () {
		var $contentBody = $(this._contentBody)
		  , $childrens = $contentBody.children()
		  , childsLength = $childrens.length
		
		if(childsLength == 1) { //p노드가 하나이고.
			var text = $childrens.text()
			if(text == "") return true;
			else return false;
		}
		return false;
	}
	//--------------------------------------------------
	
	Editor.prototype._init = function _init() {
		//TODO : 리펙토링 - 각 작업 분리해야지.
		var initText = this.getTextareaContent().value
		if(!(initText == '' || initText == undefined)) this.getContentBody().innerHTML = initText
		
		this._btnManager.assignEvent()
		var node = this._contentDoc.getElementsByTagName('p')[0];
		var range =this._rangeManager.getDefaultRange(node);
		this._rangeManager.updateRange(range);
		
		this.focus();
	};
	
	//------------------------helper	
	// 외부 api들...인데 이름도 그렇고..좀 그렇네..
	//submit(for insert) 할 때 textarea에 값 넣기 위함.
	Editor.prototype.insertContentToTextarea = function () {
		var bodyNode = this.getContentBody();
		var text = String(bodyNode.innerHTML);
		if("<p>​</p>"== text) return text == '';
		
		return this.getTextareaContent().value = text;
	};
	
	Editor.prototype.insertImageToContent = function (imageUrl) {
        var rangeManager = this.getRangeManager() 
    	  , range = rangeManager.getCurrentRange()			
    	
    	var imgNode = document.createElement("img");
    	imgNode.setAttribute("src",imageUrl);
    	imgNode.setAttribute("style","width:100px;");
    	
    	return range.commonAncestorContainer.parentNode.appendChild(imgNode);
	}
	
	
	
});
//@ sourceURL=editor/Editor.js