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
var U = require('../../common/util/util.js')

var Joiner = module.exports = function Joiner(childList, referenceKey, childsKey) {
	this.childList = childList;
	this.referenceKey = referenceKey;
	this.childsKey = childsKey;
	
	this.cachedIndex = {};
	this.isCache = false;
	this.hasRelation = _hasRelation;
	this.hookChildToBind = _hookChildToBind;
	
	this.key4sumToParent = null;
	
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
//root뿐아니라.. 모든 nodes에 대하여 해당하는 node를 찾는것.
Joiner.prototype.findNode = function (root, key) {
	var key = key || this.identifierKey
	var childList = this.childList
	for(var i in childList) {
		var child = childList[i]
		if(root[key] == child[key]) return child
	}
	return root
}

Joiner.prototype.setKey4sumTo = function (key4sumTo, delimiter, isToChild) {
	this.delimiter = delimiter || 0
	
	if(isToChild) {
		this.key4sumToChild = key4sumTo;
		var referenceKey = this.referenceKey
		if(key4sumTo == referenceKey) throw console.error(referenceKey +' and ' +key4sumTo + ' should not equal');
		
		this.hookChildToBind = function(child, node) {
			child[key4sumTo] = node[key4sumTo] + delimiter + child[key4sumTo];
			return child;
		}
		return;
	} else {
		this.key4sumToParent = key4sumTo;
		return;
	} 
		
}
Joiner.prototype.setKey4sumToParent = function (key4sumToParent, delimiter) {
	return this.setKey4sumTo(key4sumToParent, delimiter, false)
}
Joiner.prototype.setKey4sumToChild = function (key4sumToChild, delimiter) {
	return this.setKey4sumTo(key4sumToChild, delimiter, true)
	
}
Joiner.prototype.treeTo = function (root, identifierKey) {
	var key4sumToParent = this.key4sumToParent
	  , delimiter = this.delimiter
	  
	this.isCache = true;
	this.identifierKey = identifierKey || this.identifierKey;
	var rootOfTree = this.getBindedNodeByChilds(root, key4sumToParent, delimiter);
	return rootOfTree;
}

Joiner.prototype.getBindedNodeByChilds = function (node, key4sumToParent,  delimiter) {
	var childsKey = this.childsKey;
	var childsToBind = this.getChildsToBindToNode(node);
	if(_.isEmpty(childsToBind) ) return node;
	else {
		var newChildsToBind = []
		
		if(key4sumToParent) {var count = node[key4sumToParent] || 0}
		
		for(var i in childsToBind) {
			var newNode = childsToBind[i];
			var newChild =  this.getBindedNodeByChilds(newNode, key4sumToParent, delimiter);
			
			if(key4sumToParent) { count = count + delimiter +newChild[key4sumToParent]}
			
			newChildsToBind.push(newChild);
		}
		
		node[childsKey] = newChildsToBind;
		
		if(key4sumToParent) { node[key4sumToParent] = count}
		
		return node;
	}
	
};
Joiner.prototype.joinTo = function (nodes, identifierKey, assignChildIfNotFind) {
	this.identifierKey = identifierKey;
	assignChildIfNotFind = assignChildIfNotFind || function () {}
	
	var childsKey = this.childsKey;
	if(!_.isArray(nodes)) nodes = [nodes]
	
	for(var i in nodes) {
		var node = nodes[i]
		  , childs = this.getChildsToBindToNode(node)
		  , count = childs.length;
//		if(count == 0) {node[childsKey] = emptyChild}
		if(count == 0) {node[childsKey] = assignChildIfNotFind(node)}		
		if(count == 1) { node[childsKey] = childs.pop(); }
		if(count > 1) { node[childsKey] = childs; }
	}
	
	return nodes;
}
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
			childsToBindToNode.push(hookChildToBind(child, node));
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
function _hookChildToBind(child, node) {
	return child;
}
