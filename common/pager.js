/**
 * 
 */
var maxRowCount = 10;
var pager = module.exports = {
	setMaxRowCount : function (num) {
		maxRowCount = num;
	}
	,getPageCount : function (allRowCount) {
		var pageCount = allRowCount / maxRowCount;
		if((allRowCount % maxRowCount) != 0) {++pageCount;}
		return Math.round(pageCount);
	}
	,getRowNums : function (curPageNum , allRowCount) {
		var startRowNum = (curPageNum-1) * maxRowCount +1;
		var endRowNum = maxRowCount * curPageNum;
		if(endRowNum > allRowCount) {endRowNum = allRowCount;}
		return { start : startRowNum, end : endRowNum};
	}
		
};