/**
 * 
 */



describe('htmlLoger', function () {
	var utilPackage = $$namespace.package('com.kang').package('util')
	  , log = utilPackage.import('log')
	  , errLog = utilPackage.import('errLog');
	
	// array일 경우 풀림. jquery내용물과 htmlElement를 해석하기 위해 풀어야함.
	//이정도면 됨.
	it('should run nomal #log()', function () {
//		log('adsdsf');
//		log(234234423, [2,3,4,5,6]);
//		log({a:3,b:{c:'wefwef', d:[234234,{f:666}]} });
//		log([2,3,4,5]);
//		log('adsdsf');
	})
	it('should run nomal #log()', function () {
//		errLog('wefwefwfadsdsf');
	})
	it('should run debug mode', function () {
		
	})
})