/**
 * #삭제예정.
 *  콜백전달할때 if-else문 때문에 지저분해져서 만듬.

 *  1) err면 throw err
 *  2) data가 있으면 hitCb 호출
 *  3) data가 없으면 failCb 호출
 */

// 전역변수
function defaultErrCb(err) {
	throw 'err : ' + err;
}
////////////
var cbSupporter = module.exports = {
		hitOrFail : function (hitCb, failCb, errCb) {
			return function (err, data) {
				if(err) {
					var errCallback = errCb || defaultErrCb;
					errCallback(err);
				}
				if(data !=null)
					hitCb(data);
				else
					failCb(data);
			};
		} 
}; 
