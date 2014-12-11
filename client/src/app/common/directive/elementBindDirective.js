/**
 *   # Why
 *    - 엘리먼트를 직접적으로 조작 하기위한 쉬운 방법이 필요.
 *      ; id로 찾아서 사용하지 않고. 앙귤러를 이용하겠다.
 *     
 *   # What
 *    - 엘리먼트 참조를 현재 스코프에 이름으로 할당. 
 *   
 *   # How to use
 *    
 *     <textArea common-element-bind to="textarea" context="ctrl.elements">
 *     .....
 *     </textArea>
 *  
 *     <button ng-click="answerCtrl.insert(answer, textarea)"  .....
 *    
 *    // 실제 사용시 주의 해당 객체에 { el: element } 담겨서 전달됨.  
 *  		this.insert = function (answer, textarea) {
 *			answer.content = this.elements[textarea].val()
 *    
 *   # 문제 
 *    - Error: [$parse:isecdom] Referencing DOM nodes in Angular expressions is disallowed!
 *     : 표현식으로 엘리먼트에 직접 접근하면 에러생김.
 *     => {el: $element}.... 간접접근으로 바꿈. 혹시 attr등도 전달할수도있으니..
 *     => 다시.. 컨트롤러의 elements에서 문자열을 키로 사용하는것으로 변경. 
 *  
 *   # 참고 - inputDirective
 */
(function(define, _){
	define([], function() {
		return ['common.util', makeDirective];
	})
	
	function makeDirective(U) {
		var elementBindDirective = {}
		
		elementBindDirective.restrict  	= 'A';   	 //속성
		elementBindDirective.require    = ['?to'];
		elementBindDirective.scope		= {
												 to : '@'
										  , context : '='
										  }
		
		elementBindDirective.link = {
			pre : function _preLink ($scope, $element, $attr, ctrl) {
				var to 		= $attr.to
				var context = $scope.context ? $scope.context : $scope.$parent 
				
				if(U.notExist(to)) return console.error('element-bind : not exist "to" attr ')
//			    if(U.exist(context[to])) return console.error('already exist value')
			    
			    context[to] = $element
			} 	
		} 
		
		
		
		//------------------------------------
		return elementBindDirective ;
	}
	
	
})(define, _)