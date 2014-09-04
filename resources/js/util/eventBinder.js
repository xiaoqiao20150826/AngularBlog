/**
 * 
 */

$$namespace.include(function(require, module) {
	
	var eventBinder = module.exports = {}
	
	//모두모두 한번만 등록하자.
	eventBinder.onChange = function ($button, method) { bind('change',$button, method) }
	eventBinder.onClick = function ($button, method) { bind('click',$button, method) }
	eventBinder.onSubmit = function ($form, method) {
		//bind(submit..안되네
	$form.removeAttr('onsubmit')
		 .submit(function(e) {
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
