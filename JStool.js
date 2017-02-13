/*
 *产品开发流程：
 *  产品 设计/UI出设计稿
 * prd会议（需求分析会议），前后端接口完成时间，连调时间（一般3几天），技术成本高的地方，不能实现的地方
 * 开发用假数据，之后套后台提供的接口，将真实数据渲染到页面上
 * 一轮测试 二轮测试（视情况进行三轮）。冒烟测试（不能出现闪屏等），测试用例（点击等效果正常，一般在开发后期也会给）
 * 放到预发布环境（等待上线）
 */
/**
 * innerText属性存在兼容性问题：chrome、FF新、IE新全支持；FF旧只支持textContent；IE旧只支持innerText.
 * @param element
 */
function getInnerText(element) {//获取innerText属性
    if (typeof element.innerText !== undefined) {
        return element.innerText;
    } else {
        return element.textContent;
    }
}
function setInnerText(element, content) {
    if (typeof element.innerText !== undefined) {//注意：防止支持情况下，返回空字符串
        element.innerText = content;
    } else {
        element.textContent = content;
    }
}
/**
 * 获取上一个和下一个兄弟元素
 * IE678不支持nextElementSibling和nextPreviousSibling
 * @param element
 * @returns {*}
 */
function getNextElement(element) {
    if (element.nextElementSibling) {
        return element.nextElementSibling;
    } else {
        var next = element.nextSibling;
        while (next && 1 !== next.nodeType) {
            next = next.nextSibling;
        }
        return next;
    }
}
function getPreviousElement(element) {
    if (element.previousElementSibling) {
        return element.previousElementSibling;
    } else {
        var previous = element.previousSibling;
        while (previous && 1 !== previous.nodeType) {
            previous = previous.previousSibling;
        }
        return previous;
    }
}
/**
 * 获取第一个和最后一个子元素
 * IE678不支持firstElementChild和lastElementChild
 * @param element
 * @returns {*}
 */
function getFirstChild(element) {
    if (element.firstElementChild) {
        return element.firstElementChild;
    } else {
        var first = element.firstChild;
        while (first && 1 !== first.nodeType) {
            first = first.nextSibling;
        }
        return first;
    }
}
function getLastChild(element) {
    if (element.lastElementChild) {
        return element.lastElementChild;
    } else {
        var last = element.lastChild;
        while (last && 1 !== last.nodeType) {
            last = last.previousSibling;
        }
        return last;
    }
}
/**
 * 更换元素类（不能直接设置className，防止多个类名不被更换的也被替换掉，减少不必要的书写）
 * @param element
 * @param oldClass
 * @param newClass
 */
function replaceClass(element, oldClass, newClass) {
    element.className = element.className.replace(oldClass, newClass);
}
/**
 * 获取最终样式
 * element.currentStyle为IE专有，6-11都支持，Chrome不支持；
 * getComputedStyle(element,null) Chrome支持，IE只有9及以上支持。
 * @param element
 * @returns {*}
 */
function getStyle(element) {
    if (element.currentStyle) {
        return element.currentStyle;//不好,支持最广泛的写在前面
    } else {
        return window.getComputedStyle(element, null);
    }
}
/**
 * 获取计算后的样式的某个属性，返回值带单位
 * @param obj 要获取样式的对象
 * @param attr 要获取样式的某个属性
 * @returns {*} 返回计算后的样式属性
 */
function getStyleAttr(obj, attr) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(obj, null)[attr];
    } else {
        return obj.currentStyle[attr];
    }
}
/**
 * rgba()和opacity对于IE678不支持，前一种不继承，后一种继承
 * filter:alpha(opacity=50);只有IE678支持，也只对IE678有效
 * @param element
 * @param opacity
 */
function setOpacity(element, opacity) {
    if (typeof element.style.opacity == "string") {
        element.style.opacity = opacity;
    } else {
        element.style.filter = "alpha(opacity=" + opacity * 100 + ")";
    }
}
/**
 * 在DOM文档树中移除自己
 * @param element
 */
function removeSelf(element) {
    element.parentNode.removeChild(element);
}
/**
 * 匀速动画
 * @param obj 要移动的对象
 * @param target 要移动到的位置的坐标
 * @param step 步长
 */
function animate(obj, target, step) {
    //清理定时器
    clearInterval(obj.timer);
    //开始定时器
    obj.timer = setInterval(function () {
        //判断移动方向
        var ostep = obj.offsetLeft - target > 0 ? -step : step;
        //开始移动
        if (Math.abs(obj.offsetLeft - target) <= Math.abs(ostep)) {
            //距离小于一个步长，手动移到目标位置，清理定时器
            obj.style.left = target + "px";
            clearInterval(obj.timer);
        } else {
            //迈步
            obj.style.left = obj.offsetLeft + ostep + "px";
        }
    }, 15);
}
/**
 * 缓动动画框架封装
 * @param obj 缓动对象
 * @param json 目标样式属性键值对
 * @param fn 缓动完成后的回调函数
 */
function animate(obj, json, fn) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var flag = true;
        //循环每个要变换的属性
        for (var k in json) {
            //如果是设置透明度
            if (k === "opacity") {
                //支持opacity
                if (typeof obj.style.opacity === "string") {
                    //当前样式属性值
                    var leader = (getStyleAttr(obj, k) || 0) * 100;//用到样式封装
                    //目标值
                    var target = json[k] * 100;
                    //步长
                    var step = (target - leader) / 10;
                    //由于浏览器对像素值的四舍五入，防止移不动步的情况
                    step = step > 0 ? Math.ceil(step) : Math.floor(step);
                    //迈步
                    leader = leader + step;
                    obj.style[k] = leader / 100;
                    //停下来
                    if (leader !== target) {
                        flag = false;
                    }
                } else {//IE678
                    return;
                }
            } else if (k === "zIndex") {
                obj.style.zIndex = json[k];
            } else {
                //当前样式属性值
                var leader = parseInt(getStyleAttr(obj, k)) || 0;
                //目标值
                var target = json[k];
                //步长
                var step = (target - leader) / 10;
                //由于浏览器对像素值的四舍五入，防止移不动步的情况
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                //迈步
                leader = leader + step;
                obj.style[k] = leader + "px";
                //停下来
                if (leader !== target) {
                    flag = false;
                }
            }
        }
        if (flag) {
            clearInterval(obj.timer);
            if (fn) {
                console.log("开始执行动画的回调函数");
                fn();
            }
        }
    }, 15);
}
/**
 * 查找 子字符串 在 父字符串中出现的位置
 * @param string 要在其中查找的父字符串
 * @param str 要查找的子字符串
 * @returns {*} 返回子字符串在父字符串中的坐标
 */
function findStr(string, str) {
    var indexs = [];
    var i = -1;
    do {
        i = string.indexOf(str, i + 1);
        if (-1 !== i) {
            indexs.push(i);
        }
    } while (-1 !== i);
    return indexs;
}
/**
 * 获取页面滑动时被卷去的长度，可以配合onscroll事件使用
 * @returns {{top: (Number|number), left: (Number|number)}}
 */
function getWindowScroll() {
    return {
        top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
        left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollTop || 0
    }
}
/**
 * 获取页面可视区域宽高
 * @returns {{width: (Number|number), height: (Number|number)}}
 */
function getWindowClient() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0,
        height: window.innerHeight || document.documentElement.clientWidth || document.body.clientWidth || 0
    }
}
/**
 * 工具类：事件委托：动态生成的元素无法注册事件，可以注册给这些元素的父元素（父元素不是动态生成的）
 * @param father
 * @param tagname
 * @param type
 * @param fn
 */
function on(father, tagname, type, fn) {
    eventUtil.addEvent(father, type, function (event) {
        //获取事件对象
        var event = eventUtil.getEvent(event);
        //获取触发事件的目标
        var target = eventUtil.getTarget(event);
        //判断触发事件的目标是否是会触发给定事件的子元素
        if (target.tagName === tagname.toUpperCase()) {
            //将给定事件赋值给目标对象，目标对象中的this指代这个对象。直接fn()，其中的this指向father或window
            target.fn = fn;
            target.fn();
        }
    });
}
/**
 * eventUtil:封装事件相关的兼容属性和兼容方法的小组件。util:utility公用程序，工具。
 * @type {{getEvent: Function, getPagexy: Function, getTarget: Function, stopPropgation: Function, addEvent: Function, removeEvent: Function}}
 */
var eventUtil = {
    /**
     * 获取事件对象。
     * 一般浏览器，事件处理程序运行在绑定事件的元素对象中，事件触发时由浏览器传给监听程序event作为参数，
     * IE678事件处理程序运行在window对象中，由window对象提供event对象
     * @param event
     * @returns {*|Event}
     */
    getEvent: function (event) {
        return event || window.event;
    },
    /**
     *获取事件触发的位置在页面中的位置
     * event对象包括三组位置属性：clientX/clientY,scrollX/scrollY,pageX/pageY。最后一组最常用，但IE678中event不包括这个属性。
     * @param event
     * @returns {{pageX: (*|Number), pageY: (*|Number)}}
     */
    getPagexy: function (event) {
        return {
            x: event.pageX || event.clientX + getWindowScroll().left,
            y: event.pageY || event.clientY + getWindowScroll().top
        }
    },
    /**
     * 获取事件触发目标。IE678的event没有target属性。
     * @param event
     * @returns {Node|string|*|EventTarget|Object}
     */
    getTarget: function (event) {
        return event.target || event.srcElement;
    },
    /**
     * 阻止事件冒泡
     * @param event
     */
    stopPropgation: function (event) {
        if (event.stopPropgation) {//常规浏览器
            event.stopPropgation(event);
        } else {//IE678
            event.cancelBubble = true;
        }
    },
    /**
     * 给元素添加事件监听器，由于IE和一些老版本浏览器不支持事件捕获，采用冒泡方式绑定事件
     * @param element 要绑定事件的元素
     * @param type 绑定的事件类型，如click，只有标准方法这么写，IE和属性的方式都是onclick。
     * @param fn 预先定于的事件处理函数，由于需要解绑，最好不要用匿名函数。
     */
    addEvent: function (element, type, fn) {
        if (element.addEventListener) {
            element.addEventListener(type, fn, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, fn);
        } else {
            element["on" + type] = fn;
        }
    },
    /**
     * 给元素解绑事件处理程序。
     * @param element
     * @param type
     * @param fn
     */
    removeEvent: function (element, type, fn) {
        if (element.removeEventListener) {
            element.removeEventListener(element, type, fn);
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, fn);
        } else {
            element["on" + type] = null;
        }
    }
}
/**
 * 得到或清除页面中的选中文本
 * 普通浏览器 通过window.getSelection()获取
 * IE678 通过documenet.selection()获取
 */
var select = {
    get: function () {
        return window.getSelection ? window.getSelection().toString() : document.selection.createRange().text;
    },
    clear: function () {
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    }
}
//通过类名获取元素
//数组的深层复制
//Array的sort方法的改进
//Array的reverse方法的改进
