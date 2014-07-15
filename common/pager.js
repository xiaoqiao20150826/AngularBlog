/**
 * 
 */
var Pager = module.exports = function (allRowCount, maxRowCountOfApage) {
	this.allRowCount = allRowCount;
	this.maxRowCountOfApage = maxRowCountOfApage || 10;// default value
};
//set
Pager.prototype.setMaxRowCountOfApage = function (num) {
		this.maxRowCountOfApage = num;
}
//get
Pager.prototype.getMaxRowCountOfApage = function () {
		return this.maxRowCountOfApage;
}

Pager.prototype.getPageCount = function () {
	var maxRowCountOfApage = this.maxRowCountOfApage
	  , allRowCount = this.allRowCount;
	
	var pageCount = allRowCount / maxRowCountOfApage; //1.나누고
	
	if(_isNotInteger(pageCount))  //실수이면.
		return Math.ceil(pageCount); // 소수점 올림 
	else 
		return pageCount;
	
	function _isNotInteger(num) { //소수점있나.. Nan, infinity은 나올일이 없을듯.
		if(num % 1 != 0) return true;
		else return false;
	}
}
Pager.prototype.getStartAndEndRowNumBy = function (curPageNum) {
		var allRowCount = this.allRowCount
		  , maxRowCountOfApage = this.maxRowCountOfApage;
		if(curPageNum < 1) curPageNum = 1;
		
		var startRowNum = (curPageNum-1)*maxRowCountOfApage + 1;
		var endRowNum = maxRowCountOfApage * curPageNum;
		
		if(endRowNum > allRowCount) {endRowNum = allRowCount;}
		if(startRowNum > endRowNum) {startRowNum = endRowNum;}
		return { start : startRowNum, end : endRowNum};
}
