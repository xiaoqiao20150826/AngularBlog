var U = require('./util/util.js');

////////////////////////////////Done 클래스 정의 시작
var _NOMAL = 'nomalTemplate'
  , _ASYNC = 'asyncLoopTemplate';

// 		생성자
Done = module.exports = function Done(dataFn, errFn, templateType) {
	if(!dataFn) throw new Error('dataFn은 필수').stack;
	
	//private
	this._dataFn = dataFn;
	this._errFn = errFn || _defaultErrFn;
	this._templateType = templateType || _NOMAL;
}
Done.NOMAL = _NOMAL;
Done.ASYNC = _ASYNC;


// 기본 템플릿
Done.prototype.getCallback = function () {
	if(this._templateType == _NOMAL) return _nomalTemplate2(this._errFn, this._dataFn);
	if(this._templateType == _ASYNC) return _asyncLoopTemplate2(this._errFn, this._dataFn);
}

// 내부의 에러처리함수 호출 후 외부의 에러처리 함수 호출한다.
Done.prototype.addErrFn = function (newErrFn) {
	var prevErrFn = this._errFn;
	this._errFn = errFnWrap;
	function errFnWrap(err) {
		newErrFn(err);
		prevErrFn(err);
	}
}
// 새걸로 바꿔버림.
Done.prototype.setErrFn = function (newErrFn) {
	this._errFn = newErrFn;
}
Done.prototype.setTemplateType = function (type) {
	this._templateType = type;
}
Done.prototype.getErrFn = function () {
	return this._errFn;
};
Done.prototype.getDataFn = function () {
	if(this._templateType == _ASYNC) 
		return _asyncLoopDataFn1(this._dataFn); 
	else 
		return this._dataFn;
	
	
};
//private 
/////////////////////////////////////////////////
function _defaultErrFn(err) {
	throw new Error('default : '+err).stack;
}

//비동기 함수의 콜백형식을 간편히 하기 위해 구조와 호출될 함수를 정해놓는다.
//data가 0일 경우 if(0)을 회피하기위해 exist필요.
function _nomalTemplate2(errFn, dataFn) {
	return function __nomalTemplate(err, data) {
		
		if(U.exist(err)) return errFn(err);
		if(U.exist(dataFn)) {return dataFn(data);}
		console.trace('nomalTempalte : 아무처리도 않됨');
	};
};

//eachDone 은 asyncLoop에 있다. nomal과 비교해서 dataFn의 처리방식이 다름.
function _asyncLoopTemplate2(errFn, saveDataAndNextDo) {
	return function _asyncLoopTemplate(err,data) {
		if(U.exist(err)) return errFn(err)
		//err, data 저장 후 다음 비동기 함수 수행.
		if(U.exist(saveDataAndNextDo)) return saveDataAndNextDo(err,data);
		console.trace('asyncLoopTemplate : 아무처리도안됨');
	};
};
function _asyncLoopDataFn1(dataFn) {
	return function _asyncLoopDataFn(data) {
			return dataFn(null, data);
	}
}

////////////////////////////////Done 클래스 정의 끝