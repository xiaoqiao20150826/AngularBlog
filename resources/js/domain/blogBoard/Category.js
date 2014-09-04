/**
 * 
 */

$$namespace.include(function(require, module) {
	var TITLE = 'title'
	  , ID = 'id'
	var Category = module.exports = function Category (map) {
		var map = map || {}
		this[ID] = map[ID]
		
		var title = map[TITLE] || 'root'
		this[TITLE] = title.trim()
	}
})

