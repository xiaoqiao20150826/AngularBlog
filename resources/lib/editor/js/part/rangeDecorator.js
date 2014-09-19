/**
 * 
 */

$$namespace.include(function(require, module) {
	var H = require('/js/util/helper.js')
	var treeSearcher = require('/js/util/treeSearcher.js')
	  , styleAppender = require('/js/util/styleAppender.js')
	
	var rangeDecorator = module.exports = {}
	
	rangeDecorator.decorate = function (range, style) {
		var spanNodes = this.decorateSpanByRange(range)
		styleAppender.appendStyleToElements(spanNodes, style)
		
		return _startAndEndTextNode(spanNodes);
	}	
	function _startAndEndTextNode(spanNodes) {
		var result = []
		var length = spanNodes.length
		  , lastIndex = length - 1
		  , firstIndex = 0
		if(lastIndex < firstIndex) lastIndex = firstIndex //이럴리는없지만..
		
		result[0] = spanNodes[firstIndex].childNodes[0]
		result[1] = spanNodes[lastIndex].childNodes[0]
		return result;
	}
	rangeDecorator.decorateSpanByRange = function (range) {
	    var	startNode = range.startContainer
    	  , endNode = range.endContainer
		var startOffset = range.startOffset
	      , endOffset = range.endOffset
	    var textNodes = treeSearcher.searchTree(startNode, endNode);
	    textNodes = _shouldBeMinOne(textNodes, startNode)
	    
	    var spanNodes = this.wrapTextNodesToSpanNode(textNodes, startOffset, endOffset)
	     //스타일추가.
	    return spanNodes;
		//startAndEndTextNode 반환 다른곳에서 
	}
	function _shouldBeMinOne (textNodes, startNode) {
    	if(textNodes.length == 0) { 
    		var $node = $(startNode)
    		var newTextNode = document.createTextNode("");
    		$node.children().remove()
    		$node.append(newTextNode)
    		return [newTextNode];
    	}
		return textNodes
	}
	rangeDecorator.wrapTextNodesToSpanNode = function (textNodes, startOffset, endOffset) {
		var length = textNodes.length;
		  
		var spanNodes = []
		for(var i =0, max = length; i<max; ++i) {
			var textNode = textNodes[i]
		      , offset = _getOffset(textNode, i, length, startOffset, endOffset)
		      , canIndefendentFromParent = _canIndefendentFromParent(textNodes, i, length, offset)
		      , isCaret = _isCaret(offset, length)
			var selectedSpanNode = this.wrapTextNodeToSpanNode($(textNode), offset.start, offset.end, canIndefendentFromParent, isCaret)
			spanNodes.push(selectedSpanNode)
		}
		return spanNodes;
	} 
	//textNode까지 span화해서 부모에게서 독립해도되냐고 물어보는거.
	// 부모가 span이고, 다음 작업을 위한 형제가 없어야함.
	function _canIndefendentFromParent(textNodes, i, length, offset) {
		var $currentTextNode = $(textNodes[i])
		  , $currentParent = $currentTextNode.parent()

		if(H.isLine($currentParent)) return false; //부모가 라인이면 무조건안됨.  
		  
		var startIndex = i+1;
		if(startIndex >= length) return true;
		
		for(var j =startIndex, max = length; j<max; ++j) {
			var $nextTextNode = $(textNodes[j])
			  , $nextParent = $nextTextNode.parent() 
			if( !H.isSpan($currentParent) || ($currentParent.is($nextParent)) ) return false; 
		}
		
		return true;
	}
	function _isCaret(offset, length) {
		if(length == 1 && (offset.start == offset.end)) return true
		else return false;
	}
	function _getOffset(textNode, index, nodeCount, start, end) {
		if(nodeCount == 0) throw new Error(spanNodes + 'somting wrong....').stack;
		//텍스트가 2개이상일경우.
		var lastIndex = nodeCount - 1
		  , length = textNode.length
		var offset = {start:0, end:length}
		
		if(index == 0) offset.start = start
		if(index == lastIndex) offset.end = end
		
		return offset
	}
	
	//	//wrapTextNodeToSpanNode start
	rangeDecorator.wrapTextNodeToSpanNode = function($textNode, startOffset, endOffset, canIndefendentFromParent, isCaret) {
		var $parent = $textNode.parent()
		var texts = this.filteredTextNodes($textNode, startOffset, endOffset, isCaret)
		  , spanNodes = this.textsToSpanNodes(texts);
		
		this.replaceNode($(spanNodes), $textNode, canIndefendentFromParent)
		
		var selectedSpanNode = _selectedSpan(spanNodes, startOffset)
//		console.log('eee',selectedSpanNode)
		return selectedSpanNode;
	}
	function _selectedSpan(spanNodes, startOffset) {
		var length = spanNodes.length
		if(length == 0 || length > 3) throw new Error(spanNodes + 'somting wrong....').stack;
		if(length == 1) return spanNodes[0]
		if(length == 3) return spanNodes[1] //가운데
		if(length == 2) {
			if(startOffset > 0) return spanNodes[1] //오른쪽
			else return spanNodes[0] //왼쪽
		}
	}
	//왼,중간,오른 에서 필요없는 것은 버려. 그러나 순서는 유지..
	rangeDecorator.filteredTextNodes = function ($textNode, startOffset, endOffset, isCaret) {
		var text = $textNode.text()
		  , textLength = text.length
		  , leftText = text.slice(0,startOffset)
		  , middleText = text.slice(startOffset, endOffset)
		  , rightText = text.slice(endOffset, text.length)
		  
		  if(startOffset == 0) leftText = null;  //왼쪽이 필요없어.
		  if(endOffset == textLength) rightText = null; //오른쪽 필요없음
		  if(startOffset == endOffset) { //캐럿형태이면서. 
			  if(startOffset == 0 || startOffset == textLength) { //양끝일때만가운데 버림.
				  if(!isCaret) { //게다가 캐럿이 아닐때만 버려. ㅡㅡ
					  middleText = null;  
				  }
			  }
		  }
		  var texts = [leftText, middleText, rightText]
		  texts = __zip(texts);
		  
		  if(texts.length == 0) return [""] //한개도없으면 빈거라도 넣자.
		  else return texts
		  
		  // null인거 정리점
		  function __zip(texts) {
			  var newTexts = []
			  for(var i in texts) {
				  var text = texts[i] 
				  if(text != null) newTexts.push(text)
			  }
			  return newTexts;
		  }
	}
	//순서대로 무조건 만들어..
	rangeDecorator.textsToSpanNodes = function(texts) {
		var spanNodes = []
		for(var i in texts) {
			var text = texts[i]
			  , newSpanNode = H.createSpanNode(text)
			if(text == "") newSpanNode.innerHTML = "&#8203;" //[중요]캐럿을 위해 꼭 필요하다.
			spanNodes.push(newSpanNode)
		}
		return spanNodes
	}
	// //wrapTextNodeToSpanNode -end
	
	// 얘는 바꾸는 역할만하면되지..뭔가 반환할 필요는 없지.
	rangeDecorator.replaceNode = function ($newNodes, $oldNode, canIndefendentFromParent) {
		if($oldNode.length > 1) throw 'oldNode to replace is only one'
		
		var $parentNode = $oldNode.parent()
		_replaceChildNodesToNewNodes($parentNode, $newNodes, $oldNode, canIndefendentFromParent)
		
		return $parentNode //테스트용
	}
	function _replaceChildNodesToNewNodes ($parentNode, $newNodes, $oldNode, canIndefendentFromParent) {
		var $oldChildNodes = $($parentNode[0].childNodes) //이렇게 해야 텍스트까지가져옴..
		var oldNodeIndex = $oldChildNodes.index($oldNode)
		  , oldChildLength = $oldChildNodes.length
		if(oldChildLength == 0 ) throw "should not be called";
		var styleMap = styleAppender.getInheritedSytleMap($parentNode)
		
		var newChildNodes = [] 
		for(var i=0, max=oldChildLength; i<max; ++i) {
			var oldChildNode = $oldChildNodes.get(i)
			var tempNodes;
			if(oldNodeIndex == i) {
				if(!H.isLine($parentNode) ) { tempNodes = _wrapSpanAndInheritStyle($newNodes, styleMap, true) }
				else tempNodes = $newNodes.toArray()
			} else {
				//text라면 span화시키지 않는다.
				if(!H.isLine($parentNode) ) { tempNodes = _wrapSpanAndInheritStyle($(oldChildNode), styleMap ,canIndefendentFromParent) }
				else tempNodes = [oldChildNode]
			}
			
			newChildNodes = newChildNodes.concat(tempNodes)
			$oldChildNodes.remove(i)
		}
//		console.log('canIndefendentFromParent', canIndefendentFromParent)
		if(canIndefendentFromParent) {
			var $tempSpan = $parentNode 
			$parentNode = $parentNode.parent()
			$tempSpan.replaceWith(newChildNodes)
		} else {
			$parentNode.append(newChildNodes)	
		}
		return  $parentNode;
	}
	function _wrapSpanAndInheritStyle($nodes, styleMap, isWrapSpan) {
		var length = $nodes.length
		
		var nodes = []
		for(var i = 0, max = length; i < max; ++i ) {
			var node = $nodes[i]
			var $node = $(node)
			if(isWrapSpan && H.isTextNode(node)) { $node = H.make$spanByText(node.textContent, styleMap) }
			if(!H.isTextNode(node)) {$node.css(styleMap)}
			nodes.push(node);
		}
		return nodes
	}
})
//@ sourceURL=editor/event/part/rangeDecorator.js 