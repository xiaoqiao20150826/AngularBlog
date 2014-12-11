/**
 * 
 */

(function(define, _, angular) {
	
	define([], function() {
		return [  '$scope'
		        , '$sce'
		        , '$compile'
		        , 'common.util'
		        , 'common.Tree'
		        , 'app.blogBoard.answerDAO'
		        , 'rootOfAnswer'
		        , AnswerController];
	})
	
	function AnswerController($scope, $sce, $compile, U, Tree, answerDAO, rootOfAnswer) {
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
			  , nestedLoc   = answerCtrl.nestedLocs[answer.num]
			  , row   		= answerCtrl.rows[answer.num];
			
			if(_isCancle(nestedLoc)) { return _doCancle(nestedLoc, row, isInsert)}
			
			var newScope    = $scope.$new()
			  , newAnswer   = _.clone(answer);
			
			if(isInsert) _answerToInsert(newAnswer) //insert일때만 변해.
			else		 row.hide()				//update
			
			newScope.answer = newAnswer
				
				nestedLoc.html(upsertView)
				$compile(upsertView)(newScope)
			
			function _answerToInsert (answer) {
				answer.answerNum = answer.num;
				answer.num		 = null;
				answer.content   =  '';
			}
			//취소해야되는지.
			function _isCancle(nestedLoc) {
				if(nestedLoc.children().length > 0) return true;
				else return false;
			}
			function _doCancle(nestedLoc, row, isInsert) {
				nestedLoc.html("")
				//row toggle
				row.toggle()
			}
		}
		
		answerCtrl.upsert = function (answer) {
			var text     = answer.content
			if(_.isEmpty(text)) return alert('content not exist');
			if(!$root.currentUser.isLogin) {
				if(_.isEmpty(answer.writer)) return alert('writer not exist')
				if(_.isEmpty(answer.password)) return alert('password not exist')
			}
			
			answer.content = text.replace(/\r\n/gi,'<br>')
								 .replace(/\n/gi,'<br>')
								 .replace(/[ ]/gi,'&nbsp;');
			answerDAO.insert(answer)
					 .then(function(insertedAnswer) {
						 alert('insert')
						 insertedAnswer.user = _.clone($root.currentUser)
						 var parentNode = answerTree.first(answer.answerNum) //부모
						 
						 var nestedLocs = answerCtrl.nestedLocs[answer.answerNum]
						 if(nestedLocs) nestedLocs.html("")
						 answer.content = ""
							 
						 answerTree.addChild(parentNode, insertedAnswer)
					 })
					 
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
						 if(_.isEmpty(answer.answers)) return answerTree.drop(answer.num)
						 else answer.content = deletedContent;
						   
					 })
		}
		
		//etc
	}
	
	
	
})(define, _, angular)