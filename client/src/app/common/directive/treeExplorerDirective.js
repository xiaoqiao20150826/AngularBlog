/**
 * 
 *  ############ 이거 중단.(11/20) 실패.
 * 
 *  # Why
 *   - select-option에 트리를 적용하고 싶다. 그런데 일반적인방식의 재귀(ng-include사용)은
 *   '포함'관계로 엘리먼트를 추가해준다. 말그대로 include해버림.
 *    그런데 option은 리스트 형태로 추가되고.. 내용만 트리구조 탐색이 되야 한다.
 *    하지만 ng-include에서 내용만 추가하면. span이 둘러쌓여짐. 
 *    그리고 ng-include에서 또다른 option엘리먼트를 추가하면 결국 내부로 포함되어진다.
 *    
 *    트리를 탐색할때, each와 같은 형태로 어떤 로직을 수행할 수 있고, 
 *    each의단계에서 html도 순차(혹은 포함)으로 삽입 할수있는 방법이 필요하다
 *   
 *  # what
 *    - 지시자. 트리를 탐색한다.(깊이우선탐색)
 *     	탐색의 각 노드에 대한 로직 추가와, 엘리먼트를 부모에 포함시키는 것이 가능하다.(ng-repeat처럼)
 *  
 *  # what to use(무엇을 사용할 수 있을까. : 분석 및 정리용)
 *  
 *    1) ng-repeat가 포함 엘리먼트를 어떡게 처리하는지. 그 방법을 이용. 
 *      * 포인트
 *        - 지시자의 컴파일 -> 링크까지 끝난시점에서는 아래의 목록만 남게됨. 
 *        <div class="ng-binding ng-scope">   // ngRepeat의 부모 엘리먼트
*			[1,2,3,4]						  // ngRepeat와 상관없던 본래 {{list}}표현식
*
*			<!-- ngRepeat: n in list -->	   // ngRepeat가 있던 자리.
*		  </div>
*
*        - 위를 보니. 페이지 컴파일단계각...
*           1) 지시자가 해석이 된다. (등록한 컴파일 링크 작업까지 완료)
*           2) 표현식( {{}}같은)이 위에서 순차적으로 해석된다.
*		      - 이때 rhs에 watch등록한 곳에서 정확히 콜백이 한번만 동작함.
*
*        - 결국 실제 ng-repeat 작업은 지시자해석때 등록했던 watch 콜백이 실행되면서 진행된다.
*        
*     1-1)
*      : $scope.$watchCollection(rhs, function ngRepeatAction(collection) {  // list와 값
*        - 이게  보통의 digest할때가 아니라 rhs가 변화된 후 digest해야 콜백이 반영된다. 
*        - 누가 트리거냐 // 그냥 한번은 호출되네?
*          1) 부모인 <h1 class="ng-binding ng-scope"> 이시점?
*            - 이게 독립스코프라서? 그런가 이시점에서 내부의 태그 다시 분석.
*              그러면서 콜백이 실행되고 아래 엘리먼트가 추가됨.
*			        <!-- end ngRepeat: n in list -->       
*						<div ng-repeat="n in list" ng-init="in='이건안에것'" class="ng-scope">
*							<h2>내부요소</h2>
*							<div class="ng-binding">이건 정적스코프. {{n}}</div>			
*						</div>
	*
	*         - 이때 여기에있는 ngRepeat를 다시 실행하지는 않는다.
	*           그리고 표현식{{}} 을 해석하면서.
	*         - 여기서 ng-scope가 붙었기에 올바르게 스코프로 n이 해석됨.
	*
*          2) <!-- ngRepeat: n in list --> 이 주석?
 *    
 *    1-2) 표현식. 지시자. 해석이.. 섞인다.
 *      : 표현식 실행하다가. ng-binding같은 것 만나면 그 엘리먼트의 포함된것에 대해 다시 지시자해석을하는듯
 *    
 *    2) 트리 탐색
 *      - 이건 스크립틀릿유틸. 로 만들어놓은 깊이우선탐색을 이용하자.
 *      
 *  # what to do
 *   1) 지시자 설정으로 (element) 현재 엘리먼트 제거
 *   2) 기준이될 코멘트 추가. // 지시자 추가시 자동 생성됨. end에서만 만들면 되겠군.
 *   3) truncate 이용하여 클론 추가 및 스코프 설정
 *   4) watch 등록 및 실행 부모노드 설정 확인하여 파이어되는지 확인.
 *  
 *  # how to use
 *     - html(static)
 *     <div>														//default nodeName :  'node'
 *     		<div tree-explorer root='root' childs-key="childeNodes" node-name="node">
 *     </div>
 *     
 *     - tree
 *       {name:node1, childeNodes:[....]}
 *     - result
 *     <div>
 *     	  <div>node1<div>
 *     	  <div>node2<div>
 *     	  <div>node3<div>
 *     <div>
 *     
 *  
 */

(function(define, angular, _){
	define([], function () {
		return ['common.TreeExplorer','common.util', makeDirective];
		
		function makeDirective(TreeExplorer, U) {
			return {
					  restrict   : 'A'
				    , transclude : 'element'	  
//				    , multiElement: true  // 이넘들은 무엇이지?
//				    , priority: 1000
//				    , terminal: true
//				    , $$tlb: true
					, scope	     : {
								 	  root        : '='
								    , childrenKey   : '@'		//default : children
								    , nodeName	  : '@'		//default : node
								    , hasComment  : '@'		//default : true	
								   }
					, compile	 : function ($element, $attrs) {
						//기본 설정값.
						$attrs.hasComment 	= $attrs.hasComment   || true; 
						$attrs.nodeName   	= $attrs.nodeName	  || 'node'
						$attrs.childrenKey  = $attrs.childrenKey  || 'children'
						
						//  지시자이기에 자동생성되는 코멘트가 $element이다.
						// transclude로 인해 코멘트만 남아있음.
						var $startComment   = $element 
						  , $eachEndComment = document.createComment(' end eachWork for tree')
						var $parentElement  = $element.parent();  
							
						return function postLink($scope, $element, $attr, ctrl, $transclude) {
							var hasComment 	  = U.stringToBoolean($scope.hasComment)
							
							var root 	   	  = $scope.root
							  , childrenKey  	  = $scope.childrenKey
							  , nodeName      = $scope.nodeName  || 'node'
							  , tree	      = new TreeExplorer(root, childrenKey)

							tree.each(eachWork);
							
							
							if(!hasComment) $startComment.remove()
							return;
							
							function eachWork(node, parentNode, deep, hasChild) {
								$scope.$watchCollection(root, function ngRepeatAction(tree) {
									$transclude(function ngRepeatTransclude($clone, scope) {
//										
										scope[nodeName] = node
										$parentElement.append($clone)
										
										if(hasComment) $parentElement.append($eachEndComment)
									})
								})
							}
							
						}
					}			
			}
		}
		
	})
})(define, angular, _)

