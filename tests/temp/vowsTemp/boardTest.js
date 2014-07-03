/**
 * 
 */



////
//전역변수
var User = require('../domain/User.js');
var userDAO = require('../dao/userDAO.js');
var mongoose = require('mongoose');
var async = require('async');

var users = [];
///////
function before() {
	mongoose.connect('mongodb://localhost/nodeblog');
	for(var i=0, max=10; i< max; ++i) {
		var data = {}, user;
		
		data.id = i; //Number
		data.name = 'name' +i;
		data.photo = 'photo' + i;
		data.email = 'email' + i;
		user = new User(data);
		users.push(user);
	}
}

function create() {
	userDAO.create(users,createCb);
	function createCb(err, other) {
		console.log('create : '  + err + '; ' + other);
	}
	
};
function findById(next) { 
	userDAO.findById(3,findCb);
	
	function findCb(err, other) {
		if(err) throw 'err : ' + err;
		console.log('find : '+ err + '; ' + other);
		console.log('----------');
//		next();
	}
};
function removeAll(next) {
	userDAO.removeAll(cb);
	function cb(err, other) {
		console.log('remove : '+ err + '; '+other);
//		next();
	}
}
function findAll(next) {
	userDAO.findAll(cb);
	function cb(err, other) {
		if(other instanceof Array) {console.log('isArray');};
		console.log('find : '+ err + '; ' + other);
//		next();
	}
}


////===============================
before();

//async.waterfall([removeAll, create],result);
//function result() {
//	console.log('result : ' + arguments);
//};
removeAll();
//create();
//findAll();
//findById();