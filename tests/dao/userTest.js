
/* test */

var should = require('should');
var mongoose = require('mongoose')
  , Q = require('q')
  , async = require('async')
  , _ = require('underscore');

var	H = require('../testhelper.js')
  , reqParser = require('../../routes/common/reqParser.js')
  , userDAO = require('../../dao/userDAO.js')
  , User = require('../../domain/User.js');

// test데이터를 삽입하고, eqaul비교 때 사용할 user의 프로퍼티 이름..
var _keys4tempValue = ['_id','password','name','photo','email'];

//-------------------------------
describe('userDAO', function() {
	var _users;
	before(function(nextTest) {
		//로그인한 정보가 지워지기 원하지 않아서 이것만 테스트 디비로.
		mongoose.connect('mongodb://localhost/test',function() {
			_insertTestData(nextTest);
		});
		
	});
	after(function(nextTest) {
		userDAO.removeAll(new H.Done(function() {
						mongoose.disconnect(function() {
							nextTest();
						})
		}));
	});
	beforeEach(function() {
		_users = _createTempUsers();
	});
	describe('User', function() {
		it('should create by vary models', function () {
			var passportData = {id : 'id' , name : 'name', photo : 'photo', email : 'email', provider : 'provider'}
			  , userInfo = reqParser.profileToUserInfo(passportData);
			var dbData = {_id : 'id' , name : 'name', photo : 'photo', email : 'email'}
			var user1 = User.createBy(userInfo);
			var user2 = User.createBy(dbData);
			should.equal(user1._id, passportData.id + '-' +passportData.provider);
			should.equal(user2._id, dbData._id);
		})
	});
	describe('#insertOne()', function() {
		it('should insert a user.',function (nextTest) {
			var passportData = {id : 'id' , name : 'name', photo : 'photo', email : 'email', provider : 'provider'}
			var a_user = User.createBy(passportData);
			userDAO.insertOne(new H.Done(dataFn, H.testCatch1(nextTest)), a_user);
			function dataFn(model) {
				var expecteduser = User.createBy(model);
					_equals(expecteduser, a_user);
					nextTest();
			};
		});
	});
	describe('#find()',function() {
		it('should take all users', function (nextTest) {
			userDAO.find(new H.Done(dataFn), {});
			function dataFn(models) {
				var e_users = User.createBy(models)
				_equals(e_users,_users.slice(0, e_users.length));
				nextTest();
			}
		});
		it('should take users by ids', function (nextTest) {
			var userIds = ['_id1','_id6'];
			userDAO.findByIds(new H.Done(dataFn), userIds);
			function dataFn(models) {
				should.equal(2, models.length)
				nextTest();
			}
		})
		it('should take a user', function (nextTest) {
			var a_user = _users[2];
			userDAO.findById(new H.Done(dataFn, H.testCatch1(nextTest)), a_user._id);
			function dataFn(model) {
				var e_user = User.createBy(model);
				_equals(a_user, e_user);
				nextTest();
			}
		});
	});
	describe('$findOrCreateByUser', function() {
		it('should take count with where', function(nextTest) {
			var passportData = {id : 'id999' , name : 'name999', photo : 'photo999', email : 'email', provider : 'provider'}
			var a_user = User.createBy(passportData);
			
			userDAO.findOrCreateByUser(new H.Done(dataFn, H.testCatch1(nextTest)), a_user);
			function dataFn(user) {
				_equals(a_user, user);
				nextTest();
			}
		});
	});
	describe('$getCount', function() {
		it('should take count with where', function(nextTest) {
			var where = {};
			userDAO.getCount(new H.Done(dataFn), where);
			function dataFn(model) {
				var a_count = _users.length +2; //테스트에서 추가로 2개 삽입했음
				var e_count = model;
				should.exist(model);
				should.equal(a_count,e_count);
				nextTest();
			}
		});
	});
	describe('#update', function() {
		it('should update',function(nextTest) {
			var num = 3 , success = 1
			 	,a_user = _users[num-1];
			a_user.email = 'update_email';
			
			userDAO.update(new H.Done(dataFn), a_user);
			function dataFn(bool) {
				should.equal(bool, success);
				userDAO.findById(new H.Done(dataFn2), a_user._id);
				function dataFn2(model) {
					var e_user = User.createBy(model);
					_equals(a_user, e_user);
					nextTest();
				}
			}
		});
	});
	
	//TODO:비밀번호 필요할때 다시볼것.
//	describe('#findByUser', function () {
//		it('should return user', function (nextTest) {
//			var user = _users[3];
//			userDAO.findByUser(new H.Done(dataFn, nextTest), user);
//			function dataFn(loginUser) {
////				console.log(loginUser.constructor.name)
////				console.log(typeof loginUser)
////				console.log(loginUser instanceof User)
//				_equals(loginUser, user);
//				nextTest();
//			}
//		})
//		it('should return err message about pw ', function (nextTest) {
//			var user = _users[3];
//			user.password = 'nnnnn';
//			userDAO.findByUser(new H.Done(dataFn, nextTest), user);
//			function dataFn(msg) {
////				console.log(msg);
//				should.equal(_.isString(msg), true);
//				nextTest();
//			}
//		})
//		it('should return err message about id', function (nextTest) {
//			var user = _users[3];
//			user._id = 'id123';
//			userDAO.findByUser(new H.Done(dataFn, nextTest), user);
//			function dataFn(msg) {
////				console.log(msg);
//				should.equal(_.isString(msg), true);
//				nextTest();
//			}
//		})
//	})
	
});
////////==== helper =====/////////
//현재는 title, content만 비교함.
function _equals(expectedusers, actualsusers, keys4tempValue) {
	keys4tempValue = keys4tempValue || ['_id','name','photo','email'];
	H.deepEqualsByKeys(expectedusers, actualsusers, keys4tempValue);
};

function _createTempUsers() {
	var Type = User
	  , count = 10;
	return users = H.createObjsByType(Type, count, _keys4tempValue);
}
function _insertTestData(nextTest) {
	H.asyncLoop(_createTempUsers(), [userDAO, userDAO.insertOne], new H.Done(nextDataFn, H.testCatch1(nextTest)));
	function nextDataFn(err, datas) {
		nextTest();
	}
};
