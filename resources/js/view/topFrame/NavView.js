/**
 * 
 */

$$namespace.include(function(require, module){
	
	var viewUtil = require('/view/util/viewUtil')
	
	var NAV_BTNS = '.nav-btn'
	
	var NavView = module.exports = function NavView() {}
	
	NavView.prototype.get$btns = function() {return $(NAV_BTNS) }
	
	NavView.prototype.assignEffect = function ($selectedBtn) {
		if(!$selectedBtn || !($selectedBtn instanceof $)) return; //없으면하지마.처음로딩시 없음.
		
		var all$btns = this.get$btns()
		viewUtil.assignActiveTo$btn($selectedBtn, all$btns)
	}
	
	//dropdown인지 거르기 하위 li가 있으면 드랍다운버튼
	NavView.prototype.isNotDropDown = function ($btn) {
		var className = $btn.attr('class')
		
		if(className.indexOf('drop') == -1) return true;
		else return false;
	}
	NavView.prototype.getUrl = function ($btn) {
		var url = $btn.find('a').attr('href')
		return url
	}
});

//@ sourceURL=/view/NavView.js