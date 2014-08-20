/**
 *  # 역할
 *   - 문서의 참조를 실제문서로 조인한다.
 *  
 *  # 전제조건
 *   - list는 Array[]
 *   - node는 Object{}
 *  
 *  # 기능
 *  1) 1:1 관계를 조인하여 joinedTargets를 반환한다.
 *     ; sources, targets를 인자로 받는다.
 *   
 *  2) 1:N 관계를 자식들에 대한 참조를 갖는 트리구조로 변환하여 그 루트를 반환한다. 
 *     ; 단일 노드 리스트를 인자로 받는다.
 *   
 *     ## 전제조건 
 *        - 모든 노드는 유일한 식별자를 id로 가진다. 
 *          ; 식별자 이름은 id, _id등으로 설정 해야 한다.
 *      
 *        - 모든 노드는 부모에 대한 참조를 가지고 있다.
 *          ; 부모의 식별자 이름은 parentId 등으로 설정 해야 한다.  
 *  
 *	
 */
var _ = require('underscore')
var U = require('../common/util/util.js')

var Joiner = module.exports = function Joiner(childList, referenceKey, childsKey) {
	this.childList = childList;
	this.referenceKey = referenceKey;
	this.childsKey = childsKey;
	
	this.cachedIndex = {};
	this.isCache = false;
	this.hasRelation = _hasRelation;
	this.hookChildToBind = _hookChildToBind;
	this.key4count = null;
};
Joiner.prototype.setIdentifierKey = function (identifierKey) {
	this.identifierKey = identifierKey;
}
Joiner.prototype.setReferenceKey = function (referenceKey) {
	this.referenceKey = referenceKey;
}
Joiner.prototype.setChildsKey = function (childsKey) {
	this.childsKey = childsKey;
}
Joiner.prototype.setHasRelation = function (hasRelation) {
	this.hasRelation = hasRelation
}
Joiner.prototype.setHookChildToBind = function (hookChildToBind) {
	this.hookChildToBind = hookChildToBind
}
// sum? 같은것으로 이름을 바꾸자.
Joiner.prototype.setKey4count = function (key4count, delimiter) {
	this.key4count = key4count;
	this.delimiter = delimiter || 0
}
//root뿐아니라.. 모든 nodes에 대하여 해당하는 node를 찾는것.
Joiner.prototype.findRoot = function (root, key) {
	var childList = this.childList
	for(var i in childList) {
		var child = childList[i]
		if(root[key] == child[key]) return child
	}
	return root
}
Joiner.prototype.joinTo = function (nodes, identifierKey, emptyChild) {
	this.identifierKey = identifierKey;
	
	var childsKey = this.childsKey;
	if(!_.isArray(nodes)) nodes = [nodes]
	
	for(var i in nodes) {
		var node = nodes[i]
		  , childs = this.getChildsToBindToNode(node)
		  , count = childs.length;
		if(count == 0) {node[childsKey] = emptyChild}
		if(count == 1) { node[childsKey] = childs.pop(); }
		if(count > 1) { node[childsKey] = childs; }
	}
	
	return nodes;
}

Joiner.prototype.treeTo = function (root, identifierKey) {
	var key4count = this.key4count
	  , delimiter = this.delimiter
	this.isCache = true;
	this.identifierKey = identifierKey;
	var rootOfTree = this.getBindedNodeByChilds(root, key4count, delimiter);
	return rootOfTree;
}

Joiner.prototype.getBindedNodeByChilds = function (node, key4count, delimiter) {
	var childsKey = this.childsKey;
	var childsToBind = this.getChildsToBindToNode(node);
	if(_.isEmpty(childsToBind) ) return node;
	else {
		var newChildsToBind = []
		if(key4count) {var count = node[key4count] || 0}
		for(var i in childsToBind) {
			var newNode = childsToBind[i];
			var newChild =  this.getBindedNodeByChilds(newNode, key4count, delimiter);
			if(key4count) { count = count + delimiter +newChild[key4count]}
				
			newChildsToBind.push(newChild);
		}
		node[childsKey] = newChildsToBind;
		
		if(key4count) { node[key4count] = count}
		return node;
	}
	
};

Joiner.prototype.getChildsToBindToNode = function (node) {
	var identifierKey = this.identifierKey
	  , referenceKey = this.referenceKey
	  , childList = this.childList
	  , hasRelation = this.hasRelation
	  , hookChildToBind = this.hookChildToBind
	
	var childsToBindToNode = []
	for(var i in childList) {
		if(this.isCached(i)) continue;
		var child = childList[i];
		if(hasRelation(child[referenceKey], node[identifierKey]) ) {
			childsToBindToNode.push(hookChildToBind(child));
			this.cacheIndex(i);
		}
	}
	return childsToBindToNode;
}
Joiner.prototype.isCached = function (index) {
	var value = this.cachedIndex[index];
	if(U.exist(value)) return true;
	else return false;
}
Joiner.prototype.cacheIndex = function (index) {
	if(this.isCache) {
		this.cachedIndex[index] = true;
	}
}
function _hasRelation(childValue, rootValue) {
	if(U.equal(childValue, rootValue)) return true;
	else return false;
}
function _hookChildToBind(child) {
	return child;
}
