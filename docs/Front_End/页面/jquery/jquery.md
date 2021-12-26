---
title: jquery
order: 1
group:
  title: jQuery
  order: 4
---

一 jquery 简介：
1 jquery 是什么：（最屌就屌在兼容，前端最头疼的就是兼容）
1.jQuery 由美国人 John Resig 创建，至今已吸引了来自世界各地的众多 javascript 高手加入其 team。

        2.jQuery是继prototype之后又一个优秀的Javascript框架。其宗旨是——WRITE LESS,DO MORE,写更少的代码,做更多的事情。

        3.它是轻量级的js库(压缩后只有21k,3.31生产版只有84k)，这是其它的js库所不及的，它兼容CSS3，还兼容各种浏览器
            （IE 6.0+, FF 1.5+, Safari 2.0+, Opera 9.0+）。

        4.jQuery是一个快速的，简洁的javaScript库，使用户能更方便地处理HTML documents、events、实现动画效果，并且方便地为网站提供AJAX交互。

        5.jQuery还有一个比较大的优势是，它的文档说明很全，而且各种应用也说得很详细，同时还有许多成熟的插件可供选择。

    2 什么是jQuery对象？
        jQuery 对象就是通过jQuery包装DOM对象后产生的对象。
        jQuery 对象是 jQuery 独有的. 如果一个对象是 jQuery 对象, 那么它就可以使用 jQuery 里的方法: $(“#test”).html();
        比如：
            $("#test").html()   意思是指：获取ID为test的元素内的html代码。其中html()是jQuery里的方法
            这段代码等同于用DOM实现代码： document.getElementById(" test ").innerHTML;

        虽然jQuery对象是包装DOM对象后产生的，但是jQuery无法使用DOM对象的任何方法，同理DOM对象也不能使用jQuery里的方法.乱使用会报错
        约定：如果获取的是 jQuery 对象, 那么要在变量前面加上$.
            var $variable = jQuery 对象
            var variable = DOM 对象
        基本语法：$(selector).action()   selector是选择器（目的就是要找到目标元素进行操作）

    3 JQuery对象和DOM对象的互转：
        <1>jQuery对象转DOM：
            obj = document.getElementById("sel")
            $(obj)此时这个对象便有了所有Jquery对象的方法
        <2>DOM对象转jQuery：
            $("#sel")
            $("#sel")[0] 此时这个jQuery即转化为了DOM

二 寻找元素(重要的选择器和筛选器)：（jQuery 支持链式操作,可以连点.css().css()）
2.1 选择器
2.1.1 基本选择器 $("\*") $("#id") $(".class") $("element") $(".class,p,div")

        2.1.2层级选择器       $(".outer div")  $(".outer>div")   $(".outer+div")  $(".outer~div")毗邻，只向下找兄弟

        2.1.3 基本筛选器      $("li:first")、last  $("li:eq(2)")索引  $("li:even") $("li:gt(1)/lt(1)")大、小于索引值1

        2.1.4 属性选择器      $('[id="div1"]')   $('["alex="sb"][id]')

        2.1.5 表单选择器      $("[type='text']")----->$(":text")                    注意只适用于input标签

                         $("input:checked")

    2.2 筛选器(用的太多了)
        2.2.1  过滤筛选器：
                        $("li").eq(2)  $("li").first()  $("ul li").hasclass("test")下面的li标签有没有test属性有则返回True

        2.2.2  查找筛选器：（重要，为所欲为）！！！
                 子层    $("div").children(".test")涉及继承再单设覆盖    $("div").find(".test")

                 兄弟层  $(".test").next()    $(".test").nextAll()   $(".test").nextUntil()根据范围不包含

                        $("div").prev()  $("div").prevAll()（注意顺序，因为是向上找的，第零个反而是上面的一个，而一个是上面的第二个）
                        $("div").prevUntil()根据范围找兄弟层上层

                 父层   $(".test").parent()找到它爸爸，之后爸爸变，子全变，子承父
                        $(".test").parents()它爷爷们，找到body  $(".test").parentUntil()卡一段

                 常用   $("div").siblings()找除自己外的兄弟层
        children("")中可以进一步限定，限定儿子。而find则可以找所有后代...

    补充：（jQuery下的this）
        如通常一个点击事件根据this传值self获取该点击标签，通过self.getAttribute("key")来获取值。而事件绑定不仅仅只有这一种方式。
        第二种方式：-- 在js中找到对象进行绑定
            document.getElementById("div").onclick = function(){ console.log(this.getAttribute("key")) };
            这种方式不用函数中不用加任何参数。并且直接通过this来获取当前点击的标签。
       注：常用第二种事件绑定的方式，它与HTML脱离，再配合jQuery：$("#div").click(function () { console.log(this.getAttribute("id")) });

三 操作元素(属性 CSS 和 文档处理)

    3.1 属性操作:
            $("p").text()    $("p").html()   $(":checkbox").val() 设定或拿某个标签的value值（娶的话什么都不填，有参数则是设定填参数值）

            $(".test").attr("alex")   $(".test").attr("alex","sb")  get和set统一到了一个attr上面

            $(".test").attr("checked","checked")  $(":checkbox").removeAttr("checked") //注在2版本上有bug它直接把属性移除不，而不是仅移除值

            $(".test").prop("checked",true) check、select通常最好利用prop设值。prop不能设置自定义的属性值而attr可以

            $(".test").addClass("hide")向匹配的元素增加指定的类名  $(".test").removeClass("hide") 移除样式

    额外操作：
           $.each() -- 括号中跟函数可以实现for循环，一个参数是索引，第二个参数是值  (还有一种形式是$.each())

    3.2 CSS操作：见滚动菜单
        3.2.1(样式)   css("{color:'red',backgroud:'blue'}")（几乎不用）

        3.2.2(位置)   offset()    position()  scrollTop()  scrollLeft()  常用

        3.2.3(尺寸)   height()  width()

    3.3 文档处理

        内部插入  $("#c1").append("<b>hello</b>") 像插入列表中的最后项    $("p").appendTo("div") 插到哪里

                   prepend()    prependTo()  无非是插到上面

        外部插入  before()  insertBefore()  after() insertAfter()   无非是插到外层的上面和下面

                     replaceWith()   remove()删除标签  empty()清空各种属性  clone()相当于复制了一份标签对象

    3.4 事件
        3.4.1
            jQuery之加载：
            页面在尚未加载完文档流时js是无法获取某个标签的，常用window.onload()进行加载，而jQuery中则是利用$(document).ready(function..)来
            实现整个DOM树加载完才执行特定方法。
            简写方式： $(function...)与上相同，写简写即可
            $(document).ready(function(){}) -----------> $(function(){})

        3.4.2
            jQuery的事件绑定，都把on去了
            $("p").click(function(){}) 但新创建的动态标签不会进行绑定

             -- $("p").bind("click",function(){})2中常用3里废弃不过还能用（见下on，bind之所以被废弃就是因为有了on）

            $("ul").on("click","li",function(){})对新创建的动态li也可以事件绑定 -- 第三个参数其实是data可以往事件里面传递一个参数
                这就是事件委托：把li进行的事件绑定委托给了ul（这个也是可选参数）
                若把li放到ul后面这种方式是肯定不行的，因为和bind一样了，已经废了（等同于bind）
            off() 方法移除用.on()绑定的事件处理程序

             -- $("ul").delegate("li","click",function(){})这是在3出来之前都是用它进行事件委托的（也是因为on被废了）

             data参数：若想传这参数到事件绑定中可以$("p").on("click",{foo,"bar"},myHandler) function myHandler(event){ alert(event.data.foo) }
                再利用Event去取data的参数。
    拖动面板： -- 见代码

    3.5 动画效果：
        显示隐藏：   show(2000)  hide()  taggle()  渐渐下拉效果 taggle是显示隐藏的集合，参数为毫秒
        淡入淡出：   fadeIn(1000)    fadeOut()   fadeToggle()   fadeTo(1000,0.4,callback)可以改透明度  做轮播图就用它
        滑动：     slideDown()     slideUp     slideToggle(1000)  渐渐下滑效果
        这里跟的回调函数：是可以在动画效果出现后，在内部直接执行的函数（比如show(500,function(){})当show执行后执行后面的函数）
            简言：前面的事件一旦成功了他就会执行的一个函数。

    3.6 jQuery扩展方法：(插件机制)常用！！
        之前的$.each()都是jQuery自己定义好的方法，而扩展指的是，我们自己定义的方法
        jquery.extend({}) 里面第一的参数是方法名，第二个参数则是函数
        jquery.fn.extend({}) fn指的是必须前面通过标签对象来调用（通过标签实例来调用）

            这两种方法是通过类，jQuery类，后面接的是实例方法  $符号就是jQuery

        注：以后的的扩展方法都写到匿名函数中去，意义在于私有域，说白了就是给它加上个作用域（避免和其他的产生冲突，比如定义多个扩展函数时怕对
            全局变量产生干扰）因此为了保护数据跟外部进行一个解耦（你是你我是我分开），放到函数中则被保护起来了。（就是怕和别人写的插件命名产
            生干扰）故多加一个函数作用域，保护内部变量不受外部环境干扰
            (function($){ $.fn.extend({ fname:function(){...} }) })(jQuery) 而通常传一个jQuery（$）的参数,好处让别人明白自己写的是啥插件

jQuery 在企业中的应用： 1.多在中小型公司，因为全。但大型公司有自己的一套框架，因为 jquery 太费流量（都是钱）。而小公司技术不成熟，访问人数也不多开发成本不大因此不用 2.在移动端 jQuery 无法使用，用手机每次浏览都下载个 jquery 那个流量遭不住啊。因此这里又多半用原生 js。DOM 还是要会用。

后台管理页面的布局：(利用 absolute+overflow:auto;)
一个网站通常分后台和主站，同时应用一个数据库（以此来分离前后端） 1.滚动滑轮的事件 2.内容到窗口的距离
3.position：absolute + - overflow:auto: 4.不推荐在 html 上绑定 onclick，应该做到完全的分离

滚动菜单功能：(参见 CSS 操作) 1.监听滑轮滚动事件: -- 通过 onscroll 事件来监听滑轮 2.如何获取滚轮滑动的高度: -- $("body").scrollTop()获取当前滚动高度、还有left。参数设置滚轮高度
        不仅仅是body，获取一个有overflow：auto；属性的div也同理实现滚轮滑动
        $(..).scrollTop()   $(..).scrollTop(10) =>$(..).scrollLeft(10) 3. 如何获取某个标签距离顶部高度:
$(..).offset() 获取当前标签距离文档顶部高度

        $(..).height()        永远获取自己的高度；             获取当前标签自己的高度
        $(..).innerHeight()   永远获取自己高度+padding;        获取第一个匹配元素内部区域高度（包括补白、不包括边框）。
        $(..).outerHeight()
                              参数一：false:
                                永远获取自己高度+padding+border; 获取第一个匹配元素外部高度（默认包括补白和边框）设置为 true 时，计算边距在内。
                              参数二：true
                                永远获取自己高度+padding+border+margin;

    注：若要通过获取body来控制滚动因为<!DOCTYPE html>h5的规范会引起冲突。因此要通过获取document.documentElement返回文档的根节点
        （其实是html也是整个文档流）来实现滚动（不然scrollTop始终为0）

    原因：初始时html的高度和body的高度一样都是48（body这里脱离了文档流），若用body也就是document.body获取滚动则始终为0（因为你滚轮上下
        始终不是在body中滚动，body脱离文档流）。但若用document.documentElement（也就是html）来获取滚动则可以取到与文档的距离（简而言之：
        用body取的是脱离文档流的body距body距离高度始终是48因此是TOP一直等于0，用html则是脱离文档流body下的子标签到html的距离）
        $(document).height()获取的则是整个文档流的高度
    最后：滚动条是谁的滚动条？（不同浏览器滚动滑轮可能出现问题-- 事件不执行，也就是没有绑定上事件）
        这个滚轮应该是body的吗？但body只有48px。滚轮出现的原因是因为大于了窗口，因此应该给窗口绑定事件才对。因此给body绑定不太好，应该
        用window绑定即：window.onsrcoll() = function(){...}。返回顶部也一样$(window).scrollTop(0);即可

前端小结：
前端特性：杂+实现不唯一+不要硬记（没有意义）
学习前端：
1.html+css：知道基础+记住一两种的主流需求（如页面布局）即可
2.js 作用域问题肯定能遇到，原生 js 要掌握
3.jQuery 用的其实也不少，最新的是 3,但考虑兼容性用 1.9 以上即可（2 以上对低版本浏览器支持不行）因此采用 1 系列的最高版即可

知识回顾： 1.在服务器端写 HTML 时会碰到两种后缀名文件
-- .html
-- .tpl template (模板中的数据在服务器端打开文件获取时.replace()进行替换，下次访问则变化) JAVA 中都是用 tpl 多
-- .chtml
在任何语言的 web 框架中 html 就是做模板用的

作业：
放大镜+轮播图+商城菜单+编辑框

    轮播图：
    css:
        1.有时text-align:100%不能使其居中，可能是由于width没有设置100%：是由于脱离文档流后若不设定width它并不知道有多长

        2.若想让btn在div中居中，可以先让其top: 50%再向上移自己宽度的一半margin-top: -30px

        3.当优先级高时不想再前面加权，那么!important也不是不行（但还是不推荐）

        错误1：把ul下的字标签进行folat使其文档流脱离，此后当然text-align设置失效，用display: inline-block;即可使其排列一排
            变为行内块元素

    jquery:
        1.$(this).index()方法可以用来获取当前索引 0、1、2
        2. .hover(f1、f2) 与mouseover同、悬浮，可写两个方法，免得再写mouseover mouseout了
        3. .stop() 指的是把吧前面进行的（动画）立刻停止，再加载后面的
