
/**
 * 형제 노드 탐색할때는 우측탐색만, 현위치의 좌측은 무시
 * 부모노드 탐색시도 마찬가지.
 * 자식노드 탐색은 firstChild(맨왼쪽)부터 시작노드만, 발견하면 우측노드 무시.
 */

$$namespace.include(function (require, module) {
	/*
	 * private static field
	 */
	var H = require('js/util/helper.js')
	
	var count = 0;
	var treeSearcher = module.exports = {
		
		//field
		_nodeBuffer : [],
		_visited : [],
			
		//method
		searchTree : function (startNode, endNode, filtering) {
			this._filtering = filtering || this._filteringTextNode;
			
			this._searchNode(startNode, endNode, this._filter);
			
			var buffer = this._nodeBuffer;
			this._dispose();
			return buffer;
		},
		
		_searchNode : function _searchNode(startNode, endNode, filter) {
			var	node = startNode,
				find = false;	
				
				find = this._searchSibling(node, endNode, filter);
				
				//형제 노드에서 찾지 못했다면 부모노드에서 탐색.
				if(!find) {
					console.log('s'+startNode)
					if(this.isInEditor(startNode)) {
//					if(startNode != null && this._isRangeEditor(startNode)) {
						var parentNode = startNode.parentNode;
						this._visited.push(parentNode); //현재노드의 형제가 모두 방문되었다면 그 부모가 방문되었다는 것으로 생각한다. 이전형제를 찾지않기위해서.
														//다음턴에는 부모의 형제부터 찾아봄. 
						this._searchNode(parentNode, endNode, filter);
					} else {
						throw "여기도달하면 안됨";
					}; 
				};
				
		},
		_searchSibling : function (node, endNode, filter) {
				var beFind = false;
				
				while(node) { //나와 모든 형제노드를 탐색.
					if(this._isVisited(node)) { //방문한노드라면 아래작업안하고 다음형제노드 확인.
						node = node.nextSibling;
						continue;
					};
					filter.call(this,node) ;	//1. 실질적작업.
					
					if(node == endNode) { //현재 노드에서 종료조건 발견한 경우.
						beFind = true;
						break;
					}; //after작업 완료체크
					
					if(this._hasChild(node)) { //자식이있으면 작업반복.
						
						beFind = this._searchSibling(node.childNodes[0], endNode, filter);
						if(beFind) {
							break; //자식에서 종료조건 발견시 더이상 형제 탐색안함.
						};
					}
					node = node.nextSibling;
				};
				
				return beFind; //형제노드를 모두검색했는데 찾지 못했다. or 찾았다는 것을 시작노드에게 알려준다..
		},
		isInEditor : function (node) {
			if(H.notExist(node)) return false;
			
			var parentNode = node.parentNode
			if(H.exist(parentNode) && (parentNode.nodeName !="BODY" || parentNode.nodeName !="HTML")) // body?로해야하지않을까 
				return true;
			else
				return false;
		},
		_isVisited : function(node) { //TODO:성능이.. 자바의 set같은거있나?
			for(var i=0,max=this._visited.length; i<max; ++i) {
				if(this._visited[i]==node) {
					return true;
				}
			}
			this._visited.push(node); //방문표시
			return false;
		},
		_filter : function(node) {
			if(this._filtering(node)) { 
				this._nodeBuffer.push(node);
			}
		},
		_filteringTextNode : function(node) {
			if(node.nodeType==3) return true;
			else return false;
		},
		_hasChild: function(node) {
			var nodeType = node.nodeType;
			if(nodeType == 1 && nodeType < 4) { //엘리먼트중
				if(node.hasChildNodes()) { //자식이 있다면
					return true; 
				}
			}
			return false;
		},
		_dispose : function () { 
			this._nodeBuffer = [];
			this._visited = [];
		}
	};
});