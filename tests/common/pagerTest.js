/**
 * 
 */
var pagerTest = module.exports = {}
	
var should = require('should')
  , pager = require('../../common/pager.js');

describe('pager', function () {
	it('should take pageNums', function () {
		var curPageNum = 3;
		var maxRowCount = 5;
		var allRowCount = 22;
		pager.setMaxRowCount(maxRowCount);
		var pageCount = pager.getPageCount(allRowCount); 
		var rowNums = pager.getRowNums(curPageNum);
		
		should.equal(pageCount, 5);
		should.equal(rowNums.start, 11);
		should.equal(rowNums.end, 15);
//		console.log(pageCount, rowNums);
	});
});
