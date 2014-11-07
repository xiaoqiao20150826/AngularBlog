/**
 * 
 */

var _ = require('underscore')
  , path = require('path')
var config = require('../../config.js')
  , cloudinaryConfig = config.cloudinary
var cloudinary = require('cloudinary')
var FileInfo = require('./FileInfo')

var Status = require('../Status') //이것이. 몽고디비를 위한건데. 여기서도 사용.

cloudinary.config({ 
  cloud_name: cloudinaryConfig.name, 
  api_key: cloudinaryConfig.key, 
  api_secret: cloudinaryConfig.secret 
});


var remoteFile = module.exports = {}

//덮어쓰기 형태. fromPath는 임시저장파일이라 이름이 이상해서 use_filename:true를사용할수가없네.
// 현재 img만가능한데.
remoteFile.save = function (done, fromPath, toPath, userId) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	
	//dir이 userId이고, 태그로 저장하여 삭제할때 사용한다.  
	var options = {public_id:toPath, tags: userId}
	
	var uploader = cloudinary.uploader
	
	return  uploader.upload(fromPath, function(){}, options)
				    .then(function (result) {
				    	if(result.error) {return dataFn(Status.makeError(result.error.message)) }

				    	
				    	var fileInfo = new FileInfo( result.public_id 
				    			                   , path.basename(toPath)
				    			                   , result.url)
				    	var status = Status.makeSuccess()
				    	status.fileInfo = fileInfo
				    	return dataFn(status)
				    })
				    .catch(function (err) {
				    	console.log(err)
				    	return dataFn(Status.makeError(err))
				    })
}

//userId를 tag로 저장해놨다.
remoteFile.removeByUserId = function (done, userId) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	  
	return cloudinary.api.delete_resources_by_tag(userId, function(){})
					 .then(function (result) {
						 if(result == undefined) return dataFn(Status.makeSuccess('remove by '+userId))
						 if(result.error) {return dataFn(Status.makeError(result.error.message)) }
						 
						 return dataFn(Status.makeSuccess(result))
					 })
					 .catch(function (err) {
						console.log(err)
					    return dataFn(Status.makeError(err))
					 })	
	
}
remoteFile.removeByIds = function (done, ids) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	
	if(!_.isArray(ids)) ids = [ids]  
	  
	return cloudinary.api.delete_resources(ids, function(){})
					 .then(function (result) {
						 if(result == undefined) return dataFn(Status.makeSuccess('remove file'))
						 if(result.error) {return dataFn(Status.makeError(result.error.message)) }
						 
						 return dataFn(Status.makeSuccess(result))
					 })
					 .catch(function (err) {
						 console.log(err)
					    return dataFn(Status.makeError(err))
					 })
}