/**
 */

(function(define) {
	define([], function () {
		return [	'$stateProvider', '$urlRouterProvider', setupState]
			   
   })
   
   function setupState(   $stateProvider ,  $urlRouterProvider) {
		var _appdir    = '/resource/src/app/'
		  , _curdir 	= _appdir + 'module/blogBoard/'
		  , BLOG_BOARD 	= 'app.blogBoard'
		
		// ---- list	  
		$stateProvider
		.state(BLOG_BOARD, { 
			url   		 : '/blog'    //   url: / + ''
		  , abstract 	 : true
		})
		.state(BLOG_BOARD+'.list', { 
				url   : '?pageNum&sorter'
			  , views : {
				  // @(빈)는 app state에 포함된 템플릿의 바탕이 되는 index.html..(서버에서 가져온것) 을 의미함.
				  'center.left@app' : {
					  			templateUrl   : _curdir + 'view/list/layout.html'
					  		  , controller    : BLOG_BOARD+'.ListController'
					  		  , controllerAs  : 'blogBoardList'
					  		  , resolve		  : {
				  			  					listData : [  BLOG_BOARD+'.blogBoardService'
				  			  					            , '$stateParams'
				  			  					            ,function (blogBoardService, $stateParams) {
				  			  									console.log('list')
					  			  								return blogBoardService.getListData($stateParams)
					  			  				            }]
		
					  			  				 }
					  		  }
				, 'tab@app.blogBoard.list' 		: {templateUrl : _curdir + 'view/list/tab.html'}
				, 'postList@app.blogBoard.list' : {templateUrl : _curdir + 'view/list/postList.html'}
				, 'pager@app.blogBoard.list' 	: {templateUrl : _curdir + 'view/list/pager.html'}
			}
		})
		// -------- insert
		var insertViews =
		{
			'center@app' : 
			{
		 		  templateUrl 	: _curdir + 'view/insert/layout.html'
			    , controller	: BLOG_BOARD + '.InsertController'
			    , controllerAs	: 'blogBoardInsert'
		  	}
		  , 'category@app.blogBoard.insert' :
		    { 	   templateUrl : _appdir + 'view/part/categorySelector.html'	}
		}
		
		$stateProvider
		.state(BLOG_BOARD+'.insert', {
			views : insertViews
		})
		
		// -------- detail
		
		var detailViews =
		{
			'center.left@app' : 
			{
		 		  templateUrl 	: _curdir + 'view/detail/layout.html'
			    , controller	: BLOG_BOARD + '.DetailController'
			    , controllerAs	: 'blogBoardDetail'
			    , resolve 	: 
			    {
			    	detailData : 
			    	[ 
			    	  '$stateParams', BLOG_BOARD+'.blogBoardService'
				      ,function($stateParams, blogBoardService) {
				    	  return blogBoardService.getDetailData($stateParams)
				    }]
				  
			    }  
		  	}
		  , 'postDetail@app.blogBoard.detail' 	: {templateUrl : _curdir + 'view/detail/postDetail.html'}
		  , 'postDetail@app.blogBoard.detailEx' : {templateUrl : _curdir + 'view/detail/postDetail.html'}
		  , 'answerList@app.blogBoard.detail' 	: {templateUrl : _curdir + 'view/detail/answer/layout.html'}
		  , 'answerList@app.blogBoard.detailEx' : {templateUrl : _curdir + 'view/detail/answer/layout.html'}
		}
		// [0-9]가 숫자는 맞는데.. 자릿수 표시안하면 기본 한자리 ㅡㅡ 그래서 transionTo가 동작안했던거.
		$stateProvider
		.state(BLOG_BOARD+'.detail' 
		,{
			url : '/{postNum:[0-9]*}'		
		  , views : detailViews	
		})
		.state(BLOG_BOARD+'.detailEx' 
		,{
			url : '/{postNum:[0-9]*}/:title'
		  , views : detailViews	
		})

		
/////setupState:End		
	}
})(define)