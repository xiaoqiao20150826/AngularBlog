

(function (define, _) {
	define([], function() {
		return ['common.util', makeTree]
	})
	function makeTree(U) {
		
		var Tree = function Tree(root, childsKey, idKey) {
			if(_.isEmpty(childsKey)) return console.error('childKey is not exist');
			if(_.isEmpty(idKey)) 	 return console.error('idKey is not exist');
			if(!_.isArray(root)) 	 root = [root];
			
			this.root 		= root
			this.childsKey  = childsKey
			this.idKey  	= idKey
		}
		
		//dfs임.깊이우선탐색.
		Tree.prototype.each = function (eachFn, eachChildsBefore, eachChildsAfter) {
			
			this.eachFn = allEachHook1(eachFn);
			this.eachChildsBefore = allEachHook1(eachChildsBefore); //root도 대상에 삼기위해.
			this.eachChildsAfter = allEachHook1(eachChildsAfter);
				
			this._deepSearch(this.root, null, -1);
		}
		Tree.prototype.first = function (idValue, eachOneFn) {
			var idKey = this.idKey
			var self  = this
			
			self.__firstNode = null
			self.__parentNode = null
			self.stop = false
			
			var tempEach = this.eachFn;
			this.eachFn = _firstNodeFilter(idKey, idValue)
			this._deepSearch(this.root, null, -1);
			this.eachFn = tempEach
			
			return this.__firstNode;
			
			function _firstNodeFilter(idKey, idValue) {
				return function(node, parentNode, deep, hasChild, index) {
//					console.log(node)
					if(node[idKey] == idValue) {
						self.__firstNode = node
						self.__parentNode = parentNode
						self.stop = true
						if(eachOneFn) {eachOneFn(node, parentNode, deep, hasChild, index);}
					}
				}
			}
		}
		Tree.prototype.eachOne = function (idValue, eachOneFn) {
			this.first(idValue, eachOneFn)
		}
		
		Tree.prototype.addChild = function (parentNode, newNode) {
			if(_.isEmpty(parentNode[this.childsKey])) parentNode[this.childsKey] = []
			
			parentNode[this.childsKey].push(newNode)
			
			return newNode;
		}
		Tree.prototype.drop= function (idValue) {
			var node         = this.first(idValue)
			 ,  childNodes   = node[this.childsKey] || childNodes
			 ,  parentNode   = this.__parentNode
			 ,  idKey		 = this.idKey
			 
			 //부모가 없을경우 root..들.
		    if(_.isEmpty(parentNode)) {
		    	if(_.isEmpty(childNodes)) this.root = null;
		    	else return this.root = childNodes
		    }
		    
		    // 부모가있을경우.
		    var siblingNodes = parentNode[this.childsKey]
			  , newSiblingNodes = []
			for(var i in siblingNodes) {
				var _node = siblingNodes[i]
				if(_node[idKey] == idValue) { newSiblingNodes = _.union(newSiblingNodes, childNodes) }
				else newSiblingNodes.push(_node)
			}
			
		    parentNode[this.childsKey] = newSiblingNodes
		}
		
		Tree.prototype.getRoot = function () {return this.root}
		
		//이건 private..
		Tree.prototype._deepSearch = function _deepSearch(childs, parentNode, originDeep) {
			if(U.notExist(childs)) return;
			if(_.isEmpty(childs)) return;
			
			if(!_.isArray(childs)) childs = [childs];
			
			
			if(this.eachChildsBefore) {this.eachChildsBefore(parentNode, originDeep) }
			var deep = originDeep+1;
			for(var i in childs) {
				var node = childs[i]
				, childNodes = node[this.childsKey]
				, hasChild = _hasChild(childNodes)
				//hasChild말고, childNodes를 전달하는것이 나을까?
				if(this.eachFn) { this.eachFn(node, parentNode, deep, hasChild, i);}
				if(this.stop) return;
				
				this._deepSearch(childNodes, node, deep)
			}
			
			if(this.eachChildsAfter) {this.eachChildsAfter(parentNode, originDeep)}
			
			return ;
		}
		// helper
		function _hasChild(childs) {
			return !_.isEmpty(childs);
		}
		function allEachHook1(each) {
			if(!each) return function () {};
			return function (node, parentNode, deep, hasChild) {
				if(deep < 0) return;
				
				return each.apply(null, arguments);
			}
		}
		
		//---------------------------------
		return Tree
	}
})(define, _)