/**
 * 
 * 		https://github.com/angular-ui/ui-router/blob/master/test/viewDirectiveSpec.j
 *		이곳 내용으로 테스트함. 일부만.
 */

(function (define, angular, _) {
	
	define(['uiRouter'], function (uiRouter) {


		var eState = {
		    template: '<div ui-view="eview" class="eview"></div>'
		  },
		  fState = {
		    views: {
		      'eview': {
		        template: 'fState eview template'
		      }
		    }
		  },
		  gState = {
		    template: '<div ui-view="inner"><span>{{content}}</span></div>'
		  },
		  hState = {
		    views: {
		      'inner': {
		        template: 'hState inner template'
		      }
		    }
		  },
		  kState = {
		    controller: function() {
		      this.someProperty = "value"
		    },
		    controllerAs: "vm"
		  },
		  lState = {
		    views: {
		      view1: {
		        template: 'view1'
		      },
		      view2: {
		        template: 'view2'
		      },
		      view3: {
		        template: 'view3'
		      }
		    }
		  };
		
		
		describe('uiRouter$state', function () {
			var $compile, $rootScope 
			var elem, scope
			
			beforeEach(function () {
				angular.module('configHookModule', ['ui.router'])
				   	   .config(['$stateProvider', function ($stateProvider) {
					   	  $stateProvider
					   	  				//부모자식 상태.
							   	      .state('e', eState)
							   	      .state('e.f', fState)
							   	      .state('g', gState)
							   	      .state('g.h', hState)
							   	      
							   	      
							   	      .state('k', kState)
							   	      .state('l', lState)
				   	   }])
				angular.mock.module('configHookModule')
				angular.mock.inject(function($injector) {
					$compile = $injector.get('$compile')
					$rootScope = $injector.get('$rootScope')
					
					elem = angular.element('<div>')
					scope = $rootScope.$new();
				})
			})
			
			
			it('should run', function () {
				expect('hello').toEqual('hello')
			})
			//자식 상태로 이동시 부모상태 먼저 . 그다음 자식상태로.
		    it('should handle nested ui-views (testing two levels deep)', inject(function ($state) {
		        $compile(elem.append('<div><ui-view></ui-view></div>'))(scope);
		        expect(elem.find('ui-view').text()).toBe('');

		        $state.transitionTo(fState);
		        $rootScope.$apply();

		        expect(elem.find('ui-view').text()).toBe(fState.views.eview.template);
		    }));
			// 위에것에다가 , 이동후에 부모로 이동하면 자식 뷰는 비게됨..
		    it('initial view should be put back after removal of the view', inject(function ($state, $q) {
		        var content = 'inner content';
		        scope.content = content;
		        elem.append($compile('<div><ui-view></ui-view></div>')(scope));

		        $state.go(hState);
		        $rootScope.$apply();

		        expect(elem.find('ui-view').text()).toBe(hState.views.inner.template);

		        // going to the parent state which makes the inner view empty
		        $state.go(gState);
		        $rootScope.$apply();

		        expect(elem.find('ui-view').text()).toBe(content);
		      }));
			//컨트롤러 와 controller as 사용.
		    it('should instantiate a controller with controllerAs', inject(function($state, $q) {
		        elem.append($compile('<div><ui-view>{{vm.someProperty}}</ui-view></div>')(scope));
		        $state.transitionTo(kState);
		        $rootScope.$apply();

		        expect(elem.text()).toBe('value');
		   }));
		    // 스코프를 활용한 동적뷰지.
		      it ('should populate each view with content', inject(function($state, $q, $compile) {
		          elem.append($compile('<div><ui-view ng-repeat="view in views" name="{{view}}"></ui-view></div>')(scope));

		          $state.transitionTo(lState);
		          $rootScope.$apply();

		          expect(elem.find('ui-view').length).toBe(0);

		          scope.views = ['view1', 'view2'];

		          scope.$digest();

		          var uiViews = elem.find('ui-view');

		          expect(uiViews.eq(0).text()).toBe(lState.views.view1.template);
		          expect(uiViews.eq(1).text()).toBe(lState.views.view2.template);
		          expect(uiViews.eq(2).length).toBe(0);

		          scope.views.push('view3');
		          scope.$digest();

		          uiViews = elem.find('ui-view');

		          expect(uiViews.eq(0).text()).toBe(lState.views.view1.template);
		          expect(uiViews.eq(1).text()).toBe(lState.views.view2.template);
		          expect(uiViews.eq(2).text()).toBe(lState.views.view3.template);
		        }));
		})
		
	})
})(define, angular, _)
