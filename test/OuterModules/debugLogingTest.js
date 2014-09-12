/**
 *  //실험용.
 */
var debug = require('debug');

describe('debugLoging', function () {
	it('should run', function () {
		var str =  'aaaaaaaaaaaaa'
		var array =  [1,'2222',[2,4],{a:'wef'}]
		var object =  {a:1, b:{c:[1,2,3,'str']}}
		
		// 1. 이건 카테고리! 문자열은 정확히 일치해야하는가?
		var testLog = debug('testLog:abc');		
		// 2. 이건 로그메시지. array와 object의 내부 값도 모두 보여주는구나.
		testLog('message : ', array);
		var testLog2= debug('testLog2');
		testLog2('message2 : ', object);
		
		//3 . 출력 시간도 나오지만 지금은 자세히 몰라도됨.
		 
	})
})