/**
 * 
 */

$$namespace.include(function (require, module) {

	/*
	 * static field, dependency
	 */
	/*
	 * constructor , instance field
	 */
	var styleAppender = require('part/styleAppender')
	
	var imageWrapper = module.exports ={
		_prevX : null,
		_nodesBeUpdated :null,
		_partNode : null,

		/////////////////////wrap
		wrapImgNodeToSpanNode : function(oldImgNode) {
			if (!(__hasWrappedImgNode(oldImgNode))) { //warppedImg가 존재할 경우만 작업.
				var newImgNode = oldImgNode.cloneNode(), 
				span = __createSpanAndsetAttr("wrapped-img", "layOut"), 
				spanPart1 = __createSpanAndsetAttr("wrapped-img-part", "part1"),
				spanPart2 = __createSpanAndsetAttr("wrapped-img-part", "part2"),
				spanPart3 = __createSpanAndsetAttr("wrapped-img-part", "part3"),
				spanPart4 = __createSpanAndsetAttr("wrapped-img-part", "part4");
				var temp = [ spanPart1, spanPart2, spanPart3, spanPart4, newImgNode ];
				for ( var i in temp) {
					span.appendChild(temp[i]);
				}
				span.setAttribute("contenteditable", "false");
				oldImgNode.parentNode.replaceChild(span, oldImgNode);
				this.saveNodesMustBeUpdatedByPart(spanPart1); //TODO: 파트클릭이 아닐경우 제거하기 위해 일단 데이터 삽입. 
				
				var newStyle = newImgNode.style.cssText;
				this._updateStyle(span, newStyle);
			};
			function __createSpanAndsetAttr(className, idName) {
				var node = document.createElement('span');
				node.setAttribute("class", className);
				node.setAttribute("id", idName);
				return node;
			};
			
			function __hasWrappedImgNode(imgNode) {
				var parent = imgNode.parentNode;
				if (parent.className.indexOf("wrapped-img") != -1)
					return true;
				else
					return false;
			};
			
		},
		//////////////save
		saveNodesMustBeUpdatedByPart : function (part){
			this._nodesBeUpdated = [part.parentNode, part.parentNode.lastChild];
			this._partNode = part;
		},
		//////////////update
		updateSavedNodesWith : function (movedWidth) {
			var nodes = this._nodesBeUpdated || [],
				style = __mustReverseValueAboutPart1Or4(this._partNode,movedWidth);
			
			this._updateStyle(nodes, style);
			function __mustReverseValueAboutPart1Or4(partNode, movedWidth) {
				var id = partNode.id;
				if(id.indexOf('part1') != -1 || id.indexOf('part4') !=-1) {
						movedWidth = movedWidth * -1;
						console.log("reverse:"+movedWidth);
				} else {console.log("sun:"+movedWidth);};
				
				var style = "width:" + movedWidth;
				console.log("result : " +style);
				return style;
			};
		},
		_updateStyle : function(nodes,style) {
			if(!(nodes instanceof Array)) {
				nodes = [nodes];
			}
			for(var i=0,max=nodes.length; i<max; ++i) {
				styleAppender.appendStyleToElement(nodes[i],style);
			}
		},
		///////////// 확인
		isImageNode : function(target) {
			if (target.nodeName == "IMG")
				return true;
			else
				return false;
		},
		isPartOfWrappedImage : function(node) {
			if (node.className.indexOf('img-part') != -1)
				return true;
			else
				return false;
		},
		/////////////get,set
		getMovedWidthByX : function (currentX) {
			var prevClientX = this._prevX;
			if(prevClientX == null) {prevClientX = currentX;};
			 
			return currentX-prevClientX;
		},
		getImageWidth : function() {
			return this._imgNode.style.width;
		},
		setPrevX: function(x) {
			this._prevX = x;
		},
		////////////////dispose TODO: 두개 합칠까?
		dispose : function() {
			this._unwrapSavedNode();
			this._cleanSavedData();
		},
		_cleanSavedData : function() {
			this._prevX = null;
			this._nodesBeUpdated =null;
			this._partNode = null;
		},
		_unwrapSavedNode : function() {
			
			if(this._partNode != null && this._nodesBeUpdated != null) {
				var wrappedImgNode = this._nodesBeUpdated[0],
				imgNode = this._nodesBeUpdated[1],
				parentNode = wrappedImgNode.parentNode;
				
				wrappedImgNode.parentNode.replaceChild(imgNode,wrappedImgNode);
				
			}
			
			
		}

	};
});