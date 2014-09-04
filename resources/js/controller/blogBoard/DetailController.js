
$$namespace.include(function(require, module) {
	
	
	var H = require('/util/helper') 
	  , ajax = require('/util/ajax') 
	  , divUtil = require('/util/divUtil') 

	var actionHistory = require('history/actionHistory')
	  , Action = require('history/Action')
	//
	var DetailController = module.exports = function(app) {
		var viewManager = app.getViewManager()
		  , detailView = viewManager.getDetailView()
		  
		this.app = app;
		this.detailView = detailView
	}
	DetailController.prototype.onHandler = function () {
		var app = this.app
		
		var detailView = this.detailView
		  , $voteBtn = detailView.get$voteBtn()
		  , $updateBtn = detailView.get$updateBtn()
		  , $deleteBtn = detailView.get$deleteBtn()
		
		app.onClick($voteBtn, this.increaseVote1(detailView) )
		app.onClick($updateBtn, this.updateView1(detailView) )
		app.onClick($deleteBtn, this.deletePost )
		
	}
	
	DetailController.prototype.increaseVote1 = function(detailView) {
		return function (e) {
			var $voteBtn = $(this)
	          , ds = $voteBtn.data()
			  , voteCount = ds.votecount
			  
			var data = {postNum:ds.postnum};  
			ajax.call(callback, '/blogBoard/increaseVote', data)
			function callback(message) {
				if(message.indexOf('success') != -1) { $voteBtn.text('★ Vote '+(++voteCount)); }
				
				return alert(message); 
			}
			return e.preventDefault();
		}
	}
	//insertView를 불러오되 submit주소와, 데이터만 변경하여 업데이트를 수행하게 함.
	DetailController.prototype.updateView1 = function(detailView) {
		var reStarter = this.app.getReStarter()
		return function clickUpdateViewBtn(e) {
			var $updateBtn = $(this)
			  , ds = $updateBtn.data()
			  , data = {postNum : ds.postnum }
			  
			var action = new Action([this, clickUpdateViewBtn], e)
			actionHistory.save(action)
			
			ajax.call(callback, '/blogBoard/updateView', data);
			function callback(html) {
				divUtil.replaceCenterFrame(html)
				reStarter.insertOfBlogBoard()  // 기능은 같아.
			}
			
			return e.preventDefault(); //버블링방지
		}
	}
	//insertView를 불러오되 submit주소와, 데이터만 변경하여 업데이트를 수행하게 함.
	DetailController.prototype.deletePost = function(e) {
		var $deleteBtn = $(this)
		, ds = $deleteBtn.data()
		, data = { postNum : ds.postnum
			     , writerId : ds.writerid
			     }
		var yes = confirm("Do you realy want to delete post?");
		if(!yes) return e.preventDefault();
		
		ajax.call(callback, '/blogBoard/delete', data);
		function callback(status) {
			alert(status)
			return H.redirect();
		}
		return e.preventDefault(); //버블링방지
	}
});

//@ sourceURL=/controller/DetailController.js