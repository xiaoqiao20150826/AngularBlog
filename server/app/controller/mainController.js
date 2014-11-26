
/* 초기화 및 클래스 변수 */

var debug = require('debug')('nodeblog:controller:main')
  
var User = require('../domain/User.js')

var mainController = module.exports = {}
/* 클라이언트의 요청을 컨트롤러에 전달한다.*/
mainController.mapUrlToResponse = function(app) {
		//TODO: 순서 주의. 두번째 arg가 string을 먼저 구분한뒤 숫자형을 받아야함..
		app.get('/', this.startApp);
		app.get('/blog', this.startApp);
		//navigation
		
		//test
		app.get('/cookie', _seeCookie);
		app.get('/test', _test);
		
}
mainController.startApp  = function (req, res) {
		return res.render('./src/main.html');
}
/*    helper   */

//test
function _test(req, res) {
	req.session.passport.user = User.getTester()
	res.redirect('/');
}
function _seeCookie(req, res) {
    res.send(req.headers);
}