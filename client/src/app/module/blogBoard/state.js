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
		  , resolve      :
			 {
				loadMyModlue: ['$ocLazyLoad', function($ocLazyLoad) {
		            return $ocLazyLoad.load('app.blogBoard');
		          }]
			 }
		 
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
			    		  if(_.isEmpty($stateParams.postNum)) return null //insert상황
			    		  return blogBoardDAO.getPost($stateParams.postNum);
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
		// TODO: 이부분... /postNum/title....  /postNum ...이걸 어찌구분해야할까나...
		var detailViews =
		{
			'center.left@app' : 
			{
		 		  templateUrl 	: _curdir + 'view/detail/layout.html'
			    , controller	: BLOG_BOARD + '.DetailController as detail'
			    , resolve 	: 
			    {
			    	post :  
			    	[ 
			    	  '$stateParams', BLOG_BOARD+'.blogBoardDAO'
				      ,function($stateParams, blogBoardDAO) {
			    		  return blogBoardDAO.getPostAndIncreaseReadCount($stateParams.postNum);
				    }]
				  
			    }  
		  	}
		  , 'postDetail@app.blogBoard.detail' 	: {templateUrl : _curdir + 'view/detail/postDetail.html'}
		  , 'postDetail@app.blogBoard.detailEx' : {templateUrl : _curdir + 'view/detail/postDetail.html'}
												   
		}
		// answer
		_.extend(detailViews, _getAnswerView('detail'))
		_.extend(detailViews, _getAnswerView('detailEx'))
		function _getAnswerView(detailName) {
			var detailView  = BLOG_BOARD +'.' +detailName
			  , answerView  = BLOG_BOARD +'.' +detailName // 이름주의.. ㅅㅂ
			  , answerViews = {};
			
			answerViews['answer@'+detailView] = 
			{templateUrl : _curdir + 'view/detail/answer/layout.html'
					,controller  : BLOG_BOARD + '.AnswerController as answerCtrl'
					, resolve	 : {
						rootOfAnswer : 
							[
							 '$stateParams'
							 ,BLOG_BOARD+'.answerDAO'
							 ,function($stateParams, answerDAO) {
								 var postNum = $stateParams.postNum
								 return answerDAO.getRootOfAnswer(postNum)
							 }]
					  }
			}
			answerViews['answerUpsert@'+answerView] = {templateUrl : _curdir + 'view/detail/answer/upsert.html'}
			answerViews['answerList@'+answerView]   = {templateUrl : _curdir + 'view/detail/answer/list.html'}
			return answerViews
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
		  , views : detailViews	
		})
		
		//  history
		$stateProvider
		.state(BLOG_BOARD+'.history' 
		,{
			url : '/history'		
		  , views : {
					  'center.left@app' : 
						{
					 		  templateUrl 	: _curdir + 'view/history.html'
						    , controller	: ['$scope','history', function($scope, history) {
						    						$scope.history = history;
						    				  }]
						    , resolve 	: 
						    {
						    	history : 
						    	[ 
						    	  BLOG_BOARD+'.blogBoardDAO'
							      ,function(blogBoardDAO) {
							    	  return blogBoardDAO.getHistory();
							    }]
							  
						    }  
					  	}
		  			}	
		})
		
		
		
/////setupState:End		
	}
})(define)