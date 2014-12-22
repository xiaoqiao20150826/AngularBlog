/**
 * 
 */

(function(define, angular, require) {
	//nodeblog setup & run.
	
	define([
	        'state'
	       ,'module/blogBoard/state'
	       
	       ,'ocLazyLoad'		
	       ,'uiRouter'
	       ,'loadingBar'
	],
	function (appState, blogBoardState) {
		
		// - bootstrap 모듈 실행 후  oclazyload로 필요 모듈 로딩.
		// - app.nav, app.blogBoard는 state의 변화에 의해 로딩됨.
		//TODO: state의 등록은 이 시점에 해야함. 지연 모듈에 등록하면 동작하지않음. 왜그런지는...
		//     추측컨데, angular-loading-bar도 동작안했던것 보니. 
		//     지연모듈에 의존성모듈을 등록하면 올바르게 동작하지 않은가보다.
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
				// 모듈 지연로딩과 url 리스너 지연 실행
				$ocLazyLoad.load('app')
						   .then(function() {
							   console.log('start app')
							   $urlRouter.sync();
							   
							   //한글디코딩(url변화시)
							   $location.$$url = decodeURI($location.$$url)
							   $location.$$absUrl = decodeURI($location.$$absUrl)
						   })
				$urlRouter.listen();
			}]);
			
		
			// angular 기본 모듈을 미리 실행시킴.
			angular.bootstrap( document, [ 'bootstrap' ]);
	})
	
})(define, angular, require)