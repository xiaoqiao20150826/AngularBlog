/**
 * 
 */

$$namespace.include(function (require, module) {

	/*
	 * static field, dependency
	 */
	/*
	 * constructor , instance field
	 */
	var imageWrapper = require('event/content/imageWrapper')
	  , eventHelper = require('event/eventHelper')
	
	var imageListener = module.exports = {
			_mustBeRemovedCallBacks : null,
			init: function(editor) {
				this._editor = editor;
				this._contentBody = editor.getContentBody();
				
				this.addActions();
			},
			addActions: function() {
				//�̹���Ŭ���� span���� warpping�ϱ� ���� ������������ ���������� �ִ� �̺�Ʈ~
				this.addAction(eventHelper.EVENT.mousedown, this._downCallBack);
				this.addAction(eventHelper.EVENT.mouseup, this._upCallBack);//�̰� �������� ���������� �̺�Ʈ ����!				
				//���� warpped span������ ���ؼ�...�׷��� �������� ����� ������Ʈ�̹Ƿ� ���������� ������������ �̺�Ʈ�������.
				
			},
			addAction:function(eventType, callBack, target) {
				var targetNode = target || this._contentBody;
				var self = this;
				var useCapture = false;
				var	bindedCallBack = function bindedCallBack(e) {
						callBack.call(self,e);
					};
				
			
			this._saveCallBackmustBeRemoved(eventType, bindedCallBack, targetNode);	
			targetNode.addEventListener(eventType, bindedCallBack, useCapture);
			},
			_saveCallBackmustBeRemoved : function (eventType, callBack, target) {
				if(!(this._mustBeRemovedCallBacks)) {this._mustBeRemovedCallBacks= {};};
				this._mustBeRemovedCallBacks[eventType] = [target,callBack];
			},
			removeAction:function(eventType) {
				var entryMap = this._mustBeRemovedCallBacks;
				var key = eventType;
				if(entryMap[key]) {
					var targetAndCallBack = entryMap[key];
					if(targetAndCallBack != null) {
						var target = targetAndCallBack[0], callBack = targetAndCallBack[1]; 
						target.removeEventListener(eventType, callBack, false); //useCapture��..�����߾���ϳ�.
						entryMap[key] = null;
						return;
					}
				};
			},			
			_downCallBack: function (e) {
				var event = e || window.event,
					target = e.target || e.srcElement;
				
//				imageWrapper.dispose(); //Ȥ�ó� wappedImgNode�� �����ִٸ� ������.
//				this.removeAction(this._eventHelper.EVENT.mousemove);
				
				if(imageWrapper.isImageNode(target)) {
					imageWrapper.wrapImgNodeToSpanNode(target);
				}; 
				if(imageWrapper.isPartOfWrappedImage(target)) { //������ Ŭ���� ���콺�����̺�Ʈ�������
					imageWrapper.saveNodesMustBeUpdatedByPart(target);
					this.addAction(eventHelper.EVENT.mousemove, this._moveCallBack);
				};
				//�⺻�����ؾ��ϹǷ� stop�ϸ�ȵ�.
				
			},
			_moveCallBack: function _moveCallBack(e) {
				var event = e || window.event,
					target = e.target || e.srcElement
				var	currentX = event.clientX;
				//���콺�̵� �Ÿ� ����ؼ� �÷��� || ���̳ʽ� 1
				
				var movedWidth = imageWrapper.getMovedWidthByX(currentX);
				console.log("mousemove  " + movedWidth);
				imageWrapper.setPrevX(currentX);
				imageWrapper.updateSavedNodesWith(movedWidth);
				eventHelper.stop(event);
			},
			_upCallBack: function (e) { //TODO:���������� �ۿ��� ���Ǿ�����쿡�� �̵����� ����Ǿ���.
				var event = e || window.event,
				target = e.target || e.srcElement;
				
				if(!(imageWrapper.isImageNode(target))) {
					imageWrapper.dispose();
				}
				this.removeAction(eventHelper.EVENT.mousemove);
				//stop�ϸ� �⺻������ �ȵ�.(�̹����� �����ؼ� ����ϰ� ���ڸ� Ŭ���ϸ� ĳ���� Ŭ���� ��ġ�� �̵��̾ȵ�
			}
			
			
	};
});


//@ sourceURL=/lib/editor/event/content/imageListener.js