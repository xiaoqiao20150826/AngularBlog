/**
 * 
 */
//@ sourceURL=contorller/controllerManager.js
$$namespace.include(function (require, module) {

	var ListController = require('controller/blogBoard/ListController.js')
	  , InsertController = require('controller/blogBoard/InsertController.js')
	  , DetailController = require('controller/DetailController.js')
	  , AnswerController = require('controller/AnswerController.js')
	  
	var NavController = require('controller/NavController.js')
	
	var ControllerManager = module.exports =  function (app) {
		this.app = app
		
		this.navController = new NavController(app);
		
		this.listController = new ListController(app);
		this.insertController = new InsertController(app);
		this.detailController = new DetailController(app);
		this.answerController = new AnswerController(app);
	}
	// top
	ControllerManager.prototype.onHandlerAboutNav = function () {
		this.navController.onHandler()
	}
	//centerFrame
	ControllerManager.prototype.onHandlerAboutListOfBlogBoard = function () {
		this.listController.onHandler()
	}
	ControllerManager.prototype.onHandlerAboutInsertOfBlogBoard = function () {
		this.insertController.onHandler()
	}
	ControllerManager.prototype.onHandlerAboutDetailOfBlogBoard = function () {
		this.detailController.onHandler()
		this.answerController.onHandler()
	}
	ControllerManager.prototype.onHandlerAboutAnswerOfBlogBoard = function () {
		this.answerController.onHandler()
	}
	
	
})
