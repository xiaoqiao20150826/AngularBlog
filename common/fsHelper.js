/**
 *  fs을 감싼 객체.
 */
var _ = require('underscore')
  , fs = require('fs');

var H = require('./helper.js');
  
/////
var fsHelper = module.exports = {};


//callback(err)로 호출되기에 data는 값이 없지만 dataFn을 통해 다음행동을 할 수 있다.
//이건 전달하는 data없으니 내가 생성한 fileUrl을 전달함.
fsHelper.create = function(done, fileUrl, data) {
	done.hook4dataFn(function() {return fileUrl});
	var option = {encoding:'utf8'};
	fs.writeFile(fileUrl, data, option, done.getCallback());
}
fsHelper.read = function(done, fileUrl) {
	var option = {encoding:'utf8'};
	fs.readFile(fileUrl, option, done.getCallback());
}
fsHelper.copy = function(done, fromFileUrl, toFileUrl) {
	H.call4promise(fsHelper.read, fromFileUrl)
	 .then(function(data) {
		 fsHelper.create(done, toFileUrl, data);
	 })
	 .catch(done.getErrFn());
}
fsHelper.copyNoDuplicate = function(done, fromFileUrl, toFileUrl) {
	var i = 0;
	
	loopUntilNoExistFile(toFileUrl);
	function loopUntilNoExistFile(to) {
		H.call4promise(fsHelper.exists, to)
		 .then(function (existFile) {
			 if(!existFile) { return fsHelper.copy(done, fromFileUrl, to); }
			 else {
				 var newFileUrl = H.pushInMidOfStr(toFileUrl, (++i), '.');
				 return loopUntilNoExistFile(newFileUrl);
			 }
	     })
	     .catch(done.getErrFn());
	}
}
//이 함수는 err가 없어. data만 전달해 그래서 done의 async템플릿 사용은은 애매해.
fsHelper.exists = function(done, fileUrl) {
	fs.exists(fileUrl, done.getDataFn());
}
fsHelper.delete = function(done, fileUrl) {
	fs.unlink(fileUrl, done.getCallback());
}
