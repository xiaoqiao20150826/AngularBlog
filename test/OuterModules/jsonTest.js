/**
 *  # 결과 특징
 *   - 메서드 무시
 *     : 객체안의 메서드는 키값까지 무시.
 *     : 배열안의 메서드는 null할당
 *   - 키 값이 객체라면
 *     : 같은 방식으로 만듬.
 */
describe('jsonTest',function() {
	it('test',function () {

		
		var fn = function fn() {}
		  , object = {a:1,b:2,c:3, fn2:fn} 
		  , object2 = {a:1,b:2,c:3, 'object':object} 
		  , array = [1,2,3,object2, fn, fn]
		  , target = {a:1,b:'ss', c:fn, d:object2, 'array':array}
		  
		var jsonString = JSON.stringify(target)
		console.log(jsonString)
		
		var jsonObject = JSON.parse(jsonString) 
		console.log(jsonObject)
	})
})