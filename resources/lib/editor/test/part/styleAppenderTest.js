/**
 * 
 */
var expect = chai.expect
var log = $$namespace.require('htmlLoger').log

var styleAppender = $$namespace.require('/part/styleAppender')

//이것만 새로추가해서 테스트.
describe('styleAppender # createSpanInheritStyle', function () {
	it('should copy all parent span style before P Node', function () {
		var $span1 = $('<span></span>') 
		  , $span2 = $('<span></span>') 
		  , $span3 = $('<span></span>')
		  , $line = $('<p></p>')
		$span1.css('font-weight','bold')
		$span1.css('background-color','red')
		$span2.css('background-color','yellow')
		$span3.css('font-size','3pt')
		
		$line.append($span1)
		$span1.append($span2)
		$span2.append($span3)
		
		var styleMap = styleAppender.getInheritedSytleMap($span3)
		expect(styleMap['font-weight']).to.equal($span1.css('font-weight'))
		expect(styleMap['background-color']).to.equal($span1.css('background-color'))
		expect(styleMap['font-size']).to.equal($span3.css('font-size'))
	})
	
})