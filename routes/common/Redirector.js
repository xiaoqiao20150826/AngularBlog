/**
 * 
 */

var Redirector = module.exports = function(res) {
	this.res = res;
}

Redirector.prototype.post = function (postNum) {
	if(!postNum) return this.main()
	
	return this.res.redirect('/blog/'+postNum);
}
Redirector.prototype.main = function () {
	return this.res.redirect('/');
}

Redirector.prototype.catch = function (error) {
	console.error(error)
	return this.res.send(error)
}