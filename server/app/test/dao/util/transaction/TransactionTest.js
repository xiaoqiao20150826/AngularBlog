/**
 * 
 */
process.env.NODE_ENV = 'test'

var mongoose = require('mongoose')
var	Transaction = require('../../../../dao/util/transaction/Transaction.js')

var Q = require('q')
var should = require('should')
  , _ = require('underscore')
  , H = require('../../../testHelper.js')
  , Done = H.Done
  
var initDataCreater = require('../../../../initDataCreater.js')
var User = require('../../../../domain/User.js')
  , userDAO = require('../../../../dao/userDAO.js')
  , Post = require('../../../../domain/blogBoard/Post.js')
  , postDAO = require('../../../../dao/blogBoard/postDAO.js')
  , Answer = require('../../../../domain/blogBoard/Answer.js')
  , answerDAO = require('../../../../dao/blogBoard/answerDAO.js')

describe('Transaction', function() {
	var initDatas= null
	var initUser1 = null
	var initPost1 = null
	var initAnswer1 = null
	
	before(function (nextTest) {
		mongoose.connect('mongodb://localhost/test',function() {
			initDataCreater.create()
			 .then(function() {
					var user1 = User.createBy({_id:'user1', name:'name1'})
					  , user2 = User.createBy({_id:'user2', name:'name2'})
					var post1 = Post.createBy({content:'post1'})
					  , post2 = Post.createBy({content:'post2'})
				    var answer1 = Answer.createBy({content:'answer1'})
					  , answer2 = Answer.createBy({content:'answer2'})				 
				 
					//순서있게 들어가야함.  
					return Q.all([
					                userDAO.insertOne( user1)
					              , userDAO.insertOne( user2) 
					              , answerDAO.insertOne( answer1)
					              , answerDAO.insertOne( answer2) 
					              , postDAO.insertOne( post1)
					              , postDAO.insertOne( post2) 
							 ])
							 .then(function dataFn(args) {
								 should.equal(args[1]._id, 'user2')
								 initDatas = args
								 initUser1 = args[0]
								 initAnswer1 = args[2]
								 initPost1 = args[4]
								 nextTest()
							 })
			 })
			 .catch(H.testCatch1(nextTest))
		})
	})
	after(function(nextTest) {
		
		Q.all([
                userDAO.removeAll()
              , postDAO.removeAll()
              , answerDAO.removeAll()
		      , initDataCreater.removeAll()
        ])
		.then(function() {
			mongoose.disconnect(function() {
				nextTest();
			});
		})
		.catch(H.testCatch1(nextTest));
	});
	it('should success by insert', function (nextTest) {

//		
		var tran = new Transaction()
//		
		tran.atomic(function () {
			
			tran.rollback()  // rollback하게
			should.equal(mongoose.Model.create.name, 'create4transaction')
			
			var user1 = H.deepClone(initUser1)
			user1.name = '23324'
			
		    var answer1 = H.deepClone(initAnswer1)
		    answer1.context = 'wefweff'
		    	
			var post1 = H.deepClone(initPost1)
		    post1.context = 'wefweff'		    	
		    return Q.all([
		                    answerDAO, answerDAO.update( answer1  )
		                  , userDAO, userDAO.update(user1  )
		                  , postDAO, postDAO.update( post1  )

					])
					.then(function () {
						var post3 = Post.createBy({content:'post3'})			
						var user3 = User.createBy({_id:'user3', name:'name3'})
						  
						return Q.all([
						               postDAO.insertOne( post3)
						             , postDAO.removeAll(  )
						             , userDAO.insertOne( user3)
				                    ])
					})
				    .then(function () {
				    	var answer3 = Answer.createBy({content:'answer3'})	    	
				    	return Q.all([
						                userDAO.removeAll()
						              , answerDAO.removeAll()
						              , answerDAO.insertOne( answer3)
								])
				    })
		  })
		    .then(function (status) {
//		    	console.log('result atomic', status)
		    	should.equal(status.isSuccess(), true)
			    return Q.all([
		                        userDAO.find({})
		                      , postDAO.find({})
		                      , answerDAO.find({})
	                     ])
	                     .then(function (args) {
//	                    	 console.log(args)
	                    	 var user1 = _.min(args[0], function (each) {return each.name.charCodeAt(4) })
	                    	 var post1 = _.min(args[1], function (each) {return each.num })
	                    	 var answer1 = _.min(args[2], function (each) {return each.num })
	                    	 
//	                    	 console.log(user1._id)
//	                    	 console.log(post1.content)
//	                    	 console.log(answer1.content)
                	 		should.equal(mongoose.Model.create.name, 'create')
	                    	 
	                    	 should.equal(initUser1._id, user1._id)
	                    	 should.equal(initUser1.name, user1.name)
	                    	 should.equal(initPost1._id.id, post1._id.id)
	                    	 should.equal(initPost1.content, post1.content)
	                    	 should.equal(initAnswer1._id.id, answer1._id.id)
	                    	 should.equal(initAnswer1.content, answer1.content)
	                    	 nextTest()
	                     })

		    })
		    .catch(function (err) {
	             console.error('catch ', err)
	        })   
	})
})
