/**
 * 
 */
var _ = require('underscore')
  , U = require('./util')
var scriptletUtil = module.exports = {}


//root기준으로 했으면 좋았을것을.
scriptletUtil.treeEach = function (childs, childsKey, eachFn, eachChildsBefore, eachChildsAfter) {
	var root = {};
	_deepSearch(childs, root, 0);
	function _deepSearch(childs, parentNode, originDeep) {
		if(U.notExist(childs)) return;
		if(_.isEmpty(childs)) return;
		
		if(!_.isArray(childs)) childs = [childs];

		var deep = originDeep+1;
		if(eachChildsBefore) {eachChildsBefore(parentNode,deep) }
		for(var i in childs) {
			var node = childs[i]
			  , childNodes = node[childsKey]
			  , hasChild = _hasChild(childNodes)
			if(eachFn) { eachFn(node, deep, hasChild); }
			_deepSearch(childNodes, node, deep)
		}
		if(eachChildsAfter) {eachChildsAfter(parentNode, deep)}
		return ;
	}
	// helper
	function _hasChild(childs) {
		return !_.isEmpty(childs);
	}
}

scriptletUtil.repeatString = function (string, num) {
	var repeatedString = ''
	_.each(_.range(num), function () {
		repeatedString = repeatedString + string
	})
	return repeatedString;
}