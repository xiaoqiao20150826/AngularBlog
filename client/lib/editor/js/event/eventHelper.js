/**
 *  �̺�Ʈ�� �⺻����. ���������� ���ٱ�.. ��Ӿ�������.
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
			if(oldName.indexOf(name) == -1) { //������ �߰�.
				var	newName = oldName + " " + name;
				node.className = newName;
			}
		},
		removeClass: function(node, name) {
			var oldClassNames = node.className;
			if(oldClassNames.indexOf(name) != -1) { //������ ����
				var newClassName = oldClassNames.replace(name,"");
				node.className = newClassName;
			}
		},
		stop : function(e) {
			//���ĸ��� + �⺻���۸���.
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
