
/**
 * ���� ��� Ž���Ҷ��� ����Ž����, ����ġ�� ������ ����
 * �θ��� Ž���õ� ��������.
 * �ڽĳ�� Ž���� firstChild(�ǿ���)���� ���۳�常, �߰��ϸ� ������� ����.
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
				
				//���� ��忡�� ã�� ���ߴٸ� �θ��忡�� Ž��.
				if(!find) {
					console.log('s'+startNode)
					if(this.isInEditor(startNode)) {
//					if(startNode != null && this._isRangeEditor(startNode)) {
						var parentNode = startNode.parentNode;
						this._visited.push(parentNode); //�������� ������ ��� �湮�Ǿ��ٸ� �� �θ� �湮�Ǿ��ٴ� ������ �����Ѵ�. ���������� ã���ʱ����ؼ�.
														//�����Ͽ��� �θ��� �������� ã�ƺ�. 
						this._searchNode(parentNode, endNode, filter);
					} else {
						throw "���⵵���ϸ� �ȵ�";
					}; 
				};
				
		},
		_searchSibling : function (node, endNode, filter) {
				var beFind = false;
				
				while(node) { //���� ��� ������带 Ž��.
					if(this._isVisited(node)) { //�湮�ѳ���� �Ʒ��۾����ϰ� ����������� Ȯ��.
						node = node.nextSibling;
						continue;
					};
					filter.call(this,node) ;	//1. �������۾�.
					
					if(node == endNode) { //���� ��忡�� �������� �߰��� ���.
						beFind = true;
						break;
					}; //after�۾� �Ϸ�üũ
					
					if(this._hasChild(node)) { //�ڽ��������� �۾��ݺ�.
						
						beFind = this._searchSibling(node.childNodes[0], endNode, filter);
						if(beFind) {
							break; //�ڽĿ��� �������� �߽߰� ���̻� ���� Ž������.
						};
					}
					node = node.nextSibling;
				};
				
				return beFind; //������带 ��ΰ˻��ߴµ� ã�� ���ߴ�. or ã�Ҵٴ� ���� ���۳�忡�� �˷��ش�..
		},
		isInEditor : function (node) {
			if(H.notExist(node)) return false;
			
			var parentNode = node.parentNode
			if(H.exist(parentNode) && (parentNode.nodeName !="BODY" || parentNode.nodeName !="HTML")) // body?���ؾ����������� 
				return true;
			else
				return false;
		},
		_isVisited : function(node) { //TODO:������.. �ڹ��� set�������ֳ�?
			for(var i=0,max=this._visited.length; i<max; ++i) {
				if(this._visited[i]==node) {
					return true;
				}
			}
			this._visited.push(node); //�湮ǥ��
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
			if(nodeType == 1 && nodeType < 4) { //������Ʈ��
				if(node.hasChildNodes()) { //�ڽ��� �ִٸ�
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