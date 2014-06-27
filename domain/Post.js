/**
 * 
 */

/* 참조 및 초기화 */
var H = require('../common/helper.js'),
	MAXROWSIZE_OF_ONEPAGE = 5;

//////////////////
var Post = module.exports = function () {
	this.num = 0;
	this.created = Date.now();
	this.readCount = 0;
	this.vote = 0;
	this.images = null;
	this.title = '';
	this.content = '';
	this.userId = '';
};

/* static method */
// 생성자
Post.createByRaw= function (raw) {
	if(!raw.title || !raw.content) throw 'title, content는 필수데이터';
	return _create(Post, raw, function (post) {
		if(!(H.exist(post.userId))) post.userId = 'annoymous';
	});
};
// 생성자인데. 무엇을 통해 생성한다고 해야할까. DB data?  객체관계불일치...관계? 도메인...모델...모델.?
Post.createBy= function(model) {
	return _create(Post, model, function(post) {
		if(!(H.exist(post.userId))) post.userId = 'annoymous';
	});
};
function _create(targetType, source, eachWrapp) {
	if(!(source instanceof Array)) {return __createOne(source); }
	return _.map(source, function(source) {
		return __createOne(source);
	});
	
	// 추가해야할 기본설정.
	function __createOne(source) {
		var post = H.cloneAboutTargetKeys(new targetType(), source)
		eachWrapp(post);
		return post;
	}
}
/* paging  */

//public boolean hasUploadedFile() {
//	if(this.uploadedFile != null && !(this.uploadedFile.isEmpty())) 
//		return true; 
//	else 
//		return false;
//}

//public static void setMaxRowSizeOfOnePage(int maxSize) {
//	Board.MAXROWSIZE_OF_ONEPAGE = maxSize;
//}
//public static int getPageSizeBy(int rowSize) {
//	int maxSizeOfOnePage = MAXROWSIZE_OF_ONEPAGE;
//	int pageSize = rowSize / maxSizeOfOnePage;
//	if(rowSize%maxSizeOfOnePage!=0) {	++pageSize;}
//	return pageSize;
//}
//public static int getEndRowIndexOf(int pageIndex, int rowSize) {
//	int endRowNum = MAXROWSIZE_OF_ONEPAGE * pageIndex;
//	if(endRowNum > rowSize) {endRowNum = rowSize;}
//	return endRowNum;
//}
//public static int getStartRowIndexOf(int pageIndex) {
//	int startRowIndex = (pageIndex-1)* MAXROWSIZE_OF_ONEPAGE +1;
//	return startRowIndex;
//}
//public static int getPageNumberBy(int rowNumber) {
//	int pageNumber = (rowNumber / MAXROWSIZE_OF_ONEPAGE);
//	if(rowNumber % MAXROWSIZE_OF_ONEPAGE != 0) 
//		pageNumber = pageNumber+1;
//	return pageNumber;
//}


/* instance method */
Post.prototype.getNum = function () {
	return this.num;
};
Post.prototype.setNum = function (num) {
	this.num = num;
};
