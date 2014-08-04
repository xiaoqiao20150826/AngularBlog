/**
 * 
 *  - 자바스크립트를 로드하여 현재 페이지로 불러온다.
 *  - 스크립트를 포함시키는 것을 축소시키기 위해 
 *    moduleLoader에서 의존하는 path의 소스를 moduleLoader에 붙여넣기함.(20140804) 
 *  
 * 
 *  @param
 *   - modulePath : 서버는 절대경로, 로컬은 페이지의 상대경로
 *  
 */

(function(window) {
	var $ = window.$;
	if($ == null || $ == undefined) throw console.error('need $ jquery lib');
	
	var utilPackage = $$namespace.package('com.kang').package('util')
	  , _path = utilPackage.import('path');
	
	var moduleLoader = utilPackage.export.moduleLoader = {}; 
	
	moduleLoader.load = function (/* args*/) {
		var cond = arguments.length;
		
		switch(cond) {
		case 1 : return _load1(arguments[0])
		case 2 : return moduleLoader._load(arguments[0], arguments[1])
		default : throw console.error(' args count is wrong')
		}
		
		function _load1(arg1) {
			return moduleLoader._load(endDone, arg1)
			function endDone(a, status) {
				if(status=='error') throw console.error(a); 
			}
		}
	};
	
	
	moduleLoader._load = function (done, path) {
		if(path instanceof Array) return this.loadMany(done, path);
		else return this.loadOne(done, path);
	};
	moduleLoader.loadMany = function(endDone, paths) {
		if(paths.length < 1) throw console.error('paths should not empty');
		
		var loadOne = this.loadOne
		  , curIndex = 0 
		  , endIndex = paths.length-1;
		
		nextCall(null);
		function nextCall(a, status) {
			if(status=='error') throw console.error(a);
			if(curIndex==endIndex) nextCall = endDone;
			
			var path = paths[curIndex++];
			return loadOne(nextCall, path)
		}
	}
	moduleLoader.loadOne = function (done, modulePath) {
		if(modulePath ==null || modulePath == undefined) throw console.error('need a modulePath');
		modulePath = _path.parse(modulePath)
		
		$.getScript(modulePath)
		 .done(done)
		 .fail(done);
	};
//deprease
	moduleLoader.create$Script = function (path) {
		return $('<script>')
		.attr("type", "text/javascript")
		.attr("charset", "utf-8")
		.attr("src", path)
		.appendTo('body');
	}
})(this);
