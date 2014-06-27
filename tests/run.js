/**
 * 
 */
/*
 * 여기서 전부 실행하는 것으로하면 개별 테스트를 수행할수가 없다.
 * 자동화...현재위치를 기준으로 제외할것, 포함시킬것 모든 테스트를 require하기.
 * run은 없에야함.
 * 
 */

(function() {
	var testSuites = [
						require('./postTest.js')
					  , require('./answerTest.js')
					  , require('./pagerTest.js')
					  , require('./seqTest.js')
					  , require('./blogServiceTest.js')
	                 ];
	var RUN = 'run';
	function run() {
		for(var i in testSuites) {
			var testSuite = testSuites[i];
			if(!(testSuite[RUN])) throw 'not found run function';
			testSuite[RUN]();
		}
	}
	/* 실행 */
	run();
})();


