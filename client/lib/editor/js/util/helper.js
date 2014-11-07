/**
 * 
 */

$$namespace.include(function (require, module){
	
	var helper = module.exports = {}
	
	helper.isNotSpan = function _isNotSpan($node) { return !helper.isSpan($node)	}
	helper.isSpan = function _isSpan($node) { return helper.isType($node, 'span')	}
	helper.isLine = function _isLine($node) { return helper.isType($node, 'p') }
	helper.isType = function _isType($node, type) {
		return $node.is(type)
	}
	helper.notExist = function (o) {return !this.exist(o)}
	helper.exist = function (o) {
		if(o != null || o != undefined) return true;
		else return false;
	}
	helper.isEmpty = function (o) {
		if(this.notExist(o)) return true;
		if(o.hasOwnProperty('length') && o.length == 0) return true;
		
		else return false;
	}
	helper.isTextNode = function (node) {
		if(node.nodeType == 3) return true;
		else return false;
	}
	//스페이스 가 들어갈수도.
	helper.isEmptyText = function _isEmptyText(text) {
		if(text.length == 0) return true;
		else return false;
	}
	helper.isOneTextNode = function _isOneTextNode($textNodes) {
		if($textNodes.length == 0) throw 'error : textNodes length never be 0';
		if($textNodes.length == 1) return true
		else return false;
	}
	//아래랑겹치네.
	helper.isArray = function (o) {
		if(o instanceof Array || o instanceof jQuery || o instanceof HTMLCollection) return true
		else return false
	}
	helper.createSpanNode = function _createSpanNode(text) {
		var $span = $('<span></span>')
		$span.text(text);
		return $span[0]
	}
	helper.make$spanByText = function (text, styleMap) {
		var $span = $('<span></span>')
		$span.text(text)
		if(styleMap) $span.css(styleMap)
		return $span[0]
	}
})