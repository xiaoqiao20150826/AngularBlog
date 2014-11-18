/**
 * 
 * 	# Why 
 * 	 - SPA를 위해 url의 변화에 대해 적절한 부분 뷰를 로딩하는 것이 필요하다.
 * 
 *  # What
 *   - url의 변화에 대해 전체적인 페이지 내의 뷰의 변화를 통제한다.
 *    : 기본적으로 $stateProvider의 설정.. $state를 사용한다.
 *    : url이동시 페이지 내의 적절한 부분 뷰로 변화시킨다.(컨트롤러도 올바르게 할당해야함.)
 *    : 히스토리(뒤로가기, 앞으로가기)도 가능해야함.  
 *  
 *  # How
 *   - url에 대해서..(host url 생략)
 *     1) "" , "/"   - app
 *       - ""  : 기본적으로 /#/을 붙여서 생각해야함. 햇갈리지 말자.
 *       		 부모가 / 자식이 /blog 이면 /#//blog 라는 이상한 주소가됨.

 *       - 모든 url의 값의 레이아웃(추상) 역할만함.
 *         ; 뷰의 영역(프레임)을 구분해놓음.
 *         ; 레이아웃이 되는 "페이지"를 로딩함.
 *         ; 부분 뷰의 기본설정은 아래와 같음. 
 *       - top:nav, side:, center:"없음.", bottom:footer
 *       
 *       - 로딩 후 $state.go('blogBoard.list')로 이동. 실제 url은 /blog
 *     
 *   
 */



(function(define) {
	define([], function () {
		return [	'$stateProvider', '$urlRouterProvider', setupState]
			   
   })
   function setupState(   $stateProvider ,  $urlRouterProvider) {
		// 주의할것이 /#/ 기준이야.  
	   $urlRouterProvider		
				       .when('', '/blog')     //   localhost:3000 -> /#/blog  애만 /#/아님 주의.
				       .when('/', '/blog')    // localhost:3000/#/ -> /#/blog
//				       .otherwise('/')  	  //
				       
		var _curdir = '/resource/src/app/' 
	      , APP 	  = 'app'
	   
	   // -=------------------- app 	  
		$stateProvider
		.state(APP, { //root
				  url   		: ''
				, abstract 		: true
				, views : 		  {
					''				: { 
										 templateUrl 	: _curdir + 'view/layout.html'
									   , controller		: APP+'.AppController'
									   , controllerAs	: 'app'
									   , resolve		: makeAppResolve(APP)   
									  }
		
				  , 'top@app' 		   : {templateUrl : _curdir + 'module/nav/nav.html'}
//				  , 'center'	: 
				  , 'center.right@app' : {templateUrl : _curdir + 'view/sideLayout.html'}
				  , 'bottom@app' 	   : {templateUrl : _curdir + 'view/footer.html'}
				  , 'part@app' 		   : {templateUrl : _curdir + 'view/part/login.html'}
				}
		})
		
		// --------------------  app.user
		$stateProvider
		.state(APP+'.user' 
		,{
		      url 	: '/user'
		    , views	:
		      {
		    	  'center@app' : 
		    	  {
		    		  templateUrl : _curdir + 'view/user/detail.html'
		    		, controller  : 
		    		  [
    		                 '$scope'
    		                ,'$state'
    		                , function ($scope, $state) {
    		                	var loginUser = $scope.loginUser
    		                	if(!loginUser || !(loginUser.isLogin)) $state.go('app.blogBoard.list')
    		                }
		    		  ]  
		    	  }
		      }	
		})
	}
//////////////////
	//TODO: 확인해야함. resolve에서 만들어지는 서비스형태의객체와 프로바이더는 
	//	일시적(컨트롤러생성시) 인 것이 맞는지. 
	//	일단..포함 컨틀롤러에서는 접근이 안되는것보니 맞는듯 하기도.
	function makeAppResolve(appName) {
		var result = {}
		
		result.loginUser = [  appName+'.userService'
				       , appName+'.storage'
				       , function (userService, storage) {
							//최초 호출 user관련 데이터 초기화
							var annoyUser = userService.getAnnoymousUser()
							storage.setLoginUser(annoyUser);
							
							var p = userService.getLoginUser()
											   .then(function(user){
												   return user
											   })
											   .catch(function(err){
												   console.error(error)
											   })
							return p;
			    	  }]
		
		//---
		return result;
    }
	
})(define)