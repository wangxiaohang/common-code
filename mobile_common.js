// 定义独立的命名空间对象mobf，防止命名冲突
window.mobf = {};
/*
 *	添加或取消过渡
 *  d:要操作的dom对象
 *  b:true添加过渡，false取消过渡
 */
mobf.addTransition = function(d,b) {
	if(d && b) {
		d.style.transition = "all .5s";
		d.style.webkitTransition = "all .5s";
	}else if(d && !b){
		d.style.transition = "none";
		d.style.webkitTransition = "none";
	}
}
/*
 * 添加平移变换
 * d:要平移的dom对象
 * x/y:平移的水平/垂直距离
 */
mobf.translatex = function(d,x){
	if(!d || typeof d != "object"){
		return false;
	}
	d.style.transform = "translateX(" + x + "px)";
	d.style.webkitTransform = "translateX(" + x + "px)";
}
mobf.translatey = function(d,y){
	if(!d || typeof d != "object"){
		return false;
	}
	d.style.transform = "translateY(" + y + "px)";
	d.style.webkitTransform = "translateY(" + y + "px)";
}
/*
 * 绑定 过渡结束监听事件
 * d:dom对象 
 * callback:回调
 * 移动端 绑定事件尽量用addEventListener方法
 */
 mobf.transitionEnd = function(d,callback) {
 	if(!d || typeof d != "object"){
 		return false;
 	}
	d.addEventListener("transitionend",function(){
		// 短路与
		callback && callback();
	});
	d.addEventListener("webkitTransitionEnd",function(){
		callback && callback();
	});
 }
 /*
  * 绑定单击事件
  * d:dom元素
  * min:鼠标按下 弹起最小时间差
  * max:鼠标按下 弹起最大时间差
  * callback:tap事件发生时回调函数
  * 移动端 click事件会延迟300ms触发，为了检测是否触发了touchmove事件（触发时将不会触发click）
  * click的300ms几乎察觉不到，绑定的tap事件点击时间稍微长点不会触发，各有优缺点
  */
  mobf.tap = function(d,min,max,callback) {
  	if(!d || typeof d != "object"){
  		return false;
  	}
  	// 触发tap的两个条件
  	// 	1.没有触发touchmove事件
  	// 	2.间隔时间少于150ms
  	var isMove = false;
  	var startTime = 0;
  	var endTime = 0;
  	var duration = 0;
  	d.addEventListener("touchstart",function(e){
  		/*
  		 * 获得时间戳的方法：
  		 *	1.+(new Date());
  		 *	2.(new Date()).getTime();
  		 *	3.Date.now();
  		 * 初始化对象 耗费时间，所以用第3种
  		 */
  		startTime = Date.now();
  	});
  	d.addEventListener("touchmove",function(e){
  		isMove = true;
  	});
  	// 由于chrome中的模拟器支持有些问题，touchend事件绑定到window对象上
  	window.addEventListener("touchend",function(e){
  		endTime = Date.now();
  		duration = endTime - startTime;
  		// 判断
  		if(!isMove && duration < max && duration > min){
  			// 调用时传入e作为实参
  			callback && callback(e);
  		}
  		// 初始化变量
  		isMove = false;
  		startTime = 0;
  		endTime = 0;
  		duration = 0;
  	});
  }
  /*
   *
   */