/*
 * 자동화... 그런데 이상해. 그냥 통과하네.
 * TODO: 1) 위치의 기준을 루트로 할 수는 없을까?
 * TODO: 2) 폴더의 모든 테스트를 실행(실행하지 않아야하는 것 제외)하는 형태로 업그레이드 할 수 없을까?
 * 
 */

process.env.NODE_ENV='test'

var testSuites = [
                  //단순히 결과값 실험해보는 것은 포함하지 않음.
                    './app/test/OuterModules/underscoreTest.js'
                  , './app/test/OuterModules/pathTest.js'
                  , './app/test/OuterModules/qTest.js'
                  , './app/test/OuterModules/supertestTest.js'
                  
                  ,'./app/test/testHelperTest.js'
                  
                  , './app/test/common/file/localFileTest.js'
                  
                  , './app/test/common/scriptletUtilTest.js'
                  , './app/test/common/utilTest.js'
                  , './app/test/common/pagerTest.js'
                  
                  , './app/test/dao/util/JoinerTest.js'
                  
                  , './app/test/dao/util/transaction/TransactionTest.js'   
                  , './app/test/dao/util/transaction/HookerTest.js'
//                  , './app/test/dao/util/transaction/CreateCanclerTest.js'  // Done제거후 확인안함
//                  , './app/test/dao/util/transaction/RemoveCanclerTest.js' // Done제거후 확인안함
//                  , './app/test/dao/util/transaction/UpdateCanclerTest.js' // Done제거후 확인안함
                  
                  , './app/test/dao/seqTest.js'
                  , './app/test/dao/postTest.js'
				  , './app/test/dao/answerTest.js'
				  , './app/test/dao/userTest.js'
				  , './app/test/dao/categoryTest.js'

				  , './app/test/controller/util/cookieTest.js'       
				  
				  , './app/test/service/blogBoardServiceTest.js'
				  , './app/test/service/answerServiceTest.js'
	             ]; 
//TODO: 나중에는 모카에서 제공하는 방법을 사용하자(지정된 폴더 실행 같은.)
(function() {
	for(var i in testSuites) {
		var val = testSuites[i];
			require(val);
	}
})();