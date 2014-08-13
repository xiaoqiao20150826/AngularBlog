/**
 * 
 */
	
var should = require('should')
  , Pager = require('../../common/Pager.js');

describe('Pager', function () {
	it('#MaxRowCount should take defaultMaxRowCount', function () {
		var maxRowCountOfAPage = 10; 
		var allRowCountOfPages = 101;
		pager = new Pager(allRowCountOfPages, maxRowCountOfAPage);
		pager.setMaxRowCountOfApage(12);
		should.equal(pager.getMaxRowCountOfApage(),12)
	});
	describe('#pageCount', function () {
		it('should take pageCount', function () {
			var pager = new Pager(101, 10);
			var pageCount = pager.getPageCount();
			should.equal(pageCount, 11); //  101/10  + 1
		});
		it('should take pageCount with 0', function () {
			var pager = new Pager(0, 10);
			var pageCount = pager.getPageCount(); 
			should.equal(pageCount, 0); //  0/10  + 1
		});
		it('should take pageCount with 1', function () {
			var pager = new Pager(1, 10);
			var pageCount = pager.getPageCount(); 
			should.equal(pageCount, 1); //  1/10  + 1
		});
	})
	describe('#getStartAndEndRowNumBy',function () {
		it('should take startAndEnd with 정상값', function () {
			var pager = new Pager(101, 10);
			var startAndEnd = pager.getStartAndEndRowNumBy(1);
			var startAndEnd2 = pager.getStartAndEndRowNumBy(10);
			var startAndEnd3 = pager.getStartAndEndRowNumBy(11);
			
			should.equal(startAndEnd.start, 1);
			should.equal(startAndEnd.end, 10);
			should.equal(startAndEnd2.start, 91);
			should.equal(startAndEnd2.end, 100);
			should.equal(startAndEnd3.start, 101);
			should.equal(startAndEnd3.end, 101);
		})
		it('should take startAndEnd with 경계값', function () {
			var pager = new Pager(101, 10);
			var startAndEnd = pager.getStartAndEndRowNumBy(0); 
			var startAndEnd2 = pager.getStartAndEndRowNumBy(15);
//			var startAndEnd3 = pager.getStartAndEndRowNumBy(null);
			
			should.equal(startAndEnd.start, 1);
			should.equal(startAndEnd.end, 10);
			should.equal(startAndEnd2.start, 101);
			should.equal(startAndEnd2.end, 101);
		})
	}) 
	
	
});
