/**
 *  #주의 
 *    1) 배쉬에 config 추가해야되서 cloudinaryTest.sh 로 실행
 *    2) 업로드에 시간이 걸리므로.... timeout 을 10초로잡음.
 *    
 *    
 *  # 특징
 *   - 중복된 이름으로 업로드하면 덮어쓰기됨.
 *   - var options = {use_filename:true, folder:'userId'}
 *     : 이름이 중복되었을시 중복없게 만들어줌.(덮어쓰기방지)
 *     : 클라우더리 세팅에서 auto_create_folder를 true로 해주면 폴더자동생성됨.
 *       : media library에서는 전체가 보여지므로 select folder로 특정 폴더선택하면됨. 
 *   - 세팅에서 폴더 enable로 해놓으면 public_id:'userId/test1' 이런형태로 업로드시 자동 폴더생성.
 *   
 *   - callback(result)
 *     ; result에 err, data모두 전달된다. error 프로퍼티가 있으면 에러임.
 *     ; catch가 동작안함.
 */

var config = require('../../config.js')
  , cloudinaryConfig = config.cloudinary
var cloudinary = require('cloudinary')
cloudinary.config({ 
  cloud_name: cloudinaryConfig.name,   
  api_key: cloudinaryConfig.key, 
  api_secret: cloudinaryConfig.secret 
});

describe('cloudinary',function () {
	this.timeout(10000) // timeout setting
	it('should success what file upload and remove', function (nextTest) {
		var filePath = __dirname +"/test.jpg"
		//tag 뭔용도지? 검색을위해?
//		cloudinary.uploader.upload(filePath, null,  {tags: [ 'special', 'for_homepage' ]})
		var options = {use_filename:true, folder:'userId'}
		
			cloudinary.uploader.upload(filePath, null, options)
			.then(function(result) {
				
				if(result.error) console.log('error ',result.error)
//				console.log(result)
				return cloudinary.uploader.destroy(result.public_id)
			})
			.then(function(result) {
//				console.log('----------t')
//				console.log(result) // 삭제는 결과가 undefined??이기도하고 {result:ok}이기도하네.
				nextTest()
			})
			.catch(function (err) {
//				console.log('----------c')
//				console.log('e',err)
				nextTest()
			})
	})
})