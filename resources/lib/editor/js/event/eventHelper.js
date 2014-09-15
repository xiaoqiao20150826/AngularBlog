/**
 *  이벤트의 기본동작. 헬퍼정도가 좋겟군.. 상속쓰지말자.
 */

$$namespace.include(function(require, module) {
	
	var eventHelper = module.exports =  {
		EVENT: {
			click:"click",
			keydown:"keydown",
			mousedown:"mousedown",
			mousemove:"mousemove",
			mouseup:"mouseup"
		},
		addClass: function(node, name) {
			var oldName = node.className;
			if(oldName.indexOf(name) == -1) { //없으면 추가.
				var	newName = oldName + " " + name;
				node.className = newName;
			}
		},
		removeClass: function(node, name) {
			var oldClassNames = node.className;
			if(oldClassNames.indexOf(name) != -1) { //있으면 제거
				var newClassName = oldClassNames.replace(name,"");
				node.className = newClassName;
			}
		},
		stop : function(e) {
			//전파막기 + 기본동작막기.
			if(typeof e.preventDefault === 'function') {
				e.preventDefault();
				e.stopPropagation();
			} else {
				e.returnValue = false;
				e.cancelBubble = true;
			}
	
		}
	};
	
});
