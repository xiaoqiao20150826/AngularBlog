/**
 *  재활용될수도 있는 코드. 참조할수있는
 */

//					// 그룹화	
//			var groups = _.groupBy(list, function(o){return o._id.year});
//			_.each(groups, function (yvalues, ykey, ylist) {
//				mgroups = _.groupBy(yvalues, function(o){return o._id.month});
//				ylist[ykey] = mgroups;
//				
//				_.each(mgroups, function (mvalues, mkey, mlist) {
//					dgroups = _.groupBy(mvalues, function(o){return o._id.dayOfMonth});
//					mlist[mkey] = dgroups;
//				})
//			});


						//    쿼리
// 비슷한 쿼리할때 사용하자.
//있으면 업데이트가 아니라, 없으면 업데이트인데..조건을 잘못줌.
////실패시 빈 post 객체 반환
//postDAO.findPostOrUpdateVoteAndVotedUserId = function(done, num, userId) {
//done.hook4dataFn(Post.createBy);
////var where = { num : num }
//var where = { num : num, votedUserIds : userId }
//var update ={ $inc:{ vote:1}
//			, $addToSet: { votedUserIds : userId }
//			};
//var options =  {upsert: false , multi:true}
//_db.findOneAndUpdate(where, update, options, done.getCallback());
//};

//   mongoose에 group함수는 안되서 aggregate로 변경. 
//   [] 전달시 파이프라인 사용이다.
// @return : {_id:'', count:0}; 
//answerDAO.getCountsByPosts = function (done, posts) {
//	var postNums = [];
//	for(var i in posts) { postNums.push(posts[i].num); }
//	
//	var match = {$match : {postNum: {$in : postNums} }  };
//	var group = {$group : {_id : '$postNum' ,count : {$sum: 1} }  };
//	var sort = {$sort : {_id: 1} };
//	
//	
//	_db.aggregate([match, group, sort])
//	   .exec(done.getCallback());
//};
//
					