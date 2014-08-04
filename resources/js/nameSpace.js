/*
 * 
 *  $$namespace
 *     - 할당 위치
 *       : window.$$namespace  
 *     - 사용
 *       
 *        - package
 *          ; var package = $$namespace.package('com.kang').package('util');
 *             
 *        - import 
 *          ; var importModule = package.import(importModuleName);
 *            
 *        - export
 *          * 주의 : 사용하기 쉽게 아래처럼 만들었지만 패키지 참조를 직접 사용하므로 조심해야함.
 *                   쓰다가 이상하면 예전버전으로 살릴것.( ex ) pacakge.exprot(moduleName, moduel);)
 *          ;   var moduleLoader = utilPackage.export.moduleLoader = {};
 *          or) var e_module = package.export[moduleName] = module;
 *       
 *   
 *  @parmas
 *    - this : 현재 페이지의 window
 *    
 *  주의
 *    - window에 이미 존재하는 이름을 사용하면 덮어쓰는 위험이있다.  
 */
(function (_window) {
	var window = _window;
	
	var ns = window.$$namespace = {};
	
	ns.package = function(packageName, newContext) {
		if(packageName == null || packageName == undefined) throw console.error('need a param');
		if(typeof packageName != 'string') throw console.error('should be param typeof String');
		
		var context = newContext || window; //
		var packageList = packageName.split('.')
		  , firstPackageName = packageList[0];

		var aPackageName;
		for (var i = 0, max = packageList.length; i < max; ++i) {
			aPackageName = packageList[i];
			if(!(alreadyExistObject(context, aPackageName) )) context[aPackageName] = {}; 
			context = context[aPackageName];
		}
		
		return exportAndExport1(context);
	}
	function alreadyExistObject(_context, _aPackageName) {
		var o = _context[_aPackageName];
		if(o && o instanceof Object) return true;
		else return false;
	}
	
	function exportAndExport1(package) {
		return { 
			export : package
		  , import : importFn
		  , package : packageFn
		};

		//
//		function exportFn(moduleName, module) {
//			if(alreadyExistObject(package, moduleName)) throw console.error('already exist name in pacakge');
//			
//			if(!(module instanceof Object || module instanceof Function)) throw console.error('module type is wrong');
//			
//			package[moduleName] = module;
//			return module; 
//		}
		function importFn(moduleName) {
			if(!(alreadyExistObject(package, moduleName))) {throw console.error( 'not exist '+ moduleName+ ' in pacakge')};
			return package[moduleName];
		}
		function packageFn(packageName) {
			return ns.package(packageName, package);
		}
	}
	
})(this);