/**
 * 
 */
var config = require('./config')
var Done = require('./common/Done')
 ,  H = require('./common/helper')
 ,  Sequence = require('./dao/Sequence')
 ,  categoryDAO = require('./dao/blogBoard/categoryDAO')
 ,  userDAO = require('./dao/userDAO')
 ,  User = require('./domain/User')

var initDataCreater = module.exports = {}

initDataCreater.create= function (done) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	
	var sequenceIdMap = config.sequenceIdMap
	  , postSequenceId = sequenceIdMap.post
	  , answerSequenceId = sequenceIdMap.answer
	var annoymousUser = User.getAnnoymousUser()
	var testUser = User.getTester();
	return H.all4promise([
			                [Sequence.makeFor, postSequenceId]
			              , [Sequence.makeFor, answerSequenceId]
			              , [categoryDAO.createRoot]
			              , [userDAO.insertOne, annoymousUser] 
			              , [userDAO.insertOne, testUser] 
		    ])
		     .then(function(args) {
		    	 return dataFn(null)
		     })
		     .catch(function _ignoreDuplicate(errors) { // 중복에러 무시.
		    	 for(var i in errors) {
		    		 var error = errors[i]
		    		 if(error.code == 11000) continue;
		    		 else return errFn(error)
		    	 }
		    	 return dataFn(null)
		     })
}


//테스트를위해.
initDataCreater.removeAll = function (done) {
	return H.all4promise([ categoryDAO.removeAll , Sequence.removeAll ])
			 .then(done.getDataFn()) 
			 .catch(done.getErrFn()) 
}