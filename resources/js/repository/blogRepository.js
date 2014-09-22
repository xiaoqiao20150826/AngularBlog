/**
 *   블로그에 해당하는 view의 모든 데이터 통제.
 */



$$namespace.include(function (require, module) {
	var H = require('helper')
	  , Pager= this.require('/domain/blogBoard/Pager') 
	  , Tab= this.require('/domain/blogBoard/Tab')
	  , Category= this.require('/domain/blogBoard/Category')
	  , Post = this.require('/domain/blogBoard/Post')
	
	var blogMap = {}
	
	var blogRepository = module.exports = {}

	blogRepository.init = function () {
		
		blogMap.pager = new Pager()
		blogMap.category = new Category()
		blogMap.tab = new Tab()
		//히스토리에 영향을 받지 않는 상태
		blogMap.post = new Post()
		blogMap.searcher = ''
	}
	
	blogRepository.initPager = function () {
		blogMap.pager = new Pager({});
	}
	//TODO: 현재는 '현재상태'를 저장하는 용도인데. 
    //'클릭된 상태'를 기억해야지 맞는것일까?
	blogRepository.savePost = function(post) {
		if(post.num == 0) return //히스토리에 undo 호출될 경우.방지. 
		
		blogMap.post = post;
	}
	blogRepository.savePager = function(pager) {
		blogMap.pager = pager;
	}
	blogRepository.saveTab = function (tab) {
		blogMap.tab = tab;
	}
	blogRepository.saveCategory = function (category) {
		blogMap.category = category;
	}
	blogRepository.saveSearcher = function (searcher) {
		//처음 단어 검색시에는 데이터를 초기화한다.(이후에는 페이저,탭등의 이력을 사용가능하게)
		var prevSearcher = blogMap.searcher
		this.init()
		blogMap.searcher = prevSearcher
		
		if(searcher == '') return
		blogMap.searcher = searcher;
	}
	//모든 상태
	blogRepository.getBlogMap = function () {
		return blogMap;
	}
	blogRepository.setBlogMap = function (_blogMap) {
		var prevPost = blogMap.post
		
		blogMap = _blogMap
		blogMap.post = prevPost
	}
	
})