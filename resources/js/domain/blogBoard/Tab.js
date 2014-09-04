/**
 * 
 */

$$namespace.include(function(require, module) {

	var INDEX = 'index'
	  , SORTER = 'sorter'
	var Tab = module.exports = function Tab (map) {
		var map = map || {}
		this[INDEX] = map[INDEX] || 0
		this[SORTER] = map[SORTER] || 'newest'
	}
})

