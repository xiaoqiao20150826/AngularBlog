/**
 * 
 */
$$namespace.include(function(require, module){
	var CLASS_ACTIVE = 'active';
	
	//
	var viewUtil = module.exports = {}
	
	viewUtil.replaceDiv= function ($div , html) {
		return $div.replaceWith(html);
	};
	
	viewUtil.activeOne = function ($buttons, currentIndex) {
		var $button = this.findOneButton($buttons, currentIndex)  
		viewUtil.activeOneOfSibling($button);
	}
	viewUtil.findOneButton = function ($buttons, currentIndex) {
		return $buttons.filter(function () {
			var $btn = $(this)
			  , ds = $btn.data()
			  , index = ds.index
			
			if(index == currentIndex) return true;
			else return false;
        });
	}
	viewUtil.activeOneOfSibling = function ($btn) {
		var $siblingBtns = $btn.siblings();
		
		$btn.addClass(CLASS_ACTIVE);
		$siblingBtns.removeClass(CLASS_ACTIVE);
	}
	viewUtil.equalNodeName = function (node, nodeName) {
		if(node.nodeName && node.nodeName == nodeName) return true;
		else return false;
	}
	viewUtil.isEmptyChildren = function ($parent) {
		if($parent.children().length > 0) 
			return true;
		else
			return false;
	}
//	viewUtil.findOne = function ($nodes, key, value) {
//		return $nodes.filter(function () {
//			return if($(this).data(key) == value) 
//        });
//	}
});

//@ sourceURL=/view/viewUtil.js