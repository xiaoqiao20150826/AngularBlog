
/* test */

var should = require('should');
var mongoose = require('mongoose')
  , Q = require('q')
  , async = require('async')
  , _ = require('underscore');

var	H 			  = require('../testhelper.js')
  , userDAO 	  = require('../../dao/userDAO.js')
  , User 		  = require('../../domain/User.js')
  , oauthPassport = require('../../common/auth/oauth-passport.js');

// test데이터를 삽입하고, eqaul비교 때 사용할 user의 프로퍼티 이름..
//-------------------------------
describe('userDAO', function() {
	var users
	var insertedUsers
	
	before(function(nextTest) {
		mongoose.connect('mongodb://localhost/test',function() {
			//1.create users
			users = _.map(_.range(10),function(i) {
				return User.createBy({ _id:'_id'+i, password:'password'+i, name:'name'+i
									 , photo:'photo'+i, email:'email'+i})
			})
			
			//2. insert users
			insertedUsers = []
			_.reduce(users, function (memo, user){
				return memo.then(function(insertedUser) {
					insertedUsers.push(insertedUser)
					return userDAO.insertOne(user);
				})
			}, Q(1))
			.then(function () {
				insertedUsers.shift();
//				console.log(insertedUsers)
				nextTest()
			})
			.catch(H.testCatch1(nextTest))
		});
		
	});
	after(function(nextTest) {
		userDAO.removeAll().then(function() {
						mongoose.disconnect(function() {
							nextTest();
						})
		});
	});
	
	describe('oauthPassport', function() {
		it('should profile to user data', function () {
			var passportData = {_id : 'id' , name : 'name', photo : 'photo', email : 'email', provider : 'provider'}
			  , userInfo = oauthPassport.profileToUserData(passportData);
			var dbData = {_id : 'id' , name : 'name', photo : 'photo', email : 'email'}
			var user1 = User.createBy(userInfo);
			var user2 = User.createBy(dbData);
			should.equal(user1._id, passportData.id + '-' +passportData.provider);
			should.equal(user2._id, dbData._id);
		})
	});
	describe('#insertOne()', function() {
		it('should insert a user.',function (nextTest) {
			var passportData = {_id : 'id' , name : 'name', photo : 'photo', email : 'email', provider : 'provider'}
			var a_user = User.createBy(passportData);
			userDAO.insertOne(a_user)
			.then(function dataFn(_user) {
				should.equal(_user.id, a_user.id);
				nextTest();
			})
			.catch(H.testCatch1(nextTest))
		});
	});
	describe('#find()',function() {
		it('should take all users', function (nextTest) {
			userDAO.find({})
			.then(function dataFn(users) {
				should.equal(users[0].name, 'name0')
				should.equal(users[1].name, 'name1')
				nextTest();
			}).catch(H.testCatch1(nextTest))
		});
		it('should take users by ids', function (nextTest) {
			var userIds = ['_id1','_id6'];
			userDAO.findByIds(userIds)
			.then(function dataFn(users) {
				should.equal(2, users.length)
				nextTest();
			}).catch(H.testCatch1(nextTest))
		})
		it('should take a user', function (nextTest) {
			var a_user = users[2];
			userDAO.findById(a_user._id)
			.then(function dataFn(_user) {
				should.equal(a_user.id, _user.id);
				nextTest();
			}).catch(H.testCatch1(nextTest))
		});
	});
	
	describe('#findOrCreate', function() {
		it('should take count with where', function(nextTest) {
			var passportData = {_id : 'id999' , name : 'name999', photo : 'photo999', email : 'email', provider : 'provider'}
			var a_user = User.createBy(passportData);
			
			userDAO.findOrCreate(a_user)
			.then(function dataFn(user) {
				should.equal(a_user.id, user.id);
			})
			.then(function(){nextTest()})
			.catch(H.testCatch1(nextTest))
		});
	});
	describe('#getCount', function() {
		it('should take count with where', function(nextTest) {
			userDAO.getCount({})
			.then(function dataFn(count) {
				should.equal(count, 12);   //before에서 10개. 테스트케이스에서 2개넣었으니 12개
			})
			.then(function(){nextTest()})
			.catch(H.testCatch1(nextTest))
		});
	});
	describe('#update', function() {
		it('should update',function(nextTest) {
			var num = 3 , success = 1
			 	,a_user = users[num-1];
			a_user.email = 'update_email';
			
			userDAO.update(a_user)
			.then(function dataFn(status) {
				should.equal(status.isSuccess(), true);
				return userDAO.findById(a_user._id)
			})
			.then(function dataFn2(e_user) {
				should.equal(a_user.id, e_user.id);
			})
			.then(function(){nextTest()})
			.catch(H.testCatch1(nextTest))
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
