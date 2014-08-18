/**
 * 
 */

$$namespace.include(function (require, module) {
	/////////////////////////
	var app = module.exports = {}
	//rerun시 중첩되는 것 방지 위한 unbind
	app.onClick = function ($button, method) { bind('click',$button, method) }
	app.onSubmit = function ($form, method) {
		//bind(submit..안되네
		$form.submit(function(e) {
    		   method.call(this, e, app);
        }) 
	}
	function bind (key, $button, method) {
		$button.unbind(key)
	       	   .bind(key, function(e) {
	       		   method.call(this, e, app);
	          })		
	}
	
	app.reRun = function () {
		app.run();
	}
	////////////////////////
	
	var controllerManager = require('/controller/controllerManager')	
	  , viewManager = require('/view/viewManager')	
	////////////////////
	app.setup = function() {
		controllerManager.onHandler(this);
		viewManager.init(this);
	}
	
	app.run = function() {
		app.setup();
	}
	////////////////////
})

//@ sourceURL=app.js