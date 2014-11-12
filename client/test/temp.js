				   // $rootScope 변수이름을 사용하면 순환오류 발생하여.. $delegate로.
//				   $provide.decorator('$rootScope', function ($delegate) {
//					   var original$emit = $delegate.$emit
//					     , original$broadcast = $delegate.$broadcast
//					     
//					   var $$listeners = $delegate.$$listeners
//					   
////					     var registedEventNames = Object.keys($delegate.$$listeners)
//					   $delegate.$emit = function (name, args) {
//						   console.log('$emit(버블링) : ', arguments)
//						   console.log('	$$listeners : ',$$listeners)
//						   return original$emit.apply(this, arguments) //this.. $delegate가 아니라? 이 함수자체가 $delegate.$emit(..이렇게호출되나벼
//					   } 
//					   $delegate.$broadcast = function (name, args) {
//						   console.log('$broadcast(캡쳐링) : ' , arguments)
//						   console.log('	$$listeners : ',$$listeners)
//						   return original$broadcast.apply(this, arguments) //this.. $delegate가 아니라? 이 함수자체가 $delegate.$emit(..이렇게호출되나벼
//					   } 
//					   
//					   return $delegate
//				   })

///////////
	// Logger class
//	function Logger () {
//		  this._log  = console.log
//		  this._count = 0
//	}
//	Logger.prototype.log  = function (message) {
//		  var seqCount = '['+ (++this._count) +'] '  
//		  this._log(seqCount, message)
//	}