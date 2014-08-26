/*
 * 자동화... 그런데 이상해. 그냥 통과하네.
 * TODO: 1) 위치의 기준을 루트로 할 수는 없을까?
 * TODO: 2) 폴더의 모든 테스트를 실행(실행하지 않아야하는 것 제외)하는 형태로 업그레이드 할 수 없을까?
 * 
 */


var testSuites = [
                    './OuterModules/underscoreTest.js'
                  , './OuterModules/pathTest.js'
                  , './OuterModules/qTest.js'
                  , './OuterModules/supertestTest.js'
                  
                  ,'./testHelperTest.js'
                  
                  , './common/localFileTest.js'
                  , './common/asyncSuporterTest.js'
                  , './common/pagerTest.js'
                  , './common/DoneTest.js'
                  , './common/utilTest.js'
                  , './common/scriptletUtilTest.js'
                  
                  , './domain/JoinerTest.js'
                  
                  , './dao/seqTest.js'
                  , './dao/postTest.js'
				  , './dao/answerTest.js'
				  , './dao/userTest.js'
				  , './dao/categoryTest.js'

//				  , './routes/common/checkerTest.js' 사용안함
				  , './controller/util/requestParserTest.js'
				  , './controller/util/cookieTest.js'
				  
				  , './service/blogBoardServiceTest.js'
				  , './service/answerServiceTest.js'
	             ]; 
//TODO: 나중에는 모카에서 제공하는 방법을 사용하자(지정된 폴더 실행 같은.)
(function() {
	for(var i in testSuites) {
		var val = testSuites[i];
			require(val);
	}
})();