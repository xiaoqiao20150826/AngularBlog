
/**
 * class Editor
 * �������� ���������� ���⼭����.
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
	
	var Editor = module.exports = function Editor(id, frameId) {
		this._id = id || DEFAULT_ID;
		this._frameId = frameId || DEFAULT_FRAME_ID;
		
		this._contentFrame = document.getElementById(this._frameId);
		if(!(this._contentFrame)) throw id+" must be id of frame";
		
		this._contentDoc = this._contentFrame.contentDocument;
		this._contentBody = this._contentDoc.body;
		
		this._decorator = nodeDecorator;
		
		this._history = new History(this);
		this._rangeManager = new RangeManager(this);
		this._btnManager = new ButtonManager(this); //TODO: �ϰ���. ������ ������ new������ �׳��̶��.
		
		this._init();
	};
	/*
	 * public method getXX
	 */
	Editor.prototype.getContentFrame = function() {return this._contentFrame;	};
	Editor.prototype.getContentDoc = function() {return this._contentDoc;	};
	Editor.prototype.getContentBody = function() {return this._contentBody;	};
	
	Editor.prototype.getHistory = function() {return this._history;	};
	Editor.prototype.getDecorator = function() {return this._decorator;	};
	Editor.prototype.getRangeManager = function() {return this._rangeManager;	};
	
	Editor.prototype.getCaretedContent = function() {
		return this._rangeManager.getTemperalyCaretedContent(); //�ܾ� Ȯ�� �ؾ���..
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
		//1. ���ڷ���Ʈ,
		var range = rangeManager.getCaretedRange();
		this._decorator.decorateAllNodeInLines(lines,style);
		rangeManager.updateRange(range); 
	};
	Editor.prototype.updateSelectedLine = function(style) {
		var	rangeManager = this._rangeManager;
		//1. ���ڷ���Ʈ, 
		var range = rangeManager.getCurrentRange();
		var lines = this._decorator.decorateLineBy(range,style);
		
		return lines;
	};
	Editor.prototype.updateSelectedNodes = function(style) {
		var	rangeManager = this._rangeManager;
		//1. ���ڷ���Ʈ, 
		var range = rangeManager.getCurrentRange();
		var textNodes = this._decorator.decorateNodesBy(range,style);
		
//		2. ���� ������Ʈ
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
	//--------------------------------------------------
	
	//------------------------helper	
	Editor.prototype._init = function _init() {
		this._btnManager.assignEvent()
		
		var node = this._contentDoc.getElementsByTagName('p')[0];
		var range =this._rangeManager.getDefaultRange(node);
		this._rangeManager.updateRange(range);
		this.focus();
	};
	
	//------------------ �ܺο��� ���Ǵ� ������Լ� ------------------	
	Editor.prototype.contentToTextArea = function (textAreaNode) {
		var bodyNode = this.getContentBody();
		var text = bodyNode.innerHTML;
		textAreaNode.value = text;
	};

});
