/**
 */

(function(define) {
	define([], function () {
		return [	'$stateProvider', '$urlRouterProvider', setupState]
			   
   })
   function setupState(   $stateProvider ,  $urlRouterProvider) {
		var __rootUrl 	= '/resource/src/app/'
		  , BLOG_BOARD 	= 'app.blogBoard'
		
		$stateProvider
		.state(BLOG_BOARD, { 
			url   		 : '/blog'    //   url: / + ''
		  , abstract 	 : true
		})
		.state(BLOG_BOARD+'.list', { 
				url   : '?pageNum&sorter'      
			  , views : {
				  // @는 app state에 포함된 템플릿의 바탕이 되는 index.html..(서버에서 가져온것) 을 의미함.
				  'center@' : {
					  			templateUrl   : __rootUrl + 'module/blogBoard/view/list/index.html'
					  		  , controller    : BLOG_BOARD+'.ListController'
					  		  , controllerAs  : 'blogBoardList'
					  		  , resolve		  : {
				  			  					listData : [  BLOG_BOARD+'.blogBoardService'
				  			  					            , '$stateParams'
				  			  					            ,function (blogBoardService, $stateParams) {
//					  			  								console.log('resolve로 블로그리스트 데이터 가져온다', JSON.stringify($stateParams))
					  			  								return blogBoardService.getListData($stateParams)
					  			  				            }]
		
					  			  				 }
					  		  }
				, 'tab@app.blogBoard.list' 		: {templateUrl : __rootUrl + 'module/blogBoard/view/list/tab.html'}
				, 'postList@app.blogBoard.list' : {templateUrl : __rootUrl + 'module/blogBoard/view/list/postList.html'}
				, 'pager@app.blogBoard.list' 	: {templateUrl : __rootUrl + 'module/blogBoard/view/list/pager.html'}
			}
		})
		.state(BLOG_BOARD+'.detail', {
				url   : '/:pageNum/:title'
			  , views :	{
				  'center@' : {
					  			templateUrl 	: __rootUrl + 'module/blogBoard/view/detail/index.html'
					  		  , controller		: function() {console.log('sssss')}	
				  }
			  }	
									
		})
		
	}
})(define)