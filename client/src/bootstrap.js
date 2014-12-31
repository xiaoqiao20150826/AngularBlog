/**
 * 
 */

(function(define, angular, require) {
	//nodeblog setup & run.
	
	define([
	        'state'
	       ,'module/blogBoard/state'
	],
	function (appState, blogBoardState) {
		
		// - url 이벤트 지연 실행(모든 지연 모듈 등록 후 )
		// - bootstrap 모듈 실행 후  oclazyload로 필요 모듈 로딩.
		//   ; app 모듈 등을 지연 등록시키는 이유는 
		//  그냥하면 배포시에 얘네들 로딩하는동안 angular.bootstrap전에 타임아웃걸려서
		//  로컬에서는 안걸리는데..?항상걸리는것이 아니네
		
		angular.module('bootstrap', ['oc.lazyLoad', 'ui.router', 'angular-loading-bar'])
		   .config(['$ocLazyLoadProvider'
		           ,function($ocLazyLoadProvider) {
					    $ocLazyLoadProvider.config({
			                asyncLoader: require
			               ,modules    : 
			            	   [
				            	    { 
				            	       name  : 'app'
				            	      ,files : ['app']
				            	    }
				            	   ,{ 
				            	      name  : 'app.nav'
				            	     ,files : ['module/nav/nav']
				            	    }
				            	   ,{
				            		  name  : 'app.blogBoard'
				            		 ,files : ['module/blogBoard/blogBoard']
				            	    }
			            	    ] 
					    });
			}])
			.config(appState)
			.config(blogBoardState)
			.config(['$urlRouterProvider',function($urlRouterProvider) {
				// url의 변화를 지연시킴. 아래의 모듈이 로딩되기까지.
				// 사용법은 좀..뭔가 애매하지만. 그렇다.
				$urlRouterProvider.deferIntercept();
			}])
			.run(['$ocLazyLoad', '$urlRouter','$location', function($ocLazyLoad, $urlRouter,$location) {
				// angular 실행후 모듈로딩과 url 리스너 지연 실행
				$ocLazyLoad.load(['app', 'app.nav', 'app.blogBoard'])
						   .then(function() {
							   console.log('start app')
							   
							   //한글디코딩(url변화시)
							   $location.$$url = decodeURI($location.$$url)
							   $location.$$absUrl = decodeURI($location.$$absUrl)
							   // 지연된 url 동작
							   $urlRouter.sync();
						   })
				$urlRouter.listen();
			}]);
		
		
		// facebook auth시 URL의 #_=_제거를 위해... angular 모듈 시작전에 제거해줘야함.
		if (window.location.hash && window.location.hash == '#_=_') {
	        window.location.hash = '';
	    }
		// angular 기본 모듈을 미리 실행시킴.
		angular.bootstrap( document, [ 'bootstrap' ]);
	})
	
})(define, angular, require)