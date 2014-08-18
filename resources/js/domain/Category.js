/**
 * 
 */

$$namespace.include(function(require, module) {
	var TITLE = 'title'
	  , ID = 'id'
	var Category = module.exports = function Category (map) {
		this[ID] = map[ID] || 'root'
		this[TITLE] = map[TITLE] || ''
	}
})

