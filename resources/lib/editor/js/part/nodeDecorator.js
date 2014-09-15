/**
 * 
 */

$$namespace.include(function (require, module) {
	/*
	 * private static field
	 */
	var treeSearcher = require('/part/treeSearcher')
	  , styleAppender = require('/part/styleAppender')
	
	var nodeDecorator = module.exports = {
		//field
		_startOffset : null,
		_endOffset : null,
			
		//method
		decorateAllNodeInLines : function (lines, style) {
			for(var i in lines) {
				var line = lines[i];
				var span = line.firstChild;
				if(!(__childOfLineIsOnlyOneAndSpan(span))) {
					span = __warpNodesOfLineToSpanNode(line);
				}
				styleAppender.appendStyleToElement(span,style);
			};
			function __childOfLineIsOnlyOneAndSpan(child) {
				if(child && child.nextSibling ==null && child.tagName == "SPAN") 
					return true;
				else
					return false;
			};
			function __warpNodesOfLineToSpanNode(line) {
				var newLine = line.cloneNode();
				span = document.createElement("span");
				var childNodes = line.childNodes;
				for(var i =0,max = childNodes.length; i<max; ++i) {
					span.appendChild(childNodes[0]);
				}
				newLine.appendChild(span);
				line.parentNode.replaceChild(newLine,line);
				return span;
			};
			
		},
		decorateNodesBy :  function(range, style) {
			var textNodes = this._nodesInRange(range);
			var decoratedNode = this._decorateSpan(textNodes,style);
			return decoratedNode; //TODO:textNodes�� ��ȯ��. �̸��� �ȸ¾�..
		},
		decorateLineBy : function(range, style) {
			var lineNodes = this._linesInRange(range);
			
			for(var i in lineNodes) {
				styleAppender.appendStyleToElement(lineNodes[i],style);
			}
			return lineNodes; //TODO:textNodes�� ��ȯ��. �̸��� �ȸ¾�..			
		},
		_linesInRange : function (range) {
		    var	startNode = __startMustBeP(range.startContainer),
	    		endNode = range.endContainer;
		    
		    return treeSearcher.searchTree(startNode, endNode, filteringLine);
		    
			function filteringLine(node) {
				if(node.nodeName=="P") return true;
				else return false;
			};
			function __startMustBeP(start) {
				while(start.nodeName !="P") {
					start = start.parentNode;
				};
				return start;
			};
		},
		_nodesInRange : function (range) {
		    var	startNode = range.startContainer,
		    	endNode = range.endContainer;
			this._startOffset = range.startOffset;
	    	this._endOffset = range.endOffset;
	    	
			return treeSearcher.searchTree(startNode, endNode);
		},
		_decorateSpan : function (textNodes,style) {
			var startOffset = this._startOffset,
				endOffset = this._endOffset,
				size = textNodes.length, 
				startIndex = 0, endIndex = size-1,
				decoretedNodes = [];
			
			for(var i =startIndex; i < size; ++i) {
				var textNode = textNodes[i],
					startLoc = 0, endLoc = textNode.length,
					wrappedTextNode,
					start, end;
					
				if(size<1) {throw "textNodes must have �ּ� one node";};
				if(size==1) {
					start = startOffset; end = endOffset;
				}
				if(size > 1) {
					if(i==startIndex) {  //ó���� �� ��常.
						start = startOffset; end = endLoc;
					} else if(i==endIndex) {
						start = startLoc; end = endOffset;
					} else {
						start = startLoc, end = endLoc;
					}
				}
				wrappedTextNode = this._wrapTextNodeToSpanNode(textNode,start,end);
				var spanNode = wrappedTextNode.parentNode;
				styleAppender.appendStyleToElement(spanNode,style);				//TODO: ���� : ���÷ο� ���������� �Ͼ..
				
				decoretedNodes.push(wrappedTextNode);
//				decoretedNodes.push(spanNode);
			}
			return decoretedNodes;
		},
		
		_wrapTextNodeToSpanNode : function (oldNode, startOffset, endOffset) {
			var parent = oldNode.parentNode,
				text = oldNode.nodeValue,
				startLoc = 0, endLoc = text.length,
				middleSpan=null, leftTextNode=null, rightTextNode=null;
			
			if( __isSame(startOffset,startLoc) && __isSame(endOffset,endLoc) 
					&& __isSame(oldNode.nextSibling,null) &&__isSame(parent.nodeName,"SPAN")) {
				return oldNode;
			}
			
			if(__isSame(startOffset,endOffset)) { //offset�� ����.
				var offset = startOffset;
				if(__isSame(startLoc,endLoc)) { // loc�� ����. �ƿ� ����ִ� ����ΰ�?
					throw "���� �����Ҽ��� ����.  ";
				} else { //loc�� �ٸ���. ��, �߰��� ���� �������� ���׷�.
					middleSpan = this._createSpanNodeByText("");
					middleSpan.innerHTML = "&#8203";////TODO: ĳ���� �����ȵ�..�� �� �� �� �� �� ��!;
					leftTextNode = document.createTextNode(text.slice(0,offset)),
					rightTextNode =document.createTextNode(text.slice(offset));
					__replaceNode(oldNode,leftTextNode,middleSpan,rightTextNode);
				}
				
			} else { //offset�� �ٸ���.
				if(__isSame(startOffset,startLoc)) { //������ new  l l l
					middleSpan = this._createSpanNodeByText(text.slice(0,endOffset)),
					rightTextNode = document.createTextNode(text.slice(endOffset));
					__replaceNode(oldNode,null,middleSpan,rightTextNode);
				}else if(__isSame(endOffset, endLoc)) { //������
					middleSpan = this._createSpanNodeByText(text.slice(startOffset)),
					leftTextNode = document.createTextNode(text.slice(0,startOffset));
					__replaceNode(oldNode,leftTextNode,middleSpan,null);
				} else {
				//�߰����־�.
					middleSpan = this._createSpanNodeByText(text.slice(startOffset, endOffset));
					leftTextNode = document.createTextNode(text.slice(0,startOffset)),
					rightTextNode = document.createTextNode(text.slice(endOffset));
					__replaceNode(oldNode,leftTextNode,middleSpan,rightTextNode);
				}
			}
			
			return middleSpan.firstChild;
			//////////////helper
			function __isSame(start, end) {
				if(start==end) return true; 
				else return false;
			};
			function __replaceNode(oldNode, leftTextNode,middleSpan,rightTextNode) {
				var parent = oldNode.parentNode,
					frag = document.createDocumentFragment();
				
				if(rightTextNode) rightTextNode = rightTextNode.nodeValue != "" ? rightTextNode : null; //���ؽ�Ʈ�� ������.
				if(leftTextNode) leftTextNode = leftTextNode.nodeValue != "" ? leftTextNode : null; 

				
				if(rightTextNode) frag.insertBefore(rightTextNode);
				if(middleSpan) frag.insertBefore(middleSpan, rightTextNode);
				if(leftTextNode) frag.insertBefore(leftTextNode ,middleSpan);
				
				
				parent.replaceChild(frag,oldNode); //�ؽ�Ʈ�� span�� ���α⿡ �������� ���÷ο� ����
			}/////////////////end
			
			
		},
		_createSpanNodeByText : function (text) {
			var	span = document.createElement('span'),
				textEl = document.createTextNode(text);
			span.appendChild(textEl);
			return span;
		}
		
	};
	
});