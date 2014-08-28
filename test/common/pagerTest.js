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
		it('should run', function () {
			var pager = new Pager(6,5);
			var startAndEnd = pager.getStartAndEndRowNumBy(1);
//			console.log(startAndEnd)
		})
	})
	describe('dataForView', function () {
		it('should get decreased maxCount', function () {
			var currentPageNum = 2;
			var maxPageCount = 5
			var pager = new Pager(20); //allRowCount  20/5   pageCount == 4
			var pager4view = pager.make4view(currentPageNum, maxPageCount)
			
			should.equal(pager4view.maxPageCount, 4)
		})
		// maxPageCount 이제 pageCount 보다 작거나 같다.
		it('should get start and end', function () {
			var currentPageNum = 2;
			var maxPageCount = 4
			var pager = new Pager(30); //allRowCount  30/5   pageCount == 6
			var pager4view = pager.make4view(currentPageNum, maxPageCount)
			should.equal(pager4view.startPageNum, 1)
			should.equal(pager4view.endPageNum, 4)
		})
		it('should get start and end', function () {
			var currentPageNum = 6;
			var maxPageCount = 4
			var pager = new Pager(30); //allRowCount  30/5   pageCount == 6
			var pager4view = pager.make4view(currentPageNum, maxPageCount)
			should.equal(pager4view.startPageNum, 3)
			should.equal(pager4view.endPageNum, 6)
		})
		describe('좀 더 넓은 범위에서.',function () {
			// 경계만 안넘게하면됨.
			it('should get leftPageNum and rightPageNum', function () {
				var currentPageNum = 6;
				var maxPageCount = 4
				var pager = new Pager(50); //allRowCount  30/5   pageCount == 6
				var pager4view = pager.make4view(currentPageNum, maxPageCount)
				should.equal(pager4view.startPageNum, 5)
				should.equal(pager4view.endPageNum, 8)
				should.equal(pager4view.existLeftPageNum(), true)
				should.equal(pager4view.existRightPageNum(), true)
				should.equal(pager4view.leftPageNum, 1)
				should.equal(pager4view.rightPageNum, 10)
//				console.log(pager4view)
			})			
		})
	})
	
	
	
});
