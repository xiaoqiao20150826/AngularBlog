/**
 * 캐럿과 범위 둘을 컨트롤.
 * TODO: 여기서 싱글캐럿(실제의), 캐럿된(히스토리를 위해 임시로 표시한). 두단어가 혼용됨.
 */

$$namespace.include(function (require, module) {

	/*
	 * static field, dependency
	 */
	var	S_CARET_ID = "S_CARET_ID"
	  , E_CARET_ID = "E_CARET_ID"
	
	/*
	 * constructor , instance field
	 */
	var RangeManager = module.exports = function RangeManager(editor) {
		this._editor = editor;
		this._contentDoc = editor.getContentDoc();
		this._cachedCarets = null;
	};

	
	//------------------update---------------------------------
	RangeManager.prototype.updateRange = function (range) {
		if(range instanceof Array) {
			range = this._getRangeByTextNodes(range);
		}
		if(range.isCaretedRange) { //햇갈리는이름. 이거 히스토리를 위해 임시로 넣은 캐럿 .말하는것이다. 
			range = this._getRangeByCaretedRange(range);
			this.deleteCarets();
		}
		var	selection = this.getCurrentSelection(),
			newRange = document.createRange();
		if(range.isSingleCaret) {
			newRange.selectNodeContents(range.sNode);//단일노드, 범위선택 
			newRange.collapse(false); //위에서 범위를 캐럿으로(마지막 위치)
		} else {
			newRange.setStart(range.sNode, range.sOffset);
			newRange.setEnd(range.eNode, range.eOffset);			
		}

		selection.removeAllRanges();
		selection.addRange(newRange);
	};
	//------------------------------------------------------
	
	//------------------getxxx method--------------
	RangeManager.prototype.getTemperalyCaretedContent = function () {//임시적으로 캐럿된 컨텐츠
		this.insertCarets(); //before
		var htmlData = this._editor.getContentBody().innerHTML;
		var rangeData = this.getCaretedRange();
		this.deleteCarets(); //after
		return {innerHTML:htmlData, range: rangeData };
	};
	RangeManager.prototype.getCaretedRange = function () {
		if(this._cachedCarets == null) {
			this.insertCarets();
		}
		var range = this.getCurrentRange();
		return this._createRange(null, null,range.startOffset, range.endOffset);
	};
	RangeManager.prototype.getDefaultRange= function(defaultNode) {
		var node = defaultNode || this._editor.getContentBody();
		return this._createRange(node);
	};
	RangeManager.prototype.getCurrentSelection= function() {
		return this._contentDoc.getSelection();
	};
	RangeManager.prototype.getCurrentRange = function() {
		var	selection = this.getCurrentSelection();
			rangeCount = selection.rangeCount;
			if(rangeCount) {
				return selection.getRangeAt(0);
			};
	};
	// ------------------------caret insert, delete
	RangeManager.prototype.deleteCarets = function () {
		var carets = this._getCachedCaretsOrCurrentCarets(),
			sCaret = carets.sCaret,
			eCaret = carets.eCaret;
		console.log("de"+sCaret +","+ eCaret);
		if(sCaret) sCaret.parentNode.removeChild(sCaret);
		if(eCaret) eCaret.parentNode.removeChild(eCaret);
		this._cachedCarets = null;
	};
	RangeManager.prototype.insertCarets = function () {
		var range = this.getCurrentRange();
		var sNode = range.startContainer,
			eNode = range.endContainer;
		var sCaret = __insertCaret(sNode, S_CARET_ID),
			eCaret = null;
		if(sNode!=eNode) {
			eCaret = __insertCaret(eNode, E_CARET_ID);
		}
		this._cachedCarets = {sCaret:sCaret, eCaret:eCaret};
		console.log("in"+sCaret +","+ eCaret);
		
		function __insertCaret(refNode, id) {
			var result = document.createElement("span");
			result.setAttribute("id",id);
			refNode.parentNode.insertBefore(result,refNode); //result의  next가 타겟임.
			return result;
		};
		
	};		
	/*
	 *=================helper
	 */
	//-----------------create
	RangeManager.prototype._createRange= function(sNode,eNode,sOffset,eOffset) {
		var caretChar = this._editor.getCaretChar()
		var result = {sNode: sNode, eNode: eNode || sNode,
					  sOffset: sOffset || 0, eOffset:eOffset || sOffset, 
					  isCaretedRange:false,
					  isSingleCaret:false};
		result.isCaretedRange = __isCaretedRange(result);
		result.isSingleCaret = __isSingleCaret(result, caretChar);
		return result;
		function __isCaretedRange(r) {//이거 임의로 표시한 캐럿말하는거 ㅡㅡ
			if(r.sNode == null && r.eNode == null) 
				return true;
			else
				return false;
		};
		function __isSingleCaret(r, caretChar) { // 텍스트노드 그냥 비교해도 같다 표시되나보군.
			if(r.sNode == null && r.eNode == null) return false;
				
			var isOneChar = ((r.eOffset - r.sOffset) == 1)
			if(r.sNode == r.eNode && isOneChar) {
				var char = r.sNode.textContent.charAt(0)
				if(char == caretChar)
				return true;
			}
			else
				return false;
		};
	};
	//--------------------get
	RangeManager.prototype._getRangeByTextNodes = function(nodes) {  
		if((nodes.length == 0)) {
			return this.getDefaultRange();
		}
		var sTextNode = nodes[0],
			eTextNode = nodes[nodes.length-1],
			sOffset =0, eOffset = eTextNode.textContent.length;
		
		return this._createRange(sTextNode, eTextNode, sOffset, eOffset);
	};

	RangeManager.prototype._getRangeByCaretedRange = function(offset) {
		var carets = this._getCachedCaretsOrCurrentCarets(),
			sCaret = carets.sCaret,
			eCaret = carets.eCaret;
		var sNode = sCaret.nextSibling,
			eNode = sNode;
		if(eCaret) {
			eNode = eCaret.nextSibling;
		}
		return this._createRange(sNode, eNode, offset.sOffset, offset.eOffset);
	};

	RangeManager.prototype._getCachedCaretsOrCurrentCarets = function () {
		var carets = this._cachedCarets;
		if(!(carets)) {
			carets = {sCaret:null, eCaret:null};
			carets.sCaret = this._editor.getContentElementById(S_CARET_ID);
			carets.eCaret = this._editor.getContentElementById(E_CARET_ID);			
		};			
		return carets;
	};

});

//@ sourceURL=editor/event/content/RangeManager.js