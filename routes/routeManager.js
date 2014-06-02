/**
 * route들을 관리한다.
 * - 필요한 route들을 로딩하고 정해진 매핑함수를 호출하는 역할.
 * :: route는 요청에 대한 url과 서버의 응답을 연결해주는 책임을 갖는다.(스프링의 컨트롤러와같은)
 */

//1. route 파일을 모두 가져와서 배열에 담는다.
var routes = [
              require('./blog.js'),
              require('./user.js'),
              require('./auth.js'),
              require('./test.js')
              ];

//2. 각 route에 url연결 책임을 위임.
var routeManager = module.exports =  {
		mapUrlToResponse : function (app) {
			for(var i=0, max = routes.length; i<max; ++i) {
				var route = routes[i];
				route.mapUrlToResponse(app);
			};
		}
};
	