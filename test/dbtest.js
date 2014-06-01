/**
 * 
 */



////
//전역변수
var User = require('../domain/User.js');
var userDAO = require('../dao/userDAO.js');
var mongoose = require('mongoose');

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
function findById() { 
user.findById(1,findCb);
	
	function findCb(err, other) {
		if(err) throw 'err : ' + err;
		console.log('find : '+ err + '; ' + other);
		console.log('----------');
	}
};
function removeAll() {
	userDAO.removeAll(cb);
	function cb(err, other) {
		
		console.log('remove : '+ err + '; '+other);
	}
}
function findAll() {
	userDAO.findAll(cb);
	function cb(err, other) {
		console.log('find : '+ err + '; ' + other);
	}
}


////===============================
before();
//removeAll();
create();
//findAll();
//findById();