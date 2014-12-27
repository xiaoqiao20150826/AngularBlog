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
				       .otherwise('/');  	  //
				       
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
									  //최초 전역 데이터 초기화.
									  //currentUser, categories.
									  //$q.all로 전달되겠지?   
									   , resolve		: { 
										   					currentUser : 
										   						[
										   						 APP+'.authDAO'
										   						 ,function (authDAO) {
										   							return authDAO.getLoginUser()
										   						}]
														  , rootOfCategory : 
																[
																 APP+'.categoryDAO'
																 ,function (categoryDAO) {
																	 return categoryDAO.getRootOfCategory()
																 }]
									   					  } 
									  }
		
				  , 'top@app' 		   : {templateUrl : _curdir + 'module/nav/nav.html'
						  				 ,controller  : APP+'.nav.NavController as navCtrl'
										 }
				  , 'center.right@app' : {templateUrl : _curdir + 'view/sideLayout.html'
					  					 ,controller  : APP + '.SideController as side'
					  					 }
				  , 'bottom@app' 	   : {templateUrl : _curdir + 'view/footer.html'}
				  , 'part@app' 		   : {templateUrl : _curdir + 'view/part/login.html'}
				  //side
				  , 'center.right.categoryTreeView@app' : {
					  										templateUrl : _curdir + 'view/part/categoryTreeView.html'
					  								  	  }
				}
		})
		
		// --------------------  app.login
		$stateProvider
		.state(APP+'.login'
		,{
			url  : '/login'
		  , auth : true
		})
		
		// --------------------  app.admin
		$stateProvider
		.state(APP+'.admin'
		,{
			url  : '/admin'
		  , abstract : true
		})
		.state(APP+'.admin.detail'
		,{
			  url   : ''
//			, auth  : true
			, admin : true
			, views :
			{
				'center@app' : 
				{
					templateUrl : _curdir + 'view/admin/admin.html'
				  , controller 	: APP + '.AdminController as admin'
				} 
				,'category@app.admin.detail' :
				{
					templateUrl  : _curdir + 'view/admin/category.html' //adminCtrl로.
				  , controller   : APP + '.CategoryController as category'
				}
			    ,'categorySelector@app.admin.detail' :
				{
					templateUrl  : _curdir + 'view/part/categorySelector.html' //adminCtrl로.
				}
			}	
		})
		
				
		// --------------------  app.user
		var USER = APP +'.user'
		$stateProvider
		.state(USER 
		,{
		      url 			: '/user'
		    , abstract 		: true
		})
		.state(USER+'.detail' 
		,{
			   url 		: '/:userId'
			 , views	:
				{
					'center@app' : 
					{
						templateUrl : _curdir + 'view/user/detail.html'
					  , controller 	: APP + '.UserController as userCtrl'
					  , resolve		: {
						  				user : ['app.userDAO'
						  				       ,'$stateParams'
						  				       ,function (userDAO, $stateParams) {
//						  				    	   console.log($stateParams)
						  				    	   return userDAO.getUser($stateParams)
						  				    	   
						  				}]
					  				  }		
					}
				}	
		})
		.state(USER+'.update' 
	    ,{
			  	auth : true 
			  ,	views :
				{
					'center@app' : 
					{
						templateUrl  : _curdir + 'view/user/update.html'
					  , controller 	 : APP + '.UserController as userCtrl'
					  // 같은컨트롤러사용하니까 쓰던것은 없에야지.
					  , resolve		 :{user: function(){return null}} 
					}
				}	
		})
	}
})(define)