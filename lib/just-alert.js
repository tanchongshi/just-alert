;(function(win ,hj){

	var doc = win.document;

	/**
	 *	创建蒙层 
	 */

	//蒙层构造函数
	var Overlay = function() {
		this.shadow = null;
	}

	//扩展蒙层原型
	Overlay.prototype = {
		createShadow : function() {
			this.shadow = document.createElement('div');
			this.shadow.setAttribute('class', 'u-h-shadow');
			doc.body.appendChild(this.shadow);
		},
		show : function() {
			this.destroy();
			if(!this.shadow || !this.shadow.parentNode) {
				this.createShadow();
			}
			this.shadow.style.display = "block";
		},
		hide : function() {
			if(!this.shadow) {
				this.createShadow();	
			}
			this.shadow.style.display = 'none';
		},
		destroy: function() {
			if(this.shadow&&this.shadow.parentNode) {
				this.shadow.parentNode.removeChild(this.shadow); //确保只保留一个shadow
			}
		}
	}
	//提供给alert弹出框使用
	win.layer = new Overlay();

	/**
	 *	创建透明蒙层
	 */
	var TransOverlay = function() {
		this.shadow = null;
	}

	//扩展透明蒙层原型
	TransOverlay.prototype = {
		createShadow : function() {
			this.shadow = document.createElement('div');
			this.shadow.setAttribute('class', 'u-h-trans-shadow');
			doc.body.appendChild(this.shadow);
		},
		show : function() {
			this.destroy();
			if(!this.shadow || !this.shadow.parentNode) {
				this.createShadow();
			}
			this.shadow.style.display = "block";
		},
		hide : function() {
			if(!this.shadow) {
				this.createShadow();	
			}
			this.shadow.style.display = 'none';
		},
		destroy: function() {
			if(this.shadow&&this.shadow.parentNode) {
				this.shadow.parentNode.removeChild(this.shadow); //确保只保留一个shadow
			}
		}		
	}

	win.transLayer = new TransOverlay();

	/**
	 *	创建弹出框
	 */

  //弹出层构造函数
	var Alert = function(options, callback){

		var keepOnlyObj = document.getElementById('keepAlerOnlyId');
		if(keepOnlyObj && keepOnlyObj.parentNode) {
			keepOnlyObj.parentNode.removeChild(keepOnlyObj); //确保只保留一个alert
		}
		this.winPop = document.createElement('div');//弹出的对画框body
		this.btnLeftVal = '确定'; //按钮文字
		for(var i in options) {
			this[i] = options[i];
		}
		if(this.valContent && options.confirm == 'confirm'){ // 有取消按钮对话框
			layer.show();
			this.createConfirmWin();
		} else if(options.actFlag == 'qqCpAlert') { //qq 对话框
			layer.show();
			this.createActQqCpAlert();
		} else if(options.actFlag == 'qqCpConfirm') { //优惠券确认框
			layer.show();
			this.createActQqCpConfirm();
		} else { //提示对话框
			layer.show();
			this.createAlertWin();			
		}

	};

	//扩展弹出层原型
	Alert.prototype = {

		ce: function(ele) {return doc.createElement(ele);},

		// 创建弹出框公共框架
		createCommonDiv: function(parames){

			var prefix = parames || ""; //对话框类型标识符
			this.winPop.setAttribute('class', prefix + ' u-h-alert');
			this.winPop.setAttribute('id', 'keepAlerOnlyId');
			this.contentTop = this.ce('div');// 顶部
			this.closeItem = this.ce('a'); //右上角关闭按钮
			this.contentShow = this.ce('div');// 内容 外层
			this.contentSpn =  this.ce('span');// 里面放内容
			this.confirmBtn = this.ce('div');//底部按扭外层
			this.confirmLeft = this.ce('div'); 
			this.confirmRight = this.ce('div'); 
			this.closeItem.setAttribute('class', 'h_alert_close');
			this.contentTop.setAttribute('class', 'h_alert_top');
			this.contentShow.setAttribute('class', 'h_alert_body');
			this.contentSpn.setAttribute('class', 'h_alert_body_content');
			this.confirmBtn.setAttribute('class', 'h_alert_bottom');
			this.confirmLeft.setAttribute('class', 'h_alert_bottom_left');
			this.confirmRight.setAttribute('class', 'h_alert_bottom_right');
			this.contentShow.appendChild(this.contentSpn);
			this.confirmBtn.appendChild(this.confirmLeft);
			this.confirmBtn.appendChild(this.confirmRight);
			this.winPop.appendChild(this.closeItem);
			this.winPop.appendChild(this.contentTop);
			this.winPop.appendChild(this.contentShow);
			this.winPop.appendChild(this.confirmBtn);
			if(this.valContent)
			this.contentSpn.innerHTML = this.valContent;//第一个参数
			if(this.valTitle)
			this.contentTop.innerHTML = this.valTitle;//第二个参数
			doc.body.appendChild(this.winPop);
		},

		//弹出层居中
		centerWindow: function(ele) {
			var topheight = parseInt($('.mi').scrollTop());
			topheight = !isNaN(topheight)?topheight:0;
			ele.style.left = (win.innerWidth - ele.offsetWidth) / 2 + 'px';
			ele.style.top = (doc.documentElement.clientHeight - ele.offsetHeight) / 2 +topheight+ 'px';
		},

		//创建弹出tips
		createAlertWin: function(){

			var _self = this;
			//创建对话框框架
			var cls = 'h_alert_tips'
			if(_self.tipsCls) { //设置新ui
				cls = 'h_alert_tips ' + _self.tipsCls;
			}
			this.createCommonDiv(cls);
			var smallBtn = _self.ce('div');//底部按扭内层
			smallBtn.setAttribute('class','h_alert_btn');
			if(_self.btnLeftVal)
			smallBtn.innerHTML = _self.btnLeftVal;	
			this.confirmLeft.appendChild(smallBtn);
			if(_self.closeCallback&&_self.tipsCls) { //如果右上角有关闭按钮显示 样式自定义和回调函数
				if(justJs.IS_ANDROID) {
					_self.closeItem.addEventListener("click", function(e){
						_self.hide();
						_self.closeCallback && _self.closeCallback();
		        e.preventDefault();					
					})
				} else {
					_self.closeItem.addEventListener("touchend", function(e){
						_self.hide();//隐藏对画框
						_self.closeCallback && _self.closeCallback();
		        e.preventDefault();					
					})
				}
			}
			if(justJs.IS_ANDROID) {
				smallBtn.addEventListener("click", function(e){
					_self.hide();
					_self.callback && _self.callback();
	        e.preventDefault();					
				})
			} else {
				smallBtn.addEventListener("touchend", function(e){
					_self.hide();//隐藏对画框
					_self.callback && _self.callback();
	        e.preventDefault();					
				})
			}
			this.centerWindow(this.winPop);
		},		

		//创建confirm
		createConfirmWin: function(){

			var _self = this;
			this.createCommonDiv('h_alert_confirm');
			var smallConBtn = _self.ce('div');//确定
			var smallCanBtn = _self.ce('div');//取消
			smallConBtn.setAttribute('class','h_alert_btn_l');
			smallCanBtn.setAttribute('class','h_alert_btn_r');
			smallConBtn.innerHTML = '确定';
			smallCanBtn.innerHTML = '取消';
			this.confirmLeft.appendChild(smallConBtn);
			this.confirmRight.appendChild(smallCanBtn);
			
			if(justJs.IS_ANDROID) {
				//确定
				smallConBtn.addEventListener("click", function(e){
					_self.hide();
					_self.callback && _self.callback();
          e.preventDefault();					
				})
				//取消
				smallCanBtn.addEventListener("click", function(e){
					_self.hide();
          e.preventDefault();					
				})
			} else {
				//确定
				smallConBtn.addEventListener("touchend", function(e){
					_self.hide();
					_self.callback && _self.callback();
          e.preventDefault();
				})
				//取消
				smallCanBtn.addEventListener("touchend", function(e){
					_self.hide();
          e.preventDefault();
				})
			}
			this.centerWindow(this.winPop);
		},	

		//创建qq活动券对话框
		createActQqCpAlert: function() {

			var _self = this;
			//创建对话框框架
			var cls = 'h_alert_qqCp'
			if(_self.tipsCls) { //设置新ui
				cls = 'h_alert_qqCp ' + _self.tipsCls;
			}
			_self.createCommonDiv(cls);
			_self.contentTop.appendChild(_self.ce('div'));//顶部图标
			var topTitle = _self.ce('div'); //顶部标题
			var realTitle = _self.ce('div'); //real标题
			realTitle.setAttribute('class', 'u-btn topBtn');
			if(_self.cpTitle)
			realTitle.innerHTML = _self.cpTitle;
			topTitle.appendChild(realTitle);
			var qqCloseItem;
			if(_self.isInput || _self.rightTopClose == 'N') { //只有弹出框需要输入手机号或者有分享按钮才有关闭
				qqCloseItem = _self.ce('a');
				topTitle.appendChild(qqCloseItem); //顶部关闭按钮				
			} 
			_self.contentTop.appendChild(topTitle);
			var divBodyTitle = _self.ce('div'); //body 文案
			divBodyTitle.setAttribute('class', 'divBodyTitleCls');
			if(_self.bodyTitle)
				divBodyTitle.innerHTML = _self.bodyTitle;
			_self.contentSpn.appendChild(divBodyTitle);
			if(_self.isInput) {
				var mainInput = _self.ce('input'); //input
				mainInput.setAttribute('type', 'number');
				mainInput.setAttribute('class', 'u-form-control');
				_self.contentSpn.appendChild(mainInput);	
				// android键盘会挡住input兼容性问题
					//依赖zepto
				$(mainInput).on('click', function() {
					//$('#keepAlerOnlyId').css('position', 'absolute');
					//$('#cp-wrapId').scrollTop(0);
				});

			}
			var pTips = _self.ce('p'); //body tips
			if(_self.bodyTips)
			pTips.innerHTML = _self.bodyTips;
			_self.contentSpn.appendChild(pTips);
			var smallBtn = _self.ce('input');//底部按扭内层
			smallBtn.setAttribute('type', 'button');
			smallBtn.setAttribute('class','u-btn u-btn-common');
			if(_self.btnLeftVal)
			smallBtn.setAttribute('value', _self.btnLeftVal);	
			_self.confirmLeft.appendChild(smallBtn);

			if(justJs.IS_ANDROID) {

				if(qqCloseItem) {
					qqCloseItem.addEventListener("click", function(e){ //关闭按钮
						_self.hide();
						_self.closeCallback && _self.closeCallback();
		        e.preventDefault();					
					})					
				}


				smallBtn.addEventListener("click", function(e){
					_self.hide();//隐藏对画框
					if(_self.callback && _self.callback(mainInput, _self, smallBtn)) {
						_self.hide();
					}
	        e.preventDefault();					
				})

			} else {

				if(qqCloseItem) {
					qqCloseItem.addEventListener("touchend", function(e){
						_self.hide();//隐藏对画框
						_self.closeCallback && _self.closeCallback();
		        e.preventDefault();					
					})					
				}


				smallBtn.addEventListener("touchend", function(e){
					_self.hide();//隐藏对画框
					if(_self.callback && _self.callback(mainInput, _self, smallBtn)) {
						_self.hide();//隐藏对画框
					}
	        e.preventDefault();					
				})

			}

			this.centerWindow(this.winPop);

		},	

		//创建qq活动券确定框
		createActQqCpConfirm: function() {

			var _self = this;
			//创建对话框框架
			var cls = 'h_confirm_qqCp'
			if(_self.tipsCls) { //设置新ui
				cls = 'h_confirm_qqCp ' + _self.tipsCls;
			}
			_self.createCommonDiv(cls);
			_self.contentTop.appendChild(_self.ce('div'));//顶部图标
			var topTitle = _self.ce('div'); //顶部标题
			var realTitle = _self.ce('div'); //real标题
			realTitle.setAttribute('class', 'u-btn topBtn');
			if(_self.cpTitle)
			realTitle.innerHTML = _self.cpTitle;
			topTitle.appendChild(realTitle); 
			if(!_self.btnBuyFlag) {
				var qqCloseItem = _self.ce('a');
				topTitle.appendChild(qqCloseItem); //顶部关闭按钮				
			}
			_self.contentTop.appendChild(topTitle);
			var divBodyTitle = _self.ce('div'); //body 文案
			divBodyTitle.setAttribute('class', 'divBodyTitleCls');
			if(_self.bodyTitle)
				divBodyTitle.innerHTML = _self.bodyTitle;
			_self.contentSpn.appendChild(divBodyTitle);
			var pTips = _self.ce('p'); //body tips
			if(_self.bodyTips)
			pTips.innerHTML = _self.bodyTips;
			_self.contentSpn.appendChild(pTips);
			var leftBtn = _self.ce('span');//底部按扭
			leftBtn.setAttribute('class','u-btn u-btn-common');
			if(_self.btnLeftVal)
				leftBtn.innerHTML = _self.btnLeftVal;	
			var rightBtn = _self.ce('span');//底部按扭
			rightBtn.setAttribute('class','u-btn u-btn-common');			
			if(_self.btnRightVal)
				rightBtn.innerHTML = _self.btnRightVal;
			_self.confirmLeft.appendChild(leftBtn);
			_self.confirmRight.appendChild(rightBtn);
			if(justJs.IS_ANDROID) {

				if(qqCloseItem) {
					qqCloseItem.addEventListener('click', function(e){ //监听关闭按钮
						_self.hide();
						_self.closeCallback && _self.closeCallback();
		        e.preventDefault();					
					})
				}

				leftBtn.addEventListener('click', function(e){ //监听左侧按钮
					_self.hide();
					_self.leftCallback && _self.leftCallback();
	        e.preventDefault();					
				})

				rightBtn.addEventListener('click', function(e){ //监听右侧按钮
					_self.hide();
					_self.rightCallback && _self.rightCallback();
	        e.preventDefault();					
				})	

			} else {

				if(qqCloseItem) {
					qqCloseItem.addEventListener("touchend", function(e){ 
						_self.hide();//隐藏对画框
						_self.closeCallback && _self.closeCallback();
		        e.preventDefault();					
					})
				}

				leftBtn.addEventListener('touchend', function(e){
					_self.hide();//隐藏对画框
					_self.leftCallback && _self.leftCallback();
	        e.preventDefault();					
				})

				rightBtn.addEventListener('touchend', function(e){
					_self.hide();//隐藏对画框
					_self.rightCallback && _self.rightCallback();
	        e.preventDefault();					
				})				
			}
			this.centerWindow(this.winPop);

		},

		///隐藏
		hide : function(){
			if(this.winPop && this.winPop.parentNode) {
				this.winPop.parentNode.removeChild(this.winPop);
			}
			layer.hide();
		}
	};

	/**
	 *	创建吐司
	 */

	var Toast = function() {
		this.toast = null;
		this.toastVal = null;
		this.status = 0;
	}
	//扩展吐司原型
	Toast.prototype = {
		createToast : function() {
			this.toast = document.createElement('div');
			this.toast.setAttribute('class', 'u-h-toast');
			this.toastVal = document.createElement('div');
			this.toastVal.setAttribute('class', 'u_toast_val');
			this.toast.appendChild(this.toastVal);
			doc.body.appendChild(this.toast);
		},
		//弹出层居中
		centerWindow: function(ele) {
			ele.style.left = (win.innerWidth - ele.offsetWidth) / 2 + 'px';
			ele.style.top = (doc.documentElement.clientHeight - ele.offsetHeight) / 2 + 'px';
		},		
		show : function(val) {
			var _this = this;
			if(!_this.toast) {
				_this.createToast();
			}
			if(_this.status == 1) { //一个阶段只能有一个toaster
				return;
			}
			_this.toastVal.innerHTML = val;
			_this.toast.setAttribute('class', 'u-h-toast u_toast_show');
			_this.centerWindow(this.toast); //Div block 才能获得高度
			_this.status = 1;
			setTimeout(function() {
				_this.hide();
			}, 1200);
		},
		hide : function() {
			var _this = this;
			if(!_this.toast) {
				_this.createToast();	
			}
			_this.toast.setAttribute('class', 'u-h-toast u_toast_hide');
			justJs.webkitAnimationEnd({ele:_this.toast, time:600}, function() {
				_this.status = 0;
				_this.toast.setAttribute('class', 'u-h-toast u_toast_none');
			});
			//_this.toast.style.display = 'none';
		}
	}

	justJs.Alert = Alert;
	justJs.Toast = new Toast();
	
})(window, justJs);
