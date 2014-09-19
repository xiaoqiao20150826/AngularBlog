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
		if(lastIndex < firstIndex) lastIndex = firstIndex //�̷����¾�����..
		
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
	     //��Ÿ���߰�.
	    return spanNodes;
		//startAndEndTextNode ��ȯ �ٸ������� 
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
	//textNode���� spanȭ�ؼ� �θ𿡰Լ� �����ص��ǳİ� ����°�.
	// �θ� span�̰�, ���� �۾��� ���� ������ �������.
	function _canIndefendentFromParent(textNodes, i, length, offset) {
		var $currentTextNode = $(textNodes[i])
		  , $currentParent = $currentTextNode.parent()

		if(H.isLine($currentParent)) return false; //�θ� �����̸� �����Ǿȵ�.  
		  
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
		//�ؽ�Ʈ�� 2���̻��ϰ��.
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
		if(length == 3) return spanNodes[1] //���
		if(length == 2) {
			if(startOffset > 0) return spanNodes[1] //������
			else return spanNodes[0] //����
		}
	}
	//��,�߰�,���� ���� �ʿ���� ���� ����. �׷��� ������ ����..
	rangeDecorator.filteredTextNodes = function ($textNode, startOffset, endOffset, isCaret) {
		var text = $textNode.text()
		  , textLength = text.length
		  , leftText = text.slice(0,startOffset)
		  , middleText = text.slice(startOffset, endOffset)
		  , rightText = text.slice(endOffset, text.length)
		  
		  if(startOffset == 0) leftText = null;  //������ �ʿ����.
		  if(endOffset == textLength) rightText = null; //������ �ʿ����
		  if(startOffset == endOffset) { //ĳ�������̸鼭. 
			  if(startOffset == 0 || startOffset == textLength) { //�糡�϶������ ����.
				  if(!isCaret) { //�Դٰ� ĳ���� �ƴҶ��� ����. �Ѥ�
					  middleText = null;  
				  }
			  }
		  }
		  var texts = [leftText, middleText, rightText]
		  texts = __zip(texts);
		  
		  if(texts.length == 0) return [""] //�Ѱ��������� ��Ŷ� ����.
		  else return texts
		  
		  // null�ΰ� ������
		  function __zip(texts) {
			  var newTexts = []
			  for(var i in texts) {
				  var text = texts[i] 
				  if(text != null) newTexts.push(text)
			  }
			  return newTexts;
		  }
	}
	//������� ������ �����..
	rangeDecorator.textsToSpanNodes = function(texts) {
		var spanNodes = []
		for(var i in texts) {
			var text = texts[i]
			  , newSpanNode = H.createSpanNode(text)
			if(text == "") newSpanNode.innerHTML = "&#8203;" //[�߿�]ĳ���� ���� �� �ʿ��ϴ�.
			spanNodes.push(newSpanNode)
		}
		return spanNodes
	}
	// //wrapTextNodeToSpanNode -end
	
	// ��� �ٲٴ� ���Ҹ��ϸ����..���� ��ȯ�� �ʿ�� ����.
	rangeDecorator.replaceNode = function ($newNodes, $oldNode, canIndefendentFromParent) {
		if($oldNode.length > 1) throw 'oldNode to replace is only one'
		
		var $parentNode = $oldNode.parent()
		_replaceChildNodesToNewNodes($parentNode, $newNodes, $oldNode, canIndefendentFromParent)
		
		return $parentNode //�׽�Ʈ��
	}
	function _replaceChildNodesToNewNodes ($parentNode, $newNodes, $oldNode, canIndefendentFromParent) {
		var $oldChildNodes = $($parentNode[0].childNodes) //�̷��� �ؾ� �ؽ�Ʈ����������..
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
				//text��� spanȭ��Ű�� �ʴ´�.
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