/**
 * 
 */
/**
 * 첫번째 작업 : 네임스페이스 초기화 기본 네임스페이스 : com.kang
 */
$$NameSpace = function(nsStr) {
		var nsArray = nsStr.split('.');
		var context = window;
		var nsName;
	
		for (var i = 0, max = nsArray.length; i < max; ++i) {
			nsName = nsArray[i];
			if (!(context[nsName])) 
				context[nsName] = {};
			
			context = context[nsName];
		}
		return context;
	};
	
(function(str) {
	$$NameSpace(str);
})("com.kang");
