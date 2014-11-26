/**
 * controller들을 관리한다.

 * - 필요한 controller들을 로딩하고 정해진 매핑함수를 호출하는 역할.
 * :: controller는 요청에 대한 url과 서버의 응답을 연결해주는 책임을 갖는다.(스프링의 컨트롤러와같은)
 * - 필요한 공통의 참조를 전달.
 */

//1. controller 파일을 모두 가져와서 배열에 담는다.
var controllers = [
                   	require('./mainController.js')
                  
                  , require('./blogBoard/answerController.js')
                  , require('./blogBoard/blogBoardController.js')
                  , require('./blogBoard/categoryController.js')
                  , require('./blogBoard/fileController.js')
                  
                  , require('./user/userController.js')
                  , require('./user/authController.js')
                  
              ];

//2. 각 controller에 서버의 url과 controller 연결 책임을 위임.
//모든 controller는 mapUrlToResponse 함수를 가진다.
var controllerManager = module.exports =  {
		mapUrlToResponse : function (app) {
			for(var i=0, max = controllers.length; i<max; ++i) {
				var controller = controllers[i];
				controller.mapUrlToResponse(app);
			};
		}

//TODO:마지막에 매치되지 않는 url을 처리하는 로직만들것.
// 하나짜리..두개짜리..세개짜리..등등. 
// blog/:stringParam(\\w+)/:sfwef'/ 이거이용해서.
};

/////참조되는 공통기능. 필요시 분리.
