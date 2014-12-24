/**
 * iframe content load
 * 처음알았네. css를 여기서 불러와야 있어야 적용이 된다.
 */

(function() {
	var iframe = document.getElementsByTagName("iframe")[0],
		contentWindow = iframe.contentWindow,
		contentDoc = contentWindow.document,
		contentBody = contentWindow.document.body,
		wysiwygHTML = '<html lang="ko"><head>'
			+ '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'
			+ '<title>Wygiwyg Panel</title>'
			+ '</head>'
			+ '<body id="wysiwyg" contenteditable="true">'
			+ '<p>&#8203</p>'
			+ '</body></html>';
	
	contentDoc.write(wysiwygHTML);
	contentBody.focus();
	contentDoc.close(); //close 호출되야함. 
})();