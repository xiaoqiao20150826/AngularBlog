/**
 *  send만들다 말았다.
 *  moduleLoader의 getScript에서..jquery의존성을 끊고 싶었는데,
 *  궂이 이렇게 까지 할 필요가 있을까.
 */



// ajax class

var window = this;
var parentModule = this;

(function(parentModule, window) {
	
	var ajax = parentModule._ajax = {};
		
	ajax.send =  function (onSuccess, onCatch, url, dataMap, method, setRequestHeader) {
		if(!onSuccess) throw 'not exist onSuccess';
	    var xmlHttp = this.getXmlHttpObject()
	      , method = method || 'post'
	      , async = async || true
	      , dataMap = dataMap || {}
	      , setRequestHeader = setRequestHeader || {}
	      , onCatch = onCatch || this.defaultCatch;
	    
	    //setReq...  
	      
	    xmlHttp.onreadystatechange = this.readyStateCallback(xmlHttp, onSuccess, onCatch)
	    xmlHttp.open(method, url, async);
	    xmlHttp.send(dataMap);
	};
	function defaultCatch(err) {
		console.error(err);
	}
	
	ajax.readyStateCallback = function (xmlHttp, onSuccess, onCatch) {
		return function () {
			var response = this;
log(response.readyState)
log(response.status)
			if (response.readyState == 4) {
				if (response.status != 200) { onError(response.responseText);}
				onCatch(response.responseText);
			}
		};
	}
	ajax.getXmlHttpObject = function () {
	    if(window.XMLHttpRequest) return new XMLHttpRequest();
	    if(window.ActiveXObject) {
	    	try {
	            return new ActiveXObject("Msxml2.XMLHTTP");
	        } catch (e) {
	            return new ActiveXObject("Microsoft.XMLHTTP");
	        }
	    }
	    throw new Error('not exist xhr in browser');
	};
})(parentModule, window);

//@ sourceURL=util/ajax.js