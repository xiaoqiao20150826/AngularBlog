/**
 * 
 */

$$namespace.include(function(require, module) {

	var INDEX = 'index'
	  , PAGE_NUM = 'pageNum'
	var Pager = module.exports = function Pager (map) {
		var map = map || {}
		this[INDEX] = map[INDEX] || 0
		this[PAGE_NUM] = map[PAGE_NUM] || 1
	}
})


//@ sourceURL=/domain/Pager.js