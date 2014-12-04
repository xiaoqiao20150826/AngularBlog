/**
 */

(function(define) {
	define([], function () {
		return [	'$stateProvider', '$urlRouterProvider', setupState]
			   
   })
   
   function setupState(   $stateProvider ,  $urlRouterProvider) {
		var $window = window
		
		var _appdir     = '/resource/src/app/'
		  , _libdir	    = '/resource/lib/'
		  , _curdir 	= _appdir + 'module/blogBoard/'
		  , BLOG_BOARD 	= 'app.blogBoard'
		
		// ---- list	  
		$stateProvider
		.state(BLOG_BOARD, { 
			url   		 : '/blog'    //   url: / + ''
		  , abstract 	 : true
		})
		.state(BLOG_BOARD+'.list', { 
				url   : '?pageNum&sorter&categoryId&searcher'
			  , views : {
				  // @(빈)는 app state에 포함된 템플릿의 바탕이 되는 index.html..(서버에서 가져온것) 을 의미함.
				  'center.left@app' : {
					  			templateUrl   : _curdir + 'view/list/layout.html'
					  		  , controller    : BLOG_BOARD+'.ListController as list'
					  		  , resolve		  : {
				  			  					listData : [  BLOG_BOARD+'.blogBoardDAO'
				  			  					            , '$stateParams'
				  			  					            ,function (blogBoardDAO, $stateParams) {
					  			  								return blogBoardDAO.getListData($stateParams)
					  			  				            }]
		
					  			  				 }
					  		  }
				, 'tab@app.blogBoard.list' 		: {templateUrl : _curdir + 'view/list/tab.html'}
				, 'postList@app.blogBoard.list' : {templateUrl : _curdir + 'view/list/postList.html'}
				, 'pager@app.blogBoard.list' 	: {templateUrl : _curdir + 'view/list/pager.html'}
			}
		})
		// -------- upsert
		var upsertViews =
		{
			'center@app' : 
			{
		 		   templateUrl 	: _curdir + 'view/upsert/layout.html'
		 		 , controller	: BLOG_BOARD + '.UpsertController as upsert'
		 		,  resolve 	: 
			    {
			    	post : 
			    	[ 
			    	  '$stateParams', BLOG_BOARD+'.blogBoardDAO'
				      ,function($stateParams, blogBoardDAO) {
			    		  if(!$stateParams.postNum) return null;
			    		  else return blogBoardDAO.getPost($stateParams.postNum);
				    }]
			    }  
		 		 
		  	}
		  , 'categorySelector@app.blogBoard.insert' : { templateUrl : _appdir + 'view/part/categorySelector.html'	}
		  , 'categorySelector@app.blogBoard.update' : { templateUrl : _appdir + 'view/part/categorySelector.html'	}
		  , 'editor@app.blogBoard.insert' : { templateUrl : _libdir + 'editor/editor.html'	
			  								, controller  : BLOG_BOARD + '.EditorController as upsert'
			  								}
		  , 'editor@app.blogBoard.update' : { templateUrl : _libdir + 'editor/editor.html'
			  								, controller  : BLOG_BOARD + '.EditorController as upsert'
		  									}
				
		}
		
		// 파라미터있는경우 없는경우로 구분.
		$stateProvider
		.state(BLOG_BOARD+'.insert', {
			views : upsertViews
		  , url   : '/insert'
		  , auth  : true	
		})
		$stateProvider
		.state(BLOG_BOARD+'.update', {
			views : upsertViews
		  , url	  : '/update/:postNum/:writerId'	
		  , writer: true
		})

		
		// -------- detail
		
		var detailViews =
		{
			'center.left@app' : 
			{
		 		  templateUrl 	: _curdir + 'view/detail/layout.html'
			    , controller	: BLOG_BOARD + '.DetailController as detail'
			    , resolve 	: 
			    {
			    	detailData : 
			    	[ 
			    	  '$stateParams', BLOG_BOARD+'.blogBoardDAO'
				      ,function($stateParams, blogBoardDAO) {
				    	  return blogBoardDAO.getDetailData($stateParams)
				    }]
				  
			    }  
		  	}
		  , 'postDetail@app.blogBoard.detail' 	: {templateUrl : _curdir + 'view/detail/postDetail.html'}
		  , 'postDetail@app.blogBoard.detailEx' : {templateUrl : _curdir + 'view/detail/postDetail.html'}
		  , 'answerList@app.blogBoard.detail' 	: {templateUrl : _curdir + 'view/detail/answer/layout.html'}
		  , 'answerList@app.blogBoard.detailEx' : {templateUrl : _curdir + 'view/detail/answer/layout.html'}
		}
		// [0-9]가 숫자는 맞는데.. 자릿수 표시안하면 기본 한자리 ㅡㅡ 그래서 transionTo가 동작안했던거.
		// detailEx는 title을 보여주기 위한것.
		$stateProvider
		.state(BLOG_BOARD+'.detail' 
		,{
			url : '/{postNum:[0-9]*}'		
		  , views : detailViews	
		})
		.state(BLOG_BOARD+'.detailEx' 
		,{
			url : '/{postNum:[0-9]*}/:title'
//		  , params : {
//			  			title: {
//			  					 decode : function(title) {
//			  						 console.log('de',title)
//			  						 return $window.decodeURI(title)
//			  					 }
//							    ,encode : function(title) {
//			  						 console.log('en',title)
//			  						 return $window.decodeURI(title)							    	 
//							     }
//			  				   }
//		  			 }		
		  , views : detailViews	
		})

		
/////setupState:End		
	}
})(define)