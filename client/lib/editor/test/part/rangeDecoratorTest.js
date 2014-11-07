/**
 * 
 */
var expect = chai.expect
var log = $$namespace.require('htmlLoger').log

var rangeDecorator = $$namespace.require('/part/rangeDecorator')

describe('rangeDecorator', function () {
	
	var $text1, $text2
	var $span1
	var $line11
	
	var $body
	var spanHtml
	beforeEach(function () {
		//  span1  span2  span3
		$text1 = $(document.createTextNode('text1'))
		$text2 = $(document.createTextNode('text2'))
		$span1 = $('<span></span>',{id:'span1'})
		$line11 = $('<p></p>',{class:'line'})
		$body = $('body')
		//
		//
		lineHtml = $body.find('p').html()
		$('p').css('border','yellow solid 1px')
		$('span').css('border','gray solid 1px')
	})
	afterEach(function () {
		$('.line').remove()
	})
//    //하나의 텍스트를 start, endoffset을 이용하여 span노드로 만들기.
	it('should fileter textNodes by offset', function () {
		$line11.append(document.createTextNode('text1'))
		$body.prepend($line11)
		var $textNodes = $([$text1[0]]) //.first()하니까 제대로된 노드가 안나옴.
		  , textLength = 5;
		
		var texts1 = rangeDecorator.filteredTextNodes($textNodes, 1, 1)
		expect(texts1.length).to.equal(3)
		expect(texts1[0]).to.equal("t")
		expect(texts1[1]).to.equal("")
		var texts2 = rangeDecorator.filteredTextNodes($textNodes, 0, textLength)
		expect(texts2.length).to.equal(1)
		expect(texts2[0]).to.equal("text1")
		var texts3 = rangeDecorator.filteredTextNodes($textNodes, textLength, textLength)
		expect(texts3.length).to.equal(1)
		expect(texts3[0]).to.equal("text1")
		//캐럿일경우 가운데 항상 버리지않음.
		var texts4 = rangeDecorator.filteredTextNodes($textNodes, textLength, textLength, true) 
		expect(texts4.length).to.equal(2)
		expect(texts4[1]).to.equal("")
	})
	
	describe('#replaceNode(news, old)', function () {
		var $line1, $line2
		var $parentSpan1, $parentSpan2
		var $span1, $span2, $span3, $span4
		var $text1,$text2,$text3,$text4
		beforeEach(function() {
			$line1=$('<p></p>')
			$line2=$('<p></p>')
			$parentSpan1 = $('<span style="font-weight:bold">parentSpan1</span>');
			$parentSpan2 = $('<span style="background-color:red">parentSpan2</span>');
			$text1 = $(document.createTextNode('text1')); $text2 = $(document.createTextNode('text2'));
			$text3 = $(document.createTextNode('text3')); $text4 = $(document.createTextNode('text4'));
			$span1=$('<span>s1</span>'); $span2=$('<span>s2</span>'); $span3=$('<span>s3</span>');
			$span4=$('<span>s4</span>'); $span5=$('<span>s5</span>');
			
			$('<body></body>').append($line1, $line2)
		})
		//형제노드까지..다...
		it('#replaceNode(new, old) if parent of old is lineNode', function () {
			var $spans = $([$span1[0], $span2[0], $span3[0]]) //유사상황을위해.. 
			$line1.append($text1)
			$line1.append($text2)
			$line1.append($span4)
			$line1.append($span5)
			rangeDecorator.replaceNode($spans, $text2) //side-effect
			
			expect($line1[0].childNodes[3]).to.equal($span3[0])
		})
		//부모가 span일경우는 자식들 그 위치로 독립시켜버려.
		it('#replaceNode(new, old) if parent of old is spanNode', function () {
			var $spans = $([$span1[0], $span2[0], $span3[0]]) //유사상황을위해.. 
			$parentSpan1.append($text1)
			$parentSpan1.append($text2)
			$parentSpan1.append($span4)
			$parentSpan1.append($span5)
			$line1.append(document.createTextNode('before'))
			$line1.append($parentSpan1)
			$line1.append(document.createTextNode('after'))
			
			rangeDecorator.replaceNode($spans, $text2) //side-effect
			expect($line1.children().children().length).to.equal(5)
			expect($line1.children().children()[3]).to.equal($span4[0])
		})

		//one span in line1...
		it('#decroateByRange should be run', function () {
			$parentSpan1.append([$text1,$span1,$span2,$span3,$text2])
			$line1.append([document.createTextNode('before'), $parentSpan1, document.createTextNode('after')])
			var range = { startContainer: $text1[0], endContainer: $text2[0]
			, startOffset:2, endOffset:3 }
			
			var spans = rangeDecorator.decorateSpanByRange(range)
			expect(spans[0].textContent).to.equal('xt1')
			expect(spans[spans.length-1].textContent).to.equal('tex')
		})
		//two span in one line..
		it('#decroateByRange should be run2', function () {
			$parentSpan1.append([$text1,$span1])
			$parentSpan2.append([$span2,$span3,$text2])
			$line1.append([ document.createTextNode('before')
			             , $parentSpan1, document.createTextNode('middle'), $parentSpan2
			             , document.createTextNode('after')
			             ])
			var range = { startContainer: $text1[0], endContainer: $text2[0]
			, startOffset:2, endOffset:3 }
			var spans = rangeDecorator.decorateSpanByRange(range)
			expect(spans[0].textContent).to.equal('xt1')
			expect(spans[0].style['font-weight']).to.equal('bold')
			expect(spans[spans.length-1].textContent).to.equal('tex')
			expect(spans[spans.length-1].style['background-color']).to.equal('red')
		})
		//two span and two line
		it('#decroateByRange should be run3', function () {
			$parentSpan1.append([$text1,$span1,$text2,$span2])
			$parentSpan2.append([$span3,$text3,$span4, $text4])
			$line1.append([ document.createTextNode('before')
			              , $parentSpan1
			              ])
			$line2.append([ $parentSpan2
			              , document.createTextNode('after')
			              ])
           var range = { startContainer: $text1[0], endContainer: $text4[0]
					   , startOffset:2, endOffset:3 }
			
			var spans = rangeDecorator.decorateSpanByRange(range)
			expect(spans[0].textContent).to.equal('xt1')
			expect(spans[0].style['font-weight']).to.equal('bold')
			expect(spans[spans.length-1].textContent).to.equal('tex')
			expect(spans[spans.length-1].style['background-color']).to.equal('red')
		})
		//위와 같은데.. style 추가까지해보자.
		it('#decroateByRange should be run3', function () {
			$parentSpan1.append([$text1,$span1,$text2,$span2])
			$parentSpan2.append([$span3,$text3,$span4, $text4])
			$line1.append([ document.createTextNode('before')
			                , $parentSpan1
			                ])
			                $line2.append([ $parentSpan2
			                                , document.createTextNode('after')
			                                ])
			                                var range = { startContainer: $text1[0], endContainer: $text4[0]
			, startOffset:2, endOffset:3 }
			
			var startAndEndTextNode = rangeDecorator.decorate(range, 'background-color:yellow')
			var line2last = $line2.children().length-1
			
			expect($line1.children()[0].style['font-weight']).to.equal('bold')
			expect($line1.children()[0].style['background-color']).to.equal('')
			expect($line2.children()[0].style['background-color']).to.equal('yellow')
			expect($line2.children()[line2last].style['background-color']).to.equal('red')
			expect(startAndEndTextNode[0].textContent).to.equal('xt1')
			expect(startAndEndTextNode[1].textContent).to.equal('tex')
		})
		///////  가운데 캐럿!
		it('#decroateByRange should be run by caret', function () {
			$parentSpan1.text("")
			$parentSpan1.append([$text1,$span1,$span2,$span3])
			$line1.append($parentSpan1)
			var range = { startContainer: $text1[0], endContainer: $text1[0]
				        , startOffset:1, endOffset:1 }
			
			var spans = rangeDecorator.decorateSpanByRange(range)
			expect(spans[0].textContent).to.equal('')
		})
		// 왼쪽 캐럿
		it('#decroateByRange should be run by caret', function () {
			$parentSpan1.text("")
			$parentSpan1.append([$text1,$span1,$span2,$span3])
			$line1.append($parentSpan1)
			var range = { startContainer: $text1[0], endContainer: $text1[0]
			, startOffset:0, endOffset:0 }
			
			var spans = rangeDecorator.decorateSpanByRange(range)
			expect(spans[0].textContent).to.equal('')
		})
		// 오른쪽캐럿.
		it('#decroateByRange should be run by caret', function () {
			$parentSpan1.text("")
			$parentSpan1.append([$text1,$span1,$span2,$span3])
			$line1.append($parentSpan1)
			var range = { startContainer: $text1[0], endContainer: $text1[0]
			, startOffset:4, endOffset:4 }
			
			var spans = rangeDecorator.decorateSpanByRange(range)
			expect(spans[0].textContent).to.equal('')
		})
	})
	
})
