/*
 *  # 무엇.
 *   비동기 함수의 인자로 전달되는 모든 callback을 대신하며, 그 것을 위한 편의 클래스
 *   
 *
 *  TODO: [warn] getCallback(), getDataFn() 둘 모두 템플릿타입 체크를 하고 있다.  
 *  TODO: [maybe] getCallback()을 조금 더 유연하게 만들 수 없을까? 리터럴을 타입클래스로?
 *        동적타입언어이므로.. 타입체크 기능을 넣고 직접 코딩해야 할 듯.
 */

var U = require('./util/util.js');

////////////////////////////////Done 클래스 정의 시작
var _NOMAL = 'nomalTemplate'
  , _ASYNC = 'asyncLoopTemplate';

/* 	# 생성자
 *    ## param 
 *     - dataFn(data) : callback의 결과 에러가 없을 때, 호출되는 함수. data의 처리.
 *     - errFn(err) : callback의 결과 에러가 있을 경우 호출되는 함수. err의 처리.
 *     - templateType : 어떤 템플릿의 callback함수를 가져올지 결정. 
 *    ## 호출형태
 *     - new Done(dataFn) : 이때, errFn, templateType은 기본값을 할당한다.
 */ 
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