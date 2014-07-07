
/* test */

var should = require('should');
var mongoose = require('mongoose')
  , Q = require('q')
  , async = require('async')
  , _ = require('underscore');

var	H = require('../testhelper.js')
  , userDAO = require('../../dao/userDAO.js')
  , User = require('../../domain/User.js');

// test데이터를 삽입하고, eqaul비교 때 사용할 user의 프로퍼티 이름..
var keys4tempValue = ['_id','name','photo','email'];

//-------------------------------
describe('userDAO', function() {
	var _users;
	before(function(nextCase) {
		mongoose.connect('mongodb://localhost/test',function() {
			_insertTestData(nextCase);
		});
		
	});
	after(function(nextCase) {
		userDAO.removeAll(new H.Done(function() {
						mongoose.disconnect(function() {
							nextCase();
						})
		}));
	});
	beforeEach(function() {
		_users = _createTempUsers();
	});
	describe('User', function() {
		it('should create by vary models', function () {
			var passportData = {id : 'id' , name : 'name', photo : 'photo', email : 'email', provider : 'provider'}
			var dbData = {_id : 'id' , name : 'name', photo : 'photo', email : 'email'}
			var user1 = User.createBy(passportData);
			var user2 = User.createBy(dbData);
			should.equal(user1._id, passportData.id + '-' +passportData.provider);
			should.equal(user2._id, dbData._id);
		})
	});
	describe('#insertOne()', function() {
		it('should insert a user.',function (nextCase) {
			var passportData = {id : 'id' , name : 'name', photo : 'photo', email : 'email', provider : 'provider'}
			var a_user = User.createBy(passportData);
			userDAO.insertOne(new H.Done(dataFn, H.testCatch1(nextCase)), a_user);
			function dataFn(model) {
				var expecteduser = User.createBy(model);
					_equals(expecteduser, a_user);
					nextCase();
			};
		});
	});
	describe('#find()',function() {
		it('should take all users', function (nextCase) {
			userDAO.find(new H.Done(dataFn), {});
			function dataFn(models) {
				var e_users = User.createBy(models)
				_equals(e_users,_users.slice(0, e_users.length));
				nextCase();
			}
		});
		it('should take a user', function (nextCase) {
			var a_user = _users[2];
			userDAO.findById(new H.Done(dataFn, H.testCatch1(nextCase)), a_user._id);
			function dataFn(model) {
				var e_user = User.createBy(model);
				_equals(a_user, e_user);
				nextCase();
			}
		});
	});
	describe('$findOrCreate', function() {
		it('should take count with where', function(nextCase) {
			var passportData = {id : 'id999' , name : 'name999', photo : 'photo999', email : 'email', provider : 'provider'}
			var a_user = User.createBy(passportData);
			userDAO.findOrCreate(new H.Done(dataFn, H.testCatch1(nextCase)), a_user);
			function dataFn(model) {
				var e_user = User.createBy(model);
				_equals(a_user, e_user);
				nextCase();
			}
		});
	});
	describe('$getCount', function() {
		it('should take count with where', function(nextCase) {
			var where = {};
			userDAO.getCount(new H.Done(dataFn), where);
			function dataFn(model) {
				var a_count = _users.length +2; //테스트에서 추가로 2개 삽입했음
				var e_count = model;
				should.exist(model);
				should.equal(a_count,e_count);
				nextCase();
			}
		});
	});
	describe('#update', function() {
		it('should update',function(nextCase) {
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
					nextCase();
				}
			}
		});
	});
});
////////==== helper =====/////////
//현재는 title, content만 비교함.
function _equals(expectedusers, actualsusers) {
	H.deepEqualsByKeys(expectedusers, actualsusers, keys4tempValue);
};

function _createTempUsers() {
	var Type = User
	  , count = 10;
	return users = H.createObjsByType(Type, count, keys4tempValue);
}
function _insertTestData(nextCase) {
	H.asyncLoop(_createTempUsers(), [userDAO, userDAO.insertOne], new H.Done(nextDataFn, H.testCatch1(nextCase)));
	function nextDataFn(err, datas) {
		nextCase();
	}
};
