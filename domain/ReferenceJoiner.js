/**
 *  문서의 참조를 실제문서로 조인한다.
 *  
 *  - 사용예
 *   : 	var rj = new ReferenceJoiner(posts, 'userId', 'user');
 *		var joinedPosts = rj.join(users, '_id', emptySource)
 */
var _ = require('underscore')
var U = require('../common/util/util.js')




var ReferenceJoiner = module.exports = function ReferenceJoiner(targets, targetKey, newTargetKey) {
	if(!_.isArray(targets)) targets = [targets];
	
	this.targets = targets;
	this.targetKey = targetKey;
	this.newTargetKey = newTargetKey;
	this.isJoinMany = false;
};

ReferenceJoiner.prototype.joinOne = function (sources, sourceKey, emptySource) {
	this.isJoinMany = false;
	return this.join(sources, sourceKey, emptySource);
}
ReferenceJoiner.prototype.joinMany = function (sources, sourceKey, emptySource) {
	this.isJoinMany = true;
	return this.join(sources, sourceKey, emptySource);
}



ReferenceJoiner.prototype.join = function (sources, sourceKey, emptySource) {
	if(!_.isArray(sources)) sources = [sources];
//	if(U.notExist(emptySource)) throw new Error('need to replace emptySource when target not found source')
	
	return this.targetsJoin(sources, sourceKey, emptySource);
}
ReferenceJoiner.prototype.targetsJoin = function(sources, sourceKey, emptySource) {
	var targets = this.targets;
	
	var joinedTargets = [];
	for(var i in targets) {
		var target = targets[i]
		var newTarget =this.targetJoin(target, sources, sourceKey, emptySource)
		
		joinedTargets.push(newTarget);
	}
	
	return joinedTargets;
}

ReferenceJoiner.prototype.targetJoin = function(target, sources, sourceKey, emptySource) {
	if(this.isJoinMany) 
		return this.targetJoinMany(target, sources, sourceKey, emptySource)
	else 
		return this.targetJoinOne(target, sources, sourceKey, emptySource)
}

ReferenceJoiner.prototype.targetJoinOne = function(target, sources, sourceKey, emptySource) {
	var targetKey = this.targetKey
	  , newTargetKey = this.newTargetKey
	  , target = target
	  , targetValue = target[targetKey]
	
	
	if(U.notExist(targetValue)) return target;
	
	for(var i in sources) {
		var source = sources[i]
		  , sourceValue = source[sourceKey];
		if(U.notExist(sourceValue)) continue;
		
		if(U.isEqual(sourceValue, targetValue)) {
			target[newTargetKey] = source;
			break;
		} 
	}
	if(U.notExist(target[newTargetKey])) { target[newTargetKey] = emptySource; 	}
	return target
}
ReferenceJoiner.prototype.targetJoinMany = function(target, sources, sourceKey, emptySource) {
	var targetKey = this.targetKey
	  , newTargetKey = this.newTargetKey
	  , target = target
	  , targetValue = target[targetKey]
	
	
	if(U.notExist(targetValue)) return target;
	
	if(U.notExist(target[newTargetKey])) target[newTargetKey] = [];
	
	for(var i in sources) {
		var source = sources[i]
		  , sourceValue = source[sourceKey];
		if(U.notExist(sourceValue)) continue;
		
		if(U.isEqual(sourceValue, targetValue)) {
			var newTargetValue = target[newTargetKey];
			newTargetValue.push(source);
		} 
	}
	
	var newTargetValue = target[newTargetKey];
	if(_.isEmpty(newTargetValue)) { 
		newTargetValue.push(emptySource);
		if(U.notExist(emptySource)) target[newTargetKey] = null;
	}
	
	return target
}



