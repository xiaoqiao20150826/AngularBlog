/**
 *  # 조금식 변경됨 사용방법이.
 * 
 *  # Why
 *   - select-option에 트리를 적용하고 싶다. 그런데 일반적인방식의 재귀(ng-include사용)은
 *   '포함'관계로 엘리먼트를 추가해준다. 말그대로 include해버림.
 *    그런데 option은 리스트 형태로 추가되고.. 내용만 트리구조가 되야 한다.
 *    하지만 ng-include에서 내용만 추가하면. span이 둘러쌓여짐. 
 *    그리고 ng-include에서 또다른 option엘리먼트를 추가하면 결국 내부로 포함되어진다.(트리구조가됨)
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
 *     - watch 설정에 따라 달라짐.. (비교도 참조, 깊게, 얉게)
 *      
 *   5) 엘리먼트. watch로 인한 변화는 어떻게 할것인가?
 *     - ng-repeat는 이전 노드의 상태를 잘관리해서 필요한 부분만 추가했네. 코멘트도 잘이용했고.
 *     
 *  
 *  # how to use
 *	<option common-tree-explorer 
 *						root  				= "$parent.rootOfCategory"  //참조 값 복사.
 *						children-key		= "categories"				//default children
 *						id-key			    = "id"						//default id
 *						node-name 			= "category"				//default node
 *						is-nested			= 'false'					//default true
 *				value = "{{category.id}}"		
 *	>
 *	{{U.repeatString('&nbsp;&nbsp;', $deep)}}
 *	{{category.title}}
 *	</option>
 *
 *   # 문제
 *    - watch로 root 수정 후 삽입시.
 *      1) 중간부분만 추가하고싶다. 그러나. 복잡해질 것이 분명함. 
 *      	=> 복잡하게 처리함;
 *      2) select와 같은넘 때문에. postLink시점에는 내부 엘리먼트가 없어야지.(즉 시작 주석없에야)
 *          => 우선순위 1000 으로 해결. 이시점에 truncate : element 로 인해 사라지는듯.
 *          
 *     
 *   # etc
 *     http://www.michaelbromley.co.uk/blog/260/writing-multi-element-directives-in-angularjs
//		1.3 이전의 -start , -end를 이걸로 해결하기 위함?
//		, multiElement: true
  
					// 이넘들은 무엇이지?
//				    , terminal: true
//				    , $$tlb: true 
 */

(function(define, angular, _){
	define([], function () {
		return ['common.Tree','common.util', makeDirective];
		
		function makeDirective(Tree, U) {
			var treeDirective = {}
			//1. 설정.
			treeDirective.restrict  	= 'A';   	//속성
			treeDirective.transclude	= 'element';//대상.
			
			//select같은 경우 이상한 자식 있을경우 에러가...그래서 지시자 해석시기를 늦춰야함.
			treeDirective.priority		= 1000; 
			treeDirective.scope			= {
										 	  root  	  : '='
										    , childrenKey : '@'		//default : children
										    , idKey 	  : '@'		//default : id
											, nodeName	  : '@'		//default : node
											, isNested	  : '@'		//default : true
										  };

			//2. 지시자 '태그' 컴파일 시점. 지시자 태그에 바인딩된 값들 확인
			//transclude	= 'element'; 설정으로 컴파일시 
			//  '그 위치에' 자동 생성된 코멘트가 $element이다.
			treeDirective.compile		= function($element, $attrs) {
				//기본 설정값.
				$attrs.nodeName   	= $attrs.nodeName	  				 || 'node'
				$attrs.childrenKey  = $attrs.childrenKey  				 || 'children'
				$attrs.idKey  		= $attrs.idKey  	  				 || 'id'
				$attrs.isNested  	= $attrs.isNested 					 || 'true'
				
				//컴파일 후 콜백.
				return _postLink
			};
			
			// 3. 설정 값을 이용한 실제 동작(엘리먼트 생성, 연결 및 watch 리스너 바인딩)
			function _postLink ($scope, $element, $attr, ctrl, $transclude) {
				var params 	           = {}
				params.$parentElement  = $element.parent();
				params.childrenKey     = $scope.childrenKey
				params.idKey	       = $scope.idKey
				params.nodeName        = $scope.nodeName
				params.isNested		   = U.stringToBoolean($scope.isNested)
				
				// dom에 추가/제거 되는 엘리먼트와 트리의 노드를 바인딩.
				// 노드의변화(watch)에 적합한 엘리먼트를 추가, 제거하기 위함.
				params.elementInfoMap	   = {} 
				
				params.$transclude	   = $transclude
				params.tree			   = new Tree($scope.root, params.childrenKey, params.idKey)
				
				params.tree.each(__insertElement2(params));

				var endComment   = document.createComment('end treeExplorer')
				params.$parentElement.append(endComment)
			}// end postLink
				
			//--- each helper
			//sied effect
			
			/***
			 * ㅡㅡ insertBefore/After 동작을 오해해서 한참 삽질했다...
			 * push처럼 동작하는 것이아니라. 직전위치로. 즉... unshift처럼 동작함 ㅡㅡ
			 * test 안하니... 동작 확인하는 것에 시간이...ㅡㅡ
			 */ 
			function __insertElement2(params) {
				var nodeName	   = params.nodeName
				  , idKey		   = params.idKey
				  , $transclude    = params.$transclude
				  , $parentElement = params.$parentElement
				  , isNested       = params.isNested
				  
				var elementInfoMap = params.elementInfoMap  || {}
				
				return function _treeEach(node, parentNode, deep, hasChild) {
		
					// 아래에서 사용되는 element는 jqlite객체임.
					// $clone이 가끔 'dom element'가 전달 되어 에러가남.
					$transclude(function ngRepeatTransclude($clone, scope) {
						$clone = angular.element($clone)
						
						__setScope(scope, nodeName, node, parentNode, deep, hasChild)
						__setNodeListener(scope, params)
						
						
						//처음은 $parentElement로 이후에는 ..elementInfoMap이용.
						var parentId			= parentNode ? parentNode[idKey] : null
						var parentElementInfo   = parentId   ? elementInfoMap[ parentId ] 
												  			 : {el : $parentElement, nextLoc : 0 , parentEl : null}
						var parentElement 		= parentElementInfo.el 
						  , parentNextLoc		= parentElementInfo.nextLoc; 
								 			      	  
						// nextLoc, parentEl은 appendFlatten에서 사용. //
						// 현재엘리먼트에 대해서..
						elementInfoMap[ node[idKey] ] 	= { el : $clone
								                          , nextLoc : 0
								                          , parentEl : parentElement
								                          , parentId : parentId     //삭제위해.
								                          }

						
						// 이건 루트의 루트를(null)위한 초기 공통 동작.						
						if(!parentNode) { 
							__appendNested($clone, parentElement)
						}
						else {
							if(isNested) __appendNested($clone, parentElement); 
							else 		 __appendFlatten($clone, parentElement, parentNextLoc);							
						}
						
						//현재 엘리먼트 삽입 후 현재에대한 모든 부모의 nextLoc 증가. 
						return ___varyNextLoc(elementInfoMap, parentElementInfo, idKey, true)						
					})
				}
			};
			
			function __appendNested(element, parentElement) {
//				console.log('Nested');
				return element.appendTo(parentElement) ; 
			}
			
			function __appendFlatten(element, parentElement, parentNextLoc) {
//				console.log('Flatten')
				var currentElement = parentElement 
				// 이건 부모에대한 자식의 index만큼 이동시킨 후 삽입해야 올바른 위치로 감.
				if(currentElement.next().length != 0) {
					for(var i = 0; i< parentNextLoc; ++i) { //
						currentElement = currentElement.next()
					}
				}
				element.insertAfter(currentElement);
			}
			
			function __setScope(scope, nodeName, node, parentNode, deep, hasChild) {
				scope[nodeName] 	 = node
				scope['$parentNode'] = parentNode
				scope['$deep']		 = deep
				scope['$hasChild'] 	 = hasChild
			}
			
			//증감
			function ___varyNextLoc(elementInfoMap, parentElementInfo, idKey, isIncrease) {
				var parentEl = parentElementInfo.parentEl // 위에서 null을 최상위로 설정함.
				var variNum	 = isIncrease ? 1 : -1//변동값
				
				while(U.exist(parentEl) && U.exist(parentElementInfo)) {
					parentElementInfo.nextLoc = parentElementInfo.nextLoc + variNum;
//					console.log('current parent loc',parentElementInfo.nextLoc)		
					
					parentElementInfo = elementInfoMap[ parentElementInfo.parentId ]
					parentEL		  = parentElementInfo ? parentElementInfo.parentEl : null
				}
			}
			//scope의 모델의 변화에 대해. 뷰를 업데이트하는 로직.
			function __setNodeListener(scope, params) {
				var elementInfoMap   = params.elementInfoMap
				var tree		 = params.tree
				  , nodeName	 = params.nodeName
				  , childrenKey	 = params.childrenKey
				  , idKey		 = params.idKey
				  
				// update는 자동 반영되니..현재는 create, delete만 신경씀.  
				scope.$watchCollection(___watchExp, function ngRepeatAction(newChilds, oldChilds) {
					var newChildsCount  = newChilds.length
					  , oldChildsCount  = oldChilds.length 
					
					if(___isInserted(newChildsCount, oldChildsCount)) {
						var node = ___difOneOnLists(newChilds, oldChilds)
						tree.eachOne(node[idKey], __insertElement2(params))
					}
					
					if(___isDeleted(newChildsCount, oldChildsCount)) {
						var node 		  	  = ___difOneOnLists(newChilds, oldChilds)
						  , elementInfo   	  = elementInfoMap[ node[idKey] ]
						  , parentId		  = elementInfo.parentId 
						  , parentElementInfo = elementInfoMap[ parentId ]
						  
						if(U.notExist(parentElementInfo)) return console.error('some...err')
						
						elementInfo.el.remove()
						___varyNextLoc(elementInfoMap, parentElementInfo, idKey, false)
					}
//					console.log('watch')
					
				}, false)//얉은 비교.
				
				function ___watchExp(_scope) { //
					var node 	   	 = _scope[nodeName]
					  , childNodes   = node[childrenKey] || [];
					return childNodes;
				}
			};
			// watch helper ___
			//$digest 때 scope에서 oldvalue/newValue를 만드는 방법. 
			function ___isInserted(newCount, oldCount) {
				if(newCount > oldCount) return true
				else  return false
			}
			function ___isDeleted(newCount, oldCount) {
				if(newCount < oldCount) return true
				else  return false
			}
			
			//단순히 순차비교해서 같지 않으면 큰 리스트의 값을 반환
			function ___difOneOnLists(list1, list2) {
				var count1 = list1.length
				  , count2 = list2.length
				
				var bigger  = (count1 > count2) ? list1 : list2
				  , smaller = (count1 > count2) ? list2 : list1
			
				for(var i in bigger) {
					if(bigger[i] !== smaller[i]) return bigger[i] 
				}
				
				//이 위치에 도달하면안됨
				return console.error('treeDirective : watch diff err: ',list1, list2)
			}
			
			
			// -------------------------------------------------------------------
			// return
			return treeDirective;
		}	
		
	})
})(define, angular, _)

