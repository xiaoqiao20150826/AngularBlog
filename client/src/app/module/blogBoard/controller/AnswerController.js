/**
 * 
 */

(function(define, _, angular) {
	
	define([], function() {
		return [  '$scope'
		        , '$sce'
		        , '$compile'
		        , '$state'
		        , '$stateParams'
		        
		        , 'common.util'
		        , 'common.Tree'
		        , 'app.blogBoard.answerDAO'
		        , 'rootOfAnswer'
		        , AnswerController];
	})
	
	function AnswerController( $scope, $sce, $compile, $state, $stateParams
		                      ,U ,Tree ,answerDAO ,rootOfAnswer) {
		$scope.trustAsHtml = $sce.trustAsHtml
		
		// data 관련은 이쪽에.. 바로사용할수있도록.
		var $root   	= $scope.$root
		  , $parent 	= $scope.$parent;
		var answerCtrl  = this; 
		
		var post 	= $parent.post  
		  , postNum = post.num;
		
		$scope.rootOfAnswer = rootOfAnswer //
		var answerTree 			= new Tree(rootOfAnswer, 'answers', 'num')
		//댓글 기본 값
		$scope.answer  	  	= { answerNum:0, userId : $root.currentUser._id , postNum:postNum, content : ""}; 

//		console.log(rootOfAnswer)
		/***
		 *    CRUD.. view 포함.
		 */
		
		// 전달된 answer 정보를 이용하여 새로운 upsertView를 만들고 토글(없으면추가)함.
		answerCtrl.upsertView; 	   // view에서 할당된 엘리먼트. clone해서 사용하기 위함.
		answerCtrl.nestedLocs = {} // upsertView를 위한 장소.
		answerCtrl.rows 	  = {} // row.업데이트시..
		var clonedUpsertView;
		
		answerCtrl.toggleNestedUpsertView = function (answer, isInsert) {
			
			
			var upsertView  = clonedUpsertView ? clonedUpsertView : answerCtrl.upsertView.clone()
			  , nestedLoc   = answerCtrl.nestedLocs[answer.num || answer.answerNum]
			  , row   		= answerCtrl.rows[answer.num  || answer.answerNum];
			
			if(_isCancle(nestedLoc)) { return _doCancle(nestedLoc, row, isInsert)}
			
			var newScope    = $scope.$new()
			  , newAnswer   = _.clone(answer);
			
			if(isInsert) _answerToInsert(newAnswer) //insert일때만 변해.
			else		 _answerToUpdate(newAnswer, row)
			
			newScope.answer = newAnswer
				
				nestedLoc.html(upsertView)
				$compile(upsertView)(newScope)
			
			function _answerToInsert (answer) {
				answer.answerNum = answer.num;
				answer.userId    = $root.currentUser._id;
				answer.content   =  '';
				answer.writer    =  '';
				answer.num  	 =  null;
				answer.created	 =  null
				answer._id  = null; // insert시 에러나고 사용도안하니.
				answer.user  = null; // insert시 에러나고 사용도안하니.
			}
			function _answerToUpdate(answer , row) {
				row.hide()
				var text = answer.content;
				answer.content = text.replace(/<br>/gi,'\r\n')
									 .replace(/<br>/gi,'\n')
									 .replace(/&nbsp;/gi,' ');
			}
			//취소해야되는지.
			function _isCancle(nestedLoc) {
				if(!nestedLoc) return true; // 최상단.
				if(nestedLoc.children().length > 0) return true;
				else return false;
			}
			function _doCancle(nestedLoc, row) {
				if(nestedLoc) nestedLoc.html("")
				if(row) row.show()
			}
		}
		
		answerCtrl.upsert = function (originAnswer) {
			var answer = _.clone(originAnswer)          //잠깐보이는.. replace바뀌는 내용이 걸리적.
			var isInsert = answer.num ? false : true
					
			var text     = answer.content
			if(_.isEmpty(text)) return alert('content not exist');
			if(!$root.currentUser.isLogin) {
				if(_.isEmpty(answer.writer)) return alert('writer not exist')
				if(_.isEmpty(answer.password)) return alert('password not exist')
			}
			answer.content = text.replace(/\r\n/gi,'<br>')
								 .replace(/\n/gi,'<br>')
								 .replace(/[ ]/gi,'&nbsp;');
			
			if(isInsert) {
				answerDAO.insert(answer)
				.then(function(insertedAnswer) {
					alert('insert')
					var parentNode = answerTree.first(answer.answerNum) //부모
					
					insertedAnswer.user = _.clone($root.currentUser)
					answerTree.addChild(parentNode, insertedAnswer)
					
					//초기화
					originAnswer.content  = ""; 
					originAnswer.password = "";
					answerCtrl.toggleNestedUpsertView(originAnswer);
				})
			} else {
				answerDAO.update(answer)
						 .then(function(message) {
							 alert(message)
							 var answerNode = answerTree.first(answer.num)
							 
							 answerNode.content = answer.content
							 answerNode.writer  = answer.writer
							 answerCtrl.toggleNestedUpsertView(answer);
						 })
			}
					 
		}
		//delete
		var deletedContent = "<span bgcolor='grey'>삭제된 댓글 입니다.</span>"
		answerCtrl.delete = function (answer) {
			var isYes = confirm('Do you realy want to delete?')
			if(!isYes) return;
			if(!_.isEmpty(answer.writer)) {answer.password = prompt('input password')}
			
			
			answerDAO.delete(answer)
					 .then(function(message) {
						 alert(message)
//						$state.transitionTo($state.current, $stateParams, { reload: true, inherit: true, notify: true });
						 //TODO: detail을 불러올필요는없는데말이야.....으
						 //      부분적으로 새로고침을 하고싶은데. 어찌해야할지를 모르겠네.
						 //      그러면 upsert부분도..새로고침으로 바꾸고말이야.
						 $state.transitionTo('app.blogBoard.detailEx', $stateParams, { reload: true, inherit: false, notify: true });
//						return $state.transitionTo('app.blogBoard.detail', null, { reload: true});
//						 if(_.isEmpty(answer.answers)) return answerTree.drop(answer.num)
//						 else answer.content = deletedContent;
						   
					 })
		}
		//etc
	}
	
	
	
})(define, _, angular)