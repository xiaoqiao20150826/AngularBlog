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
Joiner.prototype.setKey4aggregateToParent = function (key4aggregateToParent, delimiter, keyToBeAggregate) {
	return this.setKey4aggregate(key4aggregateToParent, delimiter, keyToBeAggregate, false)
}
Joiner.prototype.setKey4aggregateToChild = function (key4aggregateToChild, delimiter, keyToBeAggregate) {
	return this.setKey4aggregate(key4aggregateToChild, delimiter, keyToBeAggregate, true)
}
//key4aggregate의 값을 delimiter로 구분하여 whereKey에 isToChild(자식이나 부모를 향하여) 합.
Joiner.prototype.setKey4aggregate = function (key4aggregate, delimiter, keyToBeAggregate, isToChild) {
	this.delimiter = delimiter || 0
	this.keyToBeAggregate = keyToBeAggregate || key4aggregate

	//집합 방향을 자식,부모 중 결정.
	if(isToChild) 
		this.key4aggregateToChild = key4aggregate;
	else 
		this.key4aggregateToParent = key4aggregate;
}

Joiner.prototype.treeTo = function (root, identifierKey, nodeFn) {
	var key4aggregateToParent = this.key4aggregateToParent
	  , keyToBeAggregate = this.keyToBeAggregate
	  , delimiter = this.delimiter

	this.nodeFn = nodeFn;  
	this.isCache = true;
	this.identifierKey = identifierKey || this.identifierKey;
	var rootOfTree = this.getBindedNodeByChilds(root, key4aggregateToParent, delimiter, keyToBeAggregate);
	return rootOfTree;
}

Joiner.prototype.getBindedNodeByChilds = function (node, key4aggregateToParent,  delimiter, keyToBeAggregate) {
	var childsKey = this.childsKey;
	var childsToBind = this.getChildsToBindToNode(node);
	if(this.nodeFn) this.nodeFn(node) //단순히.. 무언가 작업하기위함.
	
	if(_.isEmpty(childsToBind) ) return node;
	else {
		var newChildsToBind = []
		
		// 집합 초기값 
		if(key4aggregateToParent) { var value4aggregate = node[key4aggregateToParent] || 0 }
		
		for(var i in childsToBind) {
			var newNode = childsToBind[i];
			var newChild =  this.getBindedNodeByChilds(newNode, key4aggregateToParent, delimiter, keyToBeAggregate);
			
			if(key4aggregateToParent) {
				var value4aggregateOfChild = newChild[key4aggregateToParent]
				  , value4ToBeAggregateOfChild = newChild[keyToBeAggregate]
				
				//집합의 값을 위한 키와 저장을 위한 키가 다르다.
				if(key4aggregateToParent != keyToBeAggregate) {
					if(value4ToBeAggregateOfChild) value4aggregateOfChild = value4ToBeAggregateOfChild
				}
				
				value4aggregate = value4aggregate + delimiter + value4aggregateOfChild
			}
			
			
			newChildsToBind.push(newChild);
		}
		
		node[childsKey] = newChildsToBind; //실제바인딩.
		
		//집합의 값
		if(key4aggregateToParent) { node[keyToBeAggregate] =  value4aggregate }
		
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
		if(count == 0) {node[childsKey] = assignChildIfNotFind(node)} //조건이 만족하는 자식이 없을경우.
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
	
	var childsToBindToNode = []
	for(var i in childList) {
		if(this.isCached(i)) continue;
		var child = childList[i];
		if(hasRelation(child[referenceKey], node[identifierKey]) ) {
			childsToBindToNode.push(this.hookChildToBind(child, node));
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
Joiner.prototype.hookChildToBind = function (child, node) {
	var key4aggregateToChild = this.key4aggregateToChild
	  , delimiter = this.delimiter
	  , keyToBeAggregate = this.keyToBeAggregate
	
	if(!key4aggregateToChild) { return child; }
	
	var value4aggregateOfNode = node[key4aggregateToChild]
	  , value4ToBeAggregateOfNode = node[keyToBeAggregate]
	
	//집합의 값을 위한 키와 저장을 위한 키가 다르다.
	if(key4aggregateToChild != keyToBeAggregate) {
		if(value4ToBeAggregateOfNode) value4aggregateOfNode = value4ToBeAggregateOfNode
	}
	
	child[keyToBeAggregate] = value4aggregateOfNode + delimiter + child[key4aggregateToChild];
	return child;
}
function _hasRelation(childValue, rootValue) {
	if(U.equal(childValue, rootValue)) return true;
	else return false;
}
