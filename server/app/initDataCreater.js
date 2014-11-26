/**
 * 
 */
var config = require('./config')
var _ = require('underscore')
 ,  H = require('./common/helper')
 ,  Q = require('q')
var Sequence = require('./dao/Sequence')
 ,  categoryDAO = require('./dao/blogBoard/categoryDAO')
 ,  userDAO = require('./dao/userDAO')
 ,  User = require('./domain/User')

var initDataCreater = module.exports = {}

initDataCreater.create= function () {
	var deferred  = Q.defer()
	
	var sequenceIdMap = config.sequenceIdMap
	  , postSequenceId = sequenceIdMap.post
	  , answerSequenceId = sequenceIdMap.answer
	var annoymousUser = User.getAnnoymousUser()
	var testUser = User.getTester();
	
	
	Q.all([
                Sequence.makeFor( postSequenceId)
              , Sequence.makeFor( answerSequenceId)
              , categoryDAO.createRoot()
              , userDAO.insertOne( annoymousUser) 
              , userDAO.insertOne( testUser) 
	    ])
	    .then(function(args) { deferred.resolve(args)  })
	    .catch(function _ignoreDuplicate(errors) { // 중복에러 무시.
	    	if(!_.isString(errors))  errors = [errors]
	    	
	    	var newErrors = []
	    	
	    	 for(var i in errors) {
	    		 var error = errors[i]
	    		 if(error.code == 11000) continue;
	    		 else newErrors.push(error)
	    	 }
	    	
	    	if(_.isEmpty(newErrors)) return deferred.resolve('no errors') 
	    	else return deferred.reject(newErrors)
	     })
	
	return deferred.promise
}


//테스트를위해.
initDataCreater.removeAll = function () {
	return Q.all([categoryDAO.removeAll() , Sequence.removeAll(), userDAO.removeAll() ])
}