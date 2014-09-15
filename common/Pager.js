/**
 * 
 */
var Pager = module.exports = function (allRowCount, maxRowCountOfApage) {
	this.allRowCount = allRowCount;
	this.maxRowCountOfApage = maxRowCountOfApage || 5;// default value
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
// view를 위해.
Pager.prototype.make4view = function (currentPageNum, maxPageCount) {
	var currentPageNum = Number(currentPageNum) // 주의요청에의해 문자열이 전달됨
	var pageCount = this.getPageCount()
	  , pager4view = new Pager4view(pageCount, currentPageNum, maxPageCount)
	
	pager4view.init()
	
	return pager4view;
}

//
//var Status = {LEFT_OVERFLOW : 'left', RIGHT_OVERFLOW : 'right', BOTH_OVERFLOW: 'both', NO_OVERFLOW: 'no'}

var Pager4view = function (pageCount, currentPageNum,  maxPageCount) {
	this.pageCount = pageCount;
	this.currentPageNum = currentPageNum;
	this.maxPageCount = maxPageCount || 5;
	
}

// 순서유의. 이 공개함수들은 사실 사용하면안돼....순서에 의존하는 함수들이라...
Pager4view.prototype.init = function () {
	this.adjustMaxPageCount()

	var rawStartPageNum = this.getRawStartPageNum()
	  , rawEndPageNum = this.getRawEndPageNum()
	  , numToMoveRight = getNumToMoveRight(rawStartPageNum)
	  , numToMoveLeft = getNumToMoveLeft(rawEndPageNum, this.pageCount)
	
	this.startPageNum = this.getStartPageNum(rawStartPageNum, numToMoveRight, numToMoveLeft)
	this.endPageNum = this.getEndPageNum(rawEndPageNum, numToMoveRight, numToMoveLeft)
	
	if(this.existLeftPageNum()) this.leftPageNum = this.getLeftPageNum()
	if(this.existRightPageNum()) this.rightPageNum = this.getRightPageNum()
}

Pager4view.prototype.getLeftPageNum = function () {
	var leftPageNum = this.startPageNum - this.maxPageCount
	if(leftPageNum < 1) leftPageNum = 1
	
	return leftPageNum;
}
Pager4view.prototype.getRightPageNum = function () {
	var rightPageNum = this.endPageNum + this.maxPageCount
	if(rightPageNum > this.pageCount) rightPageNum = this.pageCount
	
	return rightPageNum;
}

Pager4view.prototype.adjustMaxPageCount = function () {
	var pageCount = this.pageCount
	  , maxPageCount = this.maxPageCount
	  
    if(pageCount < maxPageCount) return this.maxPageCount = this.pageCount
}

function getNumToMoveRight(rawStartPageNum) {
var minPageNum = 1
if(rawStartPageNum > minPageNum) 
	return 0; // 이동안해도됨.
else 
	return minPageNum - rawStartPageNum;
}
function getNumToMoveLeft(rawEndPageNum, maxPageNum) {
if(rawEndPageNum < maxPageNum) 
	return 0; // 이동안해도됨.
else 
	return maxPageNum - rawEndPageNum ;
}


Pager4view.prototype.getRawStartPageNum = function() { 
	var rawStartPageNum = this.currentPageNum - this.getNumToAddPageNum()
	
//	console.log('rawStartPageNum ', rawStartPageNum)
	return rawStartPageNum;
}
Pager4view.prototype.getRawEndPageNum = function() {
	var rawEndPageNum = this.currentPageNum + this.getNumToAddPageNum()
	if(isEvenNumber(this.maxPageCount)) rawEndPageNum =  rawEndPageNum + 1 //짝수면 1 더해야해.
	
//	console.log('rawEndPageNum ', rawEndPageNum)
	return rawEndPageNum;
}
Pager4view.prototype.getNumToAddPageNum = function () {
	var maxPageCount =  this.maxPageCount;
	if(!isEvenNumber(maxPageCount)) maxPageCount = maxPageCount + 1;
	
	var numToAddPageNum = Math.round(maxPageCount/2) -1
//	console.log('numToAddINdex ', numToAddPageNum)
	return numToAddPageNum * 1;
}

function isEvenNumber(num) {
	if(num%2 == 0) return true
	else return false;
}

Pager4view.prototype.getStartPageNum = function (rawStartPageNum, numToMoveRight, numToMoveLeft) {
//	console.log('s', rawStartPageNum, numToMoveRight , numToMoveLeft)
	var startPageNum = rawStartPageNum + numToMoveRight + numToMoveLeft
	return startPageNum
}
Pager4view.prototype.getEndPageNum = function (rawEndPageNum,numToMoveRight, numToMoveLeft) {
//	console.log('e', rawEndPageNum, numToMoveRight , numToMoveLeft)
	var endPageNum = rawEndPageNum + numToMoveRight + numToMoveLeft
	return endPageNum
}
Pager4view.prototype.existLeftPageNum = function () {
	if(this.startPageNum > 1) return true;
	else return false;
}
Pager4view.prototype.existRightPageNum = function () {
	if(this.endPageNum < this.pageCount) return true;
	else return false;
}
/////////
