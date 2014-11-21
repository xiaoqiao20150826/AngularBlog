

(function (define, _) {
	define([], function() {
		return ['common.util', makeTreeExplorer]
	})
	function makeTreeExplorer(U) {
		
		var TreeExplorer = function TreeExplorer(root, childsKey) {
			if(_.isEmpty(root) || _.isEmpty(childsKey)) return console.error('childKey is not exist');
			if(!_.isArray(root)) root = [root]
			
			this.root 		= root
			this.childsKey  = childsKey
		}
		
		//dfs임.깊이우선탐색.
		TreeExplorer.prototype.each = function (eachFn, eachChildsBefore, eachChildsAfter) {
			
			this.eachFn = allEachHook1(eachFn);
			this.eachChildsBefore = allEachHook1(eachChildsBefore); //root도 대상에 삼기위해.
			this.eachChildsAfter = allEachHook1(eachChildsAfter);
				
			this._deepSearch(this.root, null, -1);
		}
		//이건 private..
		TreeExplorer.prototype._deepSearch = function _deepSearch(childs, parentNode, originDeep) {
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
				if(this.eachFn) { this.eachFn(node, parentNode, deep, hasChild); }
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
		// 이건사용안할듯.
//		treeExplorer.repeatString = function (string, num) {
//			var repeatedString = ''
//			_.each(_.range(num), function () {
//				repeatedString = repeatedString + string
//			})
//			return repeatedString;
//		}
		
		//---------------------------------
		return TreeExplorer
	}
})(define, _)