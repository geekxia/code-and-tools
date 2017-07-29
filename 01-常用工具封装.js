// 封装事件绑定函数，以解决先添加的事件被后添加的事件覆盖问题。
function addLoadEvent(newload){
	var oldload = window.onload;
	if(typeof window.onload != 'function'){
		window.onload = newload;
	}else{
		window.onload = function(){
			oldload();
			newload();
		};
	}
};

// onload添加事件的方法
function addLoadEvent(func){
	var oldonload = window.onload;
	if(typeof window.onload != 'function'){
		window.onload = func;
	}else{
		window.onload = function{
			oldonload();
			func();
		}
	}
};

//事件绑定的兼容写法
function addEvent( obj , eName , eFn ){
	document.addEventListener?obj.addEventListener(eName,eFn):obj.attachEvent('on'+eName , eFn);
};


// 添加事件
function addHandler(obj,type,func){
	if(obj.addEventListener){
		obj.addEventListener(type,func,false);
	}else if(obj.attachEvent){
		obj.attachEvent("on"+type,func);
	}else {
		obj["on"+type] = func;
	}
};

	// 移出事件
function removeHandler(obj,type,func){
	if(obj.removeEventListener){
		obj.removeEventListener(type,func,false);
	}else if (obj.detachEvent) {
		obj.detachEvent("on"+type,func);
	}else {
		obj["on"+type] = null;
	}
};

// 获取事件对象
function getEvent(event){
	return event ? event : window.event;
};

// 获取滚轮事件的wheelDelta值，用以判断滚轮滚动方向
function getWheelDelta(event){
	var event = event || window.event;
	if(event.wheelDelta){
		return event.wheelDelta;
	}else{
		return -event.detail*40;
	}
};

// 滚轮事件绑定
function onWheel(obj,fn){
	if(obj.onmousewheel === null){
		obj.onmousewheel = fn;
	}else {
		obj.addEventListener("DOMMouseScroll", fn);
	}
};

//requestAnimationFrame兼容写法
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
})();


/* 固宽等比缩放适配封装 */

(function(){    //控制缩放比例
    var sw = window.screen.width,
        createMeta = document.createElement("meta"),
        scale = sw/320;
    var metaAttr = {
        "name" : "viewport",
        "content" : "width=320,initial-scale="+scale+",maximum-scale="+scale+",minimum-scale="+scale+",user-scalable=no"
    }
    for(var key in metaAttr){
        createMeta[key] = metaAttr[key];
    }
    document.getElementsByTagName("head")[0].appendChild(createMeta);
})();


/* rem适配封装 */
(function (win) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var tid;

    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;

        if (width > 768) { // 最大宽度
            width = 768;
        }
        var rem = width / 10; // 将屏幕宽度分成10份， 1份为1rem
        docEl.style.fontSize = rem + 'px';
    }

    win.addEventListener('resize', function () {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);
    refreshRem();
})(window);


// 把继承功能封装成函数 extend()
function extend(Child, Parent){
	var F = function(){}; 					// 临时容器
	F.prototype = Parent.prototype;			// 临时容器存储Parent的原型对象
	Child.prototype = new F(); 				// 重写Child的原型对象
	Child.prototype.constructor = Child; 	// 重置Child原型对象的构造器属性
	Child.uber = Parent.prototype; 			// 使子对象能访问父对象的属性
};


// 封装Ajax对象
function getHTTPObject(){
	if(typeof XMLHttpRequest == 'undefined'){
		try {return new ActiveXObject('Msxml2.XMLHTTP.6.0');}
			catch(e){};
		try {return new ActiveXObject('Msxml2.XMLHTTP.3.0');}
			catch(e){};
		try {return new ActiveXObject('Msxml2.XMLHTTP');}
			catch(e){};
		return false;
	};
	return new XMLHttpRequest();
};



/* ajax请求封装 */

function ajax(opt) {
    opt = opt || {};
    opt.method = opt.method.toUpperCase() || 'POST';
    opt.url = opt.url || '';
    opt.async = opt.async || true;
    opt.data = opt.data || null;
    opt.dataType = opt.dataType || 'JSON';
    opt.success = opt.success || function () {};
    var xmlHttp = null;
    if (XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
    else {
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    var params = [];
    for (var key in opt.data)  params.push(key + '=' + opt.data[key]);
    var postData = params.join('&');
    if (opt.method.toUpperCase() === 'POST') {
        xmlHttp.open(opt.method, opt.url, opt.async);
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xmlHttp.send(postData);
    }
    else if (opt.method.toUpperCase() === 'GET') {
        xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
        xmlHttp.send(null);
    }
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            if (opt.dataType === 'JSON') {
                opt.success(JSON.parse(xmlHttp.response));
            }
        }
    };
};

//获取目标对象到文档顶部的距离
function getTopDistance(obj){
	var topDistance = 0;
	while(obj){
		topDistance += obj.offsetTop;
		obj = obj.offsetParent;
	}
	return topDistance;
};

//获取滚动条的滚动距离
function getScrollTop(){
	return document.documentElement.scrollTop || document.body.scrollTop;
};


// 获取元素样式
function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else {
		return getComputedStyle(obj)[attr];
	}
};



// 生成随机色 rgb()
function randomColor(){
	var r = Math.floor(Math.random()*256);
	var g = Math.floor(Math.random()*256);
	var b = Math.floor(Math.random()*256);
	return "rgb("+r+","+g+","b")";
};




/* 获取或设置元素的transform相关属性 */

function cssTransform( obj,attr,val ) {
    if( !obj.transform ){
        obj.transform = {};
    }
    if( arguments.length === 3 ){  // 3个实参-->设置
        obj.transform[attr] = val;
        var strVal = '';
        for ( var key in  obj.transform){
            switch (key){
                case 'rotate':
                case 'rotateX':
                case 'rotateY':
                case 'skewX':
                case 'skewY':
                    strVal += key + '('+obj.transform[key]+'deg) ';
                    break;
                case 'translate':
                case 'translateX':
                case 'translateY':
                case 'translateZ':
                    strVal += key + '('+obj.transform[key]+'px) ';
                    break;
                case 'scale':
                case 'scaleX':
                case 'scaleY':
                    strVal += key + '('+obj.transform[key]+') ';
                    break;
            }
            obj.style.WebkitTransform = obj.style.transform =  strVal;
        }
    }else {  // 2个实参-->获取
        val = obj.transform[attr];
        if ( typeof val === 'undefined'){
            if( attr === 'scale' || attr === 'scaleX' || attr === 'scaleY') {
                val = 1;
            }else{
                val = 0;
            }
        }
        return val;
    }
};

// 封装insertAfter()，用于把某个节点插入到指定节点之后
function insertAfter(newObj, tarObj){
	var parent = tarObj.parentNode;
	if(parent.lastChild == tarObj){
		parent.appendChild(newObj);
	}else{
		parent.insertBefore(newObj,tarObj.nextSibling);
	}
};

//封装方法：获取某个节点的所有兄弟节点
function siblings( obj ){
	var aChild = obj.parentNode.children;
	var arr = [];
	for (var i=0;i<aChild.length;i++ )
		if ( aChild[i] != obj ){
			arr.push( aChild[i] );
		}
	return arr;
};

//封装方法：获取下一个元素节点
function nSibling( obj ){
	var nObj = obj.nextElementSibling?obj.nextElementSibling:obj.nextSibling;
	return nObj.nodeType!==1?null:nObj;
}


// 适配新老浏览器的getElementByClassName()方法
function getElementsByClassName(node, class_name){
	if(node.getElementsByClassName){
		return node.getElementsByClassName(class_name);
	}else {
		var items = node.getElementsByTagName("*");
		var result = [];
		for(var i=0; i<items.length;i++){
			if(items[i].className.indexOf(class_name) != -1){
				result[result.length] = items[i];
			}
		}
		return result;
	}
};