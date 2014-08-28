/**
 * 
 */
var should = require('should')
var path = require('path')

var folder = __dirname;
describe('path', function () {
	var folder1 = 'folder1', folder2 = 'folder2', folder3= 'folder3';
	var fileName = 'file.txt';
	var dir = folder + '\\' + folder1 + '\\' + folder2 + '\\' + folder3 + '\\' + fileName;
	it('#dirname', function () {
		var dir3 = path.dirname(dir);
		var dir2 = path.dirname(dir3);
		var dir1 = path.dirname(dir2);
		
		should.equal(path.basename(dir1), folder1);
	})
})
