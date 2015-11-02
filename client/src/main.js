/***
 * 	main
 * 
 */
(function(require){
	//1. start spinner
	var spinner = _spin();

	//2. require 사용시 기본 패스만 설정
	require.config({
				     'baseUrl' : "/resource/src/app"
	});
	
	//3. 여기서 초기 로딩에 필수인 앙귤러의 모듈을 미리 로드함. 단순히 성능향상 목적.
	//   requirejs가 재호출시 캐쉬를 이용하고 
	//   angular.module 등록은 별개로 해도 상관없기에 이렇게 함. 
	require(['app', 'module/nav/nav', 'module/blogBoard/blogBoard'])
	
	//4. bootstrap 후 필수 모듈 지연 등록.
	require(['../bootstrap'], function () {
		console.log('angular bootstrap...');
		spinner.stop();
	})	
	
	
	/// etc
	// 지금은 첫로딩에서만 간단히 사용함. ui-view에 할당했기에.. 템플릿 로딩되면 자동 없어짐.
	function _spin(){ 
		var Spinner = window.Spinner || console.error('not exist Spinner') 
		var opts = {
			  lines: 13, // The number of lines to draw
			  length: 20, // The length of each line
			  width: 10, // The line thickness
			  radius: 30, // The radius of the inner circle
			  corners: 1, // Corner roundness (0..1)
			  rotate: 0, // The rotation offset
			  direction: 1, // 1: clockwise, -1: counterclockwise
			  color: '#000', // #rgb or #rrggbb or array of colors
			  speed: 1, // Rounds per second
			  trail: 60, // Afterglow percentage
			  shadow: false, // Whether to render a shadow
			  hwaccel: false, // Whether to use hardware acceleration
			  className: 'spinner', // The CSS class to assign to the spinner
			  zIndex: 2e9, // The z-index (defaults to 2000000000)
			  top: '30%', // Top position relative to parent
			  left: '50%' // Left position relative to parent
			};
		var target = document.getElementById('spinner');
		var spinner = new Spinner(opts);
		spinner.spin(target);

		return spinner;
	}
	
})(require)	
