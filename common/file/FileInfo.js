/**
 * 
 */



var FileInfo = module.exports = function FileInfo(id, name, url) {
	this.id = id || '' //remove를 위한 id, local에서는 실제 filepath
	this.name = name || '' //파일이름
	this.url = url || '' // 서버를 통하는 주소.
}