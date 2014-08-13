/**
 * 
 */
var _ = require('underscore')
  , U = require('./util')
var scriptletUtil = module.exports = {}


scriptletUtil.treeEach = function (nodes, childsKey, eachFn) {
	_deepSearch(nodes, 0);
	function _deepSearch(nodes, originDeep) {
		if(U.notExist(nodes)) return;
		
		if(!_.isArray(nodes)) nodes = [nodes];
		if(_.isEmpty(nodes)) return;
		
		for(var i in nodes) {
			var node = nodes[i]
			  , childNodes = node[childsKey];
			var deep = originDeep+1;
			eachFn(node, deep);
			_deepSearch(childNodes, deep)
		}
		return ;
	}
}
scriptletUtil.repeatString = function (string, num) {
	var repeatedString = ''
	_.each(_.range(num), function () {
		repeatedString = repeatedString + string
	})
	return repeatedString;
}