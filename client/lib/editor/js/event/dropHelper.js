/**
 * 
 */
/**
 * drop메뉴 관련된것 공통사항...
 * 콜백 이벤트도 도와줌.
 */
$$namespace.include(function (require, module) {
	var	DROP = {menuName:"dropdown-menu",
				titleClassName: "dropdown-title",
				itemNodeType : "li",
				itemClassName:"dropdown-item"};
	
	var dropHelper = module.exports = {
		createItemNode : function(textContent, styleStr) {
			var item = document.createElement(DROP.itemNodeType);
			item.className = DROP.itemClassName;
			item.style.cssText = styleStr;
			item.textContent = textContent;
			return item;
		},
		
		getMenuElement : function(dropNode) {
			var childNodes = dropNode.childNodes;
			for (var i = 0; max = childNodes.length; ++i) {
				var child = childNodes[i]
				  , className = child.className
				  
				if (className && child.className.indexOf(DROP.menuName) != -1) {
					return child;
				}
			}
			
			throw "not found dropmenu";
		},
		//TODO: unhorver?? 1.
		openAndClose :function (menu) {
			var btnStyle = menu.style;
			
			if(btnStyle.display == "") {
				btnStyle.display = "block";
			} else {
				btnStyle.display = "";
			};
		},
		updateBtnTitle : function(btnNode, style) {
			var titleNode = btnNode.firstElementChild;
			titleNode.style.cssText = style; 
			
		},
		isTitleNode : function(target) {
			var className = target.className;
			if(className.indexOf(DROP.titleClassName) != -1) 
				return true;
			else
				return false;
		},
		isItemNode : function(target) {
			var className = target.className;
			if(className.indexOf(DROP.itemClassName) != -1) 
				return true;
			else
				return false;
		},
		getItemClassName : function () {return DROP.itemClassName}
		
		

	};
});
//@ sourceURL=editor/event/dropHelper.js