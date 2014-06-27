/**
 * 
 */



////
//전역변수
var Board = require('../domain/Board.js');
var boardDAO = require('../dao/boardDAO.js');
var mongoose = require('mongoose');

var boards = [];
///////

function before() {
	mongoose.connect('mongodb://localhost/nodeblog');
	for(var i=0, max=10; i< max; ++i) {
		var data = {}, Board;
		
		data.num = i; //Number
		data.name = 'name' +i;
		data.photo = 'photo' + i;
		data.email = 'email' + i;
		Board = new Board(data);
		boards.push(Board);
	}
}

function create() {
	boardDAO.create(boards,createCb);
	function createCb(err, other) {
		console.log('create : '  + err + '; ' + other);
	}
	
};
function findById(next) { 
	boardDAO.findById(3,findCb);
	
	function findCb(err, other) {
		if(err) throw 'err : ' + err;
		console.log('find : '+ err + '; ' + other);
		console.log('----------');
//		next();
	}
};
function removeAll(next) {
	boardDAO.removeAll(cb);
	function cb(err, other) {
		console.log('remove : '+ err + '; '+other);
//		next();
	}
}
function findAll(next) {
	boardDAO.findAll(cb);
	function cb(err, other) {
		if(other instanceof Array) {console.log('isArray');};
		console.log('find : '+ err + '; ' + other);
//		next();
	}
}


////===============================
before();
create();
//removeAll();

//findAll();
//findById();