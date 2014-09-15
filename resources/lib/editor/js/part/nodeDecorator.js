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
			return decoratedNode; //TODO:textNodes가 반환됨. 이름이 안맞아..
		},
		decorateLineBy : function(range, style) {
			var lineNodes = this._linesInRange(range);
			
			for(var i in lineNodes) {
				styleAppender.appendStyleToElement(lineNodes[i],style);
			}
			return lineNodes; //TODO:textNodes가 반환됨. 이름이 안맞아..			
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
					
				if(size<1) {throw "textNodes must have 최소 one node";};
				if(size==1) {
					start = startOffset; end = endOffset;
				}
				if(size > 1) {
					if(i==startIndex) {  //처음과 끝 노드만.
						start = startOffset; end = endLoc;
					} else if(i==endIndex) {
						start = startLoc; end = endOffset;
					} else {
						start = startLoc, end = endLoc;
					}
				}
				wrappedTextNode = this._wrapTextNodeToSpanNode(textNode,start,end);
				var spanNode = wrappedTextNode.parentNode;
				styleAppender.appendStyleToElement(spanNode,style);				//TODO: 성능 : 리플로우 리페인팅이 일어남..
				
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
			
			if(__isSame(startOffset,endOffset)) { //offset이 같음.
				var offset = startOffset;
				if(__isSame(startLoc,endLoc)) { // loc도 같음. 아에 비어있는 경우인가?
					throw "여기 도달할수가 없음.  ";
				} else { //loc가 다르다. 즉, 중간은 빈스팬 나머지는 뭐그럼.
					middleSpan = this._createSpanNodeByText("");
					middleSpan.innerHTML = "&#8203";////TODO: 캐럿이 말을안들어서..이 상 한 거 넣 었 다!;
					leftTextNode = document.createTextNode(text.slice(0,offset)),
					rightTextNode =document.createTextNode(text.slice(offset));
					__replaceNode(oldNode,leftTextNode,middleSpan,rightTextNode);
				}
				
			} else { //offset이 다르다.
				if(__isSame(startOffset,startLoc)) { //왼쪽이 new  l l l
					middleSpan = this._createSpanNodeByText(text.slice(0,endOffset)),
					rightTextNode = document.createTextNode(text.slice(endOffset));
					__replaceNode(oldNode,null,middleSpan,rightTextNode);
				}else if(__isSame(endOffset, endLoc)) { //오른쪽
					middleSpan = this._createSpanNodeByText(text.slice(startOffset)),
					leftTextNode = document.createTextNode(text.slice(0,startOffset));
					__replaceNode(oldNode,leftTextNode,middleSpan,null);
				} else {
				//중간에있어.
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
				
				if(rightTextNode) rightTextNode = rightTextNode.nodeValue != "" ? rightTextNode : null; //빈텍스트면 넣지마.
				if(leftTextNode) leftTextNode = leftTextNode.nodeValue != "" ? leftTextNode : null; 

				
				if(rightTextNode) frag.insertBefore(rightTextNode);
				if(middleSpan) frag.insertBefore(middleSpan, rightTextNode);
				if(leftTextNode) frag.insertBefore(leftTextNode ,middleSpan);
				
				
				parent.replaceChild(frag,oldNode); //텍스트에 span만 감싸기에 리페인팅 리플로우 안일
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