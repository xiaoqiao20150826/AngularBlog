var async = require('async');

async.pa([ a, b, c ], resultFunc);

function resultFunc(c, results) {
	console.log('result :' + results);
	console.log('args :' + arguments);
};

function a(cb) {
	setTimeout(function() {
		console.log('a');
		cb(null, 'p1');
	}, 200);
}
function b(p1, cb) {
	setTimeout(function() {
		console.log('b : ' + p1);
		cb(null, 'p2');
	}, 200);
}
function c(p2, cb) {
	setTimeout(function() {
		console.log('c : ' + p2);
		cb(null, 'p3');
	}, 200);
}