/**
 *   #역할
 *    - mongoose.Model의 create, update, delete를 임시적(트랜잭션 start, end동안) hook한다.
 *      그리고 필요시 롤백을 수행한다.
 *  
 *   # 원리
 *    1) mongoose의 model인스턴스는 Model의 인스턴스이다. 그리고 후킹가능.
 *    2) db 요청이 여럿이라 할지라도 요청의 시작과 끝의 수행은 동기적이다.
 *       다만, 응답의 콜백이 비동기적이다.
 *       즉, 트랜잭션의 시작과 끝의 범위에서 어떤 요청들이 수행되었는지 확인 가능하다.
 *     
 *   # 주의
 *     1) 종료시점에서 rollback이나 close하지 않는다면 후킹된 함수가 복귀되지 않는다.
 *     2) createCancler가 _id를 사용하므로 doc crud시 _id를 db에 저장 및 사용할 수  있어야 한다.
 *     3) start, end는 쌍으로 작업해야지 hook된 함수가 원상복귀된다.
 *       
 *  TODO: 정식적인(Two Phase Commit등) 방법이 아니므로 서버 장애시 올바른 동작을 하지 못할 것이다.
 *          
 */

var debug = require('debug')('nodeblog:dao:util:transaction')
var _ = require('underscore')

var Q = require('q')
var H = require('../../../common/helper')
var Status = require('../../../common/Status')
var Hooker = require('./Hooker')
  , CreateCancler = require('./CreateCancler')
  , UpdateCancler = require('./UpdateCancler')
  , RemoveCancler = require('./RemoveCancler')

var CREATE = 'create'
  , REMOVE = 'remove'
  , UPDATE = 'update'
  , FIND = 'find'
var mongoose = require('mongoose')
  , Model = mongoose.Model
  , originCreate = Model[CREATE]
  , originRemove = Model[REMOVE]
  , originFind = Model[FIND]
  , originUpdate = Model[UPDATE]
  
// 실제작업을하는 인스턴스
  
var Transaction = module.exports = function Transaction() {
	this.hooker = new Hooker(Model)
	this.orderedCancleList = []
	this.createCancler = new CreateCancler(this.orderedCancleList, originCreate, originRemove)
	this.updateCancler = new UpdateCancler(this.orderedCancleList, originUpdate, originFind)
	this.removeCancler = new RemoveCancler(this.orderedCancleList, originRemove, originFind, originCreate)
	
	this.calledEnd = false;
	this.calledStart = false;
	this.shouldBeRollback = false;
}


Transaction.prototype.atomic = function (method) {
	var self = this;
	if(!_.isFunction(method)) return console.error('transaction atomic scope should be method');
	self.start();
	
	var promise = method()
	if(!_.isFunction(promise.then)) return console.error('annoy method should return promise for atomic')
	
	//args는 method 내의 비동기 호출의 결과
	return	promise.then(function (args) {
				self.end()
				
				if(self.shouldBeRollback) {
					return self.doRollback()
							 .then(function (status) {
								 debug('transaction result ', status)
								 return status
							 })
							 .catch(function (err) { //트랜잭션 에러를 밖으로 보내고싶어.
								 debug('transacion err', err)
								 return err
							 })
				}
				
				return args
			})
}

Transaction.prototype.start = function () {
	if(this.calledStart) return;
	
	this.hooker.hook(CREATE, this.createCancler.hookFn())
	this.hooker.hook(UPDATE, this.updateCancler.hookFn())
	this.hooker.hook(REMOVE, this.removeCancler.hookFn())
	
	this.calledStart = true;
}


Transaction.prototype.end = function () {
	if(this.calledEnd) return;
	
	this.hooker.end()
	this.calledEnd = true;
}

// rollback 후 자동 end호출
Transaction.prototype.rollback = function () {
	this.shouldBeRollback = true;
}
Transaction.prototype.doRollback = function () {
	var deferred  = Q.defer()
//	
	var self = this
	if(!(self instanceof Transaction)) { return errFn('rollback have context that is transaction instance') }
	  
	var reverseOrderedCancleList = self.orderedCancleList.reverse()
	// 1) 캔슬할때는 역순으로 하나씩 호출되야한다. 그래야 올바르게 됨.
	// 2) 애초에 hook한 함수가 mongoose Model의 기본함수이므로 예외처리 한 것은 무용지물이됨(ex: 중복무시같은)
	
	var statuses = []
	_.reduce(reverseOrderedCancleList, function(p, cancleFn) {
		return p.then(function(status) {
			statuses.push(status)
			return cancleFn()
	})
	},Q())
	.then(function() { statuses.shift() })
    .then(function () {
    	debug('rollback status', statuses)
    	deferred.resolve(Status.reduceOne(statuses));
    })
   	.catch(function (err){
   		debug('rollback fail',err)
   		deferred.resolve(Status.makeError(err));
    })
	return deferred.promise
}
