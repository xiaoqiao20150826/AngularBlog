/**
 * 
 */

$$namespace.include(function(require, module) {
	
	var eventBinder = module.exports = {}
	
	eventBinder.onClick = function ($button, method) { bind('click',$button, method) }
	eventBinder.onSubmit = function ($form, method) {
		//bind(submit..안되네
		$form.submit(function(e) {
    		   method.call(this, e);
        }) 
	}
	function bind (key, $button, method) {
		$button.unbind(key)
	       	   .bind(key, function(e) {
	       		   method.call(this, e);
	          })		
	}
})
