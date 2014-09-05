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
 *  TODO: 정식적인(Two Phase Commit등) 방법이 아니므로 서버 장애시 올바른 동작을 하지 못할 것이다.
 *          
 */

var H = require('../../../common/helper')
var Hooker = require('./Hooker')
  , CreateCancler = require('./createCancler')

var CREATE = 'create'
  , REMOVE = 'remove'
var mongoose = require('mongoose')
  , Model = mongoose.Model
  , originCreate = Model[CREATE]
  , originRemove = Model[REMOVE]
  
// 실제작업을하는 인스턴스
  
var Transaction = module.exports = function () {
	this.hooker = new Hooker(Model) //hook이름바꿔
	this.createCancler = new CreateCancler(originCreate, originRemove)
}
Transaction.prototype.start = function () {
	this.hooker.hook(CREATE, this.createCancler.hookFn())
}

Transaction.prototype.end = function () {
	this.hooker.end()
}

Transaction.prototype.rollback = function (done) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	
	this.createCancler.cancle(done)
}
