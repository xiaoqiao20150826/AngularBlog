/**
 * 
 */
var config = require('./config')
var Status = require('./common/Status')
var Done = require('./common/Done')
 ,  H = require('./common/helper')
 ,  Sequence = require('./dao/Sequence')
 ,  categoryDAO = require('./dao/blogBoard/categoryDAO')

var initDataCreater = module.exports = {}

initDataCreater.create= function (done) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	
	var sequenceIdMap = config.sequenceIdMap
	  , postSequenceId = sequenceIdMap.post
	  , answerSequenceId = sequenceIdMap.answer
	
	return H.all4promise([
			                [Sequence.makeFor, postSequenceId]
			              , [Sequence.makeFor, answerSequenceId]
			              , [categoryDAO.createRoot]
		    ])
		     .then(function(statuses) {
		    	 return dataFn(Status.reduceOne(statuses))
		     })
		     .catch(errFn)
}
//테스트를위해.
initDataCreater.removeAll = function (done) {
	return H.all4promise([ categoryDAO.removeAll , Sequence.removeAll ])
			 .then(done.getDataFn()) 
			 .catch(done.getErrFn()) 
}