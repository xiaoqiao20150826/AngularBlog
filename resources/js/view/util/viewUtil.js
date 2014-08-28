/**
 * 
 */
$$namespace.include(function(require, module){
	var H = require('util/helper')
	
	var CLASS_ACTIVE = 'active'
	  , CLASS_BG_COLOR = 'bg-info'
	//
	var viewUtil = module.exports = {}
	//찾은 결과가 하나일수도, 다수일수도.
	viewUtil.find$btn = function ($buttons, value, key) {
		return $buttons.filter(function () {
			var $btn = $(this)
			  , ds = $btn.data()
			  , valueOfBtn = ds[key]
			
			if(H.notExist(valueOfBtn)) {valueOfBtn = $btn.text().trim()}		  
					  
			if(valueOfBtn == value) 
				return true;
			else 
				return false;
        });
	}
	//형제를 제외하고 부여.
	viewUtil.assignBgColorTo$btn = function ($btn, all$btns, className) {
		var className = className || CLASS_BG_COLOR
		this.assignEffectTo$btn($btn,all$btns, className); 
	}
	viewUtil.assignActiveTo$btn = function ($btn,all$btns) { this.assignEffectTo$btn($btn,all$btns, CLASS_ACTIVE); }
	viewUtil.assignEffectTo$btn = function ($btn, all$btns, effectClass) {
		if($btn.length < 1 ) return;
		
		all$btns.removeClass(effectClass);
		$btn.addClass(effectClass);
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
});

//@ sourceURL=/view/viewUtil.js