/**
 * 
 */

var expect = chai.expect;

var log = window.log
var ajax = window._ajax

describe('ajax', function () {
	it('should exist getXmlHttpObject', function () {
		expect(ajax.getXmlHttpObject() ? true : false).to.be.equal(true);
	})
	it('should send ', function (nextTest) {
		ajax.send(onSuccess,onErr, 'D:/java/_Workspace/work4node/NodeBlog/resources/js/test/run.html')
		function onSuccess() {
			log(arguments);
			nextTest();
		}
		function onErr() {
			log(arguments);
			nextTest();
		}
		
	})
	
	
});