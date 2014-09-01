/*
 *  # 무엇.
 *   비동기 함수의 인자로 전달되는 모든 callback을 대신하며, 그 것을 위한 편의 클래스
 *   
 *
 *  TODO: [warn] getCallback(), getDataFn() 둘 모두 템플릿타입 체크를 하고 있다.  
 *  TODO: [maybe] getCallback()을 조금 더 유연하게 만들 수 없을까? 리터럴을 타입클래스로?
 *        동적타입언어이므로.. 타입체크 기능을 넣고 직접 코딩해야 할 듯.
 */

var U = require('./util/util.js')
  , _ = require('underscore');

////////////////////////////////Done 클래스 정의 시작
var _NOMAL = 'nomalTemplate'
  , _ASYNC = 'asyncTemplate';

/* 	# 생성자
 *    ## param 
 *     - dataFn(data) : callback의 결과 에러가 없을 때, 호출되는 함수. data의 처리.
 *     - errFn(err) : callback의 결과 에러가 있을 경우 호출되는 함수. err의 처리.
 *     - templateType : 어떤 템플릿의 callback함수를 가져올지 결정. 
 *    ## 호출형태
 *     - new Done(dataFn) : 이때, errFn, templateType은 기본값을 할당한다.
 */ 
var Done = module.exports = function Done(dataFn, errFn, templateType) {
	if(!dataFn) throw new Error('dataFn은 필수').stack;
	this._dataFn = dataFn;
	
	if((_.isString(errFn)) ) {
		this._errFn = _defaultErrFn;
		this._templateType = errFn;
	} else {
		this._errFn = errFn || _defaultErrFn;
		this._templateType = templateType || _NOMAL;
	}
	
}
Done.NOMAL = _NOMAL;
Done.ASYNC = _ASYNC;


Done.makeEmpty = function (errFn) {
	errFn = errFn || empty
	return new Done(empty, errFn);
	function empty() {}
}

Done.isDoneInstance = function (o) {
	if(!_.isObject(o)) throw new Error(o + 'is not object')
	
	if(o instanceof Done) return true
	else return false;
}

// 기본 템플릿
Done.prototype.getCallback = function () {
	if(this._templateType == _NOMAL) return _nomalTemplate2(this._errFn, this._dataFn);
	if(this._templateType == _ASYNC) return _asyncTemplate2(this._errFn, this._dataFn);
}
// 에러는 아니고 정상동작으로 리턴하여 다음 동작을 수행함.
Done.prototype.return = function () {
    var dataFn = this.getDataFn();
    dataFn.apply(null, arguments);
}
Done.prototype.next = function () { //이름이
	var dataFn = this.getDataFn();
	dataFn.apply(null, arguments);
}
//TODO: 이상해이상해.
// 연속호출. 새것 호출 후 이전 것 호출
Done.prototype.addErrFn = function (newErrFn) {
	var prevErrFn = this._errFn;
	this._errFn = errFnWrap;
	function errFnWrap(err) {
		newErrFn(err);
		prevErrFn(err);
	}
} 
// set
Done.prototype.setErrFn = function (newErrFn) {
	this._errFn = newErrFn;
}
Done.prototype.setDataFn = function (newDataFn) {
	this._dataFn = newDataFn;
}
Done.prototype.setTemplateType = function (type) {
	this._templateType = type;
}
// get
Done.prototype.getErrFn = function () {
	return this._errFn;
};
Done.prototype.getTemplateType = function () {
	return this._templateType;
};
Done.prototype.getDataFn = function () {
	if(this._templateType == _ASYNC) 
		return _asyncDataFn1(this._dataFn); 
	else 
		return this._dataFn;
	
};
// 이전버젼 
//Done.prototype.hook4dataFn = function (before, after) {
//	before = before || _.identity;
//	after = after || _.identity;
//	var center = this._dataFn;
//	
//	if(this._templateType == _ASYNC)
//		this._dataFn = _async;
//	else 
//		this._dataFn = _nomal;
//			
//	function _nomal(model) {
//		after(center(before(model)));
//	}
//	function _async(err, model) {
//		var result = before(model);
//		center(null, result);
//	}
//}
// dataFn을 위한 hook함수 추가. 계속 추가 가능. 
Done.prototype.hook4dataFn = function (hookFn) {
	var originDataFn = this._dataFn;
	
	if(this._templateType == _ASYNC)
		this._dataFn = _async;
	else 
		this._dataFn = _nomal;
			
	function _nomal(model) {
		return originDataFn(hookFn(model))
	}
	function _async(err, model) {
		return originDataFn(null, hookFn(model))
	} 
}


//private 
/////////////////////////////////////////////////
function _defaultErrFn(err) {
	return console.error('default catch '+ err)
}

/*
 * # 역할
 *  - 비동기 함수의 콜백형식을 간편히 하기 위해 구조와 호출될 함수를 정해놓는다.
 *  - 직접 dataFn을 만들어서 전달할 경우 사용
 *  
 * #param
 *   - errFn : function errFn(err)
 *   - dataFn : function dataFn(data); 
 */  
//
//data가 0일 경우 if(0)을 회피하기위해 exist필요.
function _nomalTemplate2(errFn, dataFn) {
	return function __nomalTemplate(err, data) {
		
		if(U.exist(err)) return errFn(err);
		if(U.exist(dataFn)) {return dataFn(data);}
		console.trace('nomalTempalte : 아무처리도 않됨');
	};
};

/*
 * # 역할
 *  - 비동기 함수의 콜백형식을 간편히 하기 위해 구조와 호출될 함수를 정해놓는다.
 *  - 주로 외부에서(async, passport...등) dataFn이 전달될 경우 사용된다.
 *  
 * #param
 *   - errFn : function errFn(err)
 *   - dataFn : function dataFn(err, data); 
 */    
function _asyncTemplate2(errFn, saveDataAndNextDo) {
	return function _asyncTemplate(err,data) {
		if(U.exist(err)) return errFn(err)
		//err, data 저장 후 다음 비동기 함수 수행.
		if(U.exist(saveDataAndNextDo)) return saveDataAndNextDo(err,data);
		console.trace('asyncTemplate : 아무처리도안됨');
	};
};
function _asyncDataFn1(dataFn) {
	return function _asyncDataFn(data) {
			return dataFn(null, data);
	}
}

////////////////////////////////Done 클래스 정의 끝