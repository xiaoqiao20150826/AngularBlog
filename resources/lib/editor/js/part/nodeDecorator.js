/**
 * 
 */

$$namespace.include(function (require, module) {
	/*
	 * private static field
	 */
	var treeSearcher = require('/part/treeSearcher')
	  , styleAppender = require('/part/styleAppender')
	  , rangeDecorator = require('/part/rangeDecorator')
	
	var nodeDecorator = module.exports = {
		//TODO: 이건..나중에 걸리적거리면 수정하자.
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
		decorateLineByRange : function(range, style) {
			var lineNodes = this._lineNodesInRange(range);
			
			styleAppender.appendStyleToElements(lineNodes, style);
			return lineNodes;			
		},
		_lineNodesInRange : function (range) {
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
		decorateNodesByRange :  function(range, style) {
			return rangeDecorator.decorate(range, style)
		}
	};
	
});

//@ sourceURL=editor/event/part/nodeDecorator.js