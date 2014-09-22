/**
 * 
 */

$$namespace.include(function (require, module) {

	/*
	 * static field, dependency
	 */
	var	MAX_LENGTH = 12;
	
	
	/*
	 * constructor , instance field
	 */
	var History = module.exports = function History(editor) {
		this._editor = editor;
		
		this._undoList = [];
		this._redoList = [];
	};
	//----------------save
	History.prototype.save = function save() {
		var caretedContent = this._editor.getCaretedContent();
		var histories = this._undoList,
			size = histories.length;
		if(size == MAX_LENGTH) {
			histories.shift(); // reverse pop()
		}
		console.log("undo");
		this._undoList.push(caretedContent);
	};
	History.prototype.saveRedo = function () {
		var caretedContent = this._editor.getCaretedContent();
		var histories = this._redoList,
			size = histories.length;
		if(size == MAX_LENGTH) {
			histories.shift(); // reverse pop()
		}
		console.log("redo");
		this._redoList.push(caretedContent);
	};
	//--------------------do
	History.prototype.undo= function undo() {
		if(this._undoList.length == 0) {return;};
		
		var currentContent = this._editor.getCaretedContent();
		this.saveRedo(currentContent);
		var data = this._undoList.pop();
		this._editor.replaceContent(data);
	};
	History.prototype.redo= function redo() {
		if(this._redoList.length == 0) {return;};
		
		var currentContent = this._editor.getCaretedContent();
		this.save(currentContent);
		var data = this._redoList.pop();
		this._editor.replaceContent(data);
	};
	//---------------------isEmpty
	History.prototype.undoIsEmpty= function () {
		if(this._undoList.length==0) 
			return true;
		else
			return false;
	};
	History.prototype.redoIsEmpty= function () {
		if(this._redoList.length==0) 
			return true;
		else
			return false;		
	};

	
	
});