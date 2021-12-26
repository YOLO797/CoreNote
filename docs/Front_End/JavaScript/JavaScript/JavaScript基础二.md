---
title: JavaScript基础二
order: 2
---

----------------------------JS 扩展----------------------
Number、Boolean 对象说实话没什么好讲的

String 对象：
创建方式：
var s = "hello" or var s = new String("hello") --这两种方式

    属性：
        .length: 返回字符串的长度

    方法：
        1.格式编排方法:（没用）
            String对象提供了一组针对HTML格式的方法.
                .italics() -- 若用document.write(s.italics())打印（document本身就是一个对象）则把字符串变为斜体
                同理还有 x.anchor(参数)返回锚定义字符串<a>x</a> 、.bold()返回粗体、.sup()返回上标格式 等等
        2.大小写转换：.toLowerCase()  .toUpperCase()
        3.获取指定字符：.charAt(index)根据索引取字符 index是位置  .charCodeAt(index)返回index位置的Unicode编码
        4.查询字符串：
            .indexOf(findstr,index) 从index开始找
            .lastIndexOf(findstr)   前两个顾名思义
            .match(regexp)返回数组，里面是所有匹配的结果，如果没有匹配则返回null
            .search(regexp)返回匹配字符串的首字符位置索引    --regexp代表正则表达式或字符串
        5.子字符串处理
            截取子字符串：（这个稍微用的多点）
                .substr(start, length)    .substring(start, end)    .slice(start, -end)（区别在于可以为负）
                start表示开始位置     length表示截取长度    end表示结束位置      第一个字符位置为0
            替换子字符串：.replace(findstr,tostr)
            分割字符串：.split(",")  用,分割
            连接字符串：x.concat(addstr)  addstr为添加字符串  返回x+addstr字符串

Array 对象：（js 中运用最多的）
创建方法：
var a = [1,2,3,4]; or var a = new Array(5,"hello",[1,2],true) -- (而 JAVA 可不能这样，要声明数组类型)
若 var a = new Array(3);这种写法则表示先创建占三个位置的空数组
通常用第一种方式最简单。另外它是可变长的，通过直接赋值 a[5]=10 若前面没值则自动补 undefined

    创建二维数组：
        数组嵌套数组var a = new Array([1,2],3)这就是了  通过a[0][1]娶到2

    属性：
        .length: 哇，简直懒得再写这个

    方法：
        1.连接数组-join方法：
            .join(bystr)        bystr作为连接数组中元素的字符串      返回连接后的字符串       与字符串的split功能刚好相反
            [1,2].join("+")  -- 1+2

        2.数组的进出栈操作:
            有unshift、shift  pop、push 两种，第一组在尾部取，第二种在顶部取
            压栈：.push(value, ...) -- 把元素压到数组最后 .unshift(value,...) -- 把元素压到数组的起始
            弹栈：.pop() -- 是将数组的最后一个元素删除    .shift() -- 是将数组的第一个元素删除

        3.数组排序-reverse sort:
            .reverse() 反转 无序的,直接把整个数组进行反转
            .sort() 把数组进行排序，坑的是，它是把字符串进行排序的（数字也先转化为字符串）之后比较第一个字符的ascii码
                想按照其他标准进行排序，就需要提供比较函数，该函数要比较两个值，然后返回一个用于说明这两个值的相对顺序的数字。
                若想真正进行排序的话，要自己写排序函数：
                    function mysort(a,b){ return a-b; } arr.sort(mysort)
                上面的比较原理如传入[2,3,4,1] 就先传入2、3 返回-1 表示3比2大不用动，在传入3、4 ... 4 、1 时返回1表示1比4小，那么
                则传入3、1 直到排序结束。（真坑）


        4.连接数组-concat方法
            .concat(value,...) 进行增加并返回一个新结果

        5.数组切片-slice：
            .slice(start, end) 第一个数组元素索引为0  start、end可为负数，-1代表最后一个数组元素  end省略则相当于从start位置截取以后所有数组元素

        6.删除子数组
            . splice(start, deleteCount, value, ...) splice的主要用途是对数组指定位置进行删除和插入
            deleteCount删除数组元素的个数        value表示在删除位置插入的数组元素     value参数可以省略

    总结js的数组特性：
        特性1: js中的数组可以装任意类型,没有任何限制.
        特性2: js中的数组,长度是随着下标变化的.用到多长就有多长.

Date 对象：（根 time 模块似的）
创建 Date 对象：
不指定参数: var d = new Date()
参数为日期字符串: var f = new Date("2004/3/20 11:12");
参数为毫秒数: var d = new Date(5000);
参数为年月日小时分钟秒毫秒:var d = new Date(2004,2,20,11,12,0,300); //毫秒并不直接显示(打印不出来)

    Date对象的方法—获取日期和时间：
        getDate()                 获取日
        getDay ()                 获取星期
        getMonth ()               获取月（0-11算的）
        getFullYear ()            获取完整年份
        getYear ()                获取年
        getHours ()               获取小时
        getMinutes ()             获取分钟
        getSeconds ()             获取秒
        getMilliseconds ()        获取毫秒
        getTime ()                返回累计毫秒数(从1970/1/1午夜)

    Date对象的方法—设置日期和时间：
        setDate(day_of_month)           设置日
        setMonth (month)                设置月
        setFullYear (year)              设置年
        setHours (hour)                 设置小时
        setMinutes (minute)             设置分钟
        setSeconds (second)             设置秒
        setMillliseconds (ms)           设置毫秒(0-999)
        setTime (allms)                 设置累计毫秒(从1970/1/1午夜)

    Date对象的方法—日期和时间的转换：
        getTimezoneOffset():8个时区×15度×4分/度=480;  返回本地时间与GMT的时间差，以分钟为单位（480分钟/60min 8个小时东八区）
        toUTCString()                                返回国际标准时间字符串
        toLocalString()                              返回本地格式时间字符串
        Date.parse(x)                                返回累计毫秒数(从1970/1/1午夜到本地时间)
        Date.UTC(x)                                  返回累计毫秒数(从1970/1/1午夜到国际时间)

RegExp 对象：（正则）
在表单验证时使用该对象验证用户填入的字符串是否符合规则.

    用户名 首字母必须是英文, 除了第一位其他只能是英文数字和_ . 长度最短不能少于6位 最长不能超过12位
    创建方式：
        1.  var reg = new RegExp("^[a-z][A-Z][0-9]\w+\d*","g")
            参数1 正则表达式  参数2 验证模式  g global / i 忽略大小写. //参数2一般填写g就可以，也有“gi”.
        2.  var reg = /^[a-zA-Z][a-zA-Z0-9_]{5,11}$/g

    方法：
        .test(str)  ==>  测试一个字符串是否复合 正则规则. 返回值是true 和false.

    String 中与正则结合的4个方法：（macth search split replace）
         var str = "hello world";
        1.alert(str.match(/o/g)); //查找字符串中 复合正则的 内容并返回数组
        2.alert(str.search(/h/g));// 查找字符串中符合正则表达式的内容位置 返回第一个索引
        3.alert(str.split(/o/g)); // 按照正则表达式对字符串进行切割. 返回数组;
        4.alert(str.replace(/o/g, "s")); // hells wsrld  对字符串按照正则进行替换.

Math 对象：
该对象中的属性方法 和数学有关.
Math 是内置对象 , 与 Global 的不同之处是, 在调用时 需要打出 "Math."前缀.也不用 new 来实例化

    属性：.PI

    方法：
        Math.random()       获得随机数 0~1 不包括1但能娶到零
        Math.round(1.5)     四舍五入
        Math.max(1,2)       返回俩数的较大值
        Math.min(1,2)       返回俩数的较小值
        Math.pow(2,4)       pow 计算参数1 的参数2 次方.
        abs(x)      返回数的绝对值。
        exp(x)      返回 e 的指数。
        floor(x)    对数进行下舍入。
        log(x)      返回数的自然对数（底为e）。
        round(x)    把数四舍五入为最接近的整数。
        sin(x)      返回数的正弦。
        sqrt(x)     返回数的平方根。
        tan(x)      返回角的正切。

-------------------------------------以上 ECMA 对象说的差不多了---------------------------------
BOM 对象：
BOM（浏览器对象模型），可以对浏览器窗口进行访问和操作。使用 BOM，开发者可以移动窗口、改变状态栏中的文本以及执行其他与页面内容不直接相关的动作。
使 JavaScript 有能力与浏览器“对话”。（包括了 Location、History、Windows 对象）

    window对象：
        所有浏览器都支持 window 对象。
        概念上讲.一个html文档对应一个window对象.
        功能上讲: 控制浏览器窗口的.
        使用上讲: window对象不需要创建对象,直接使用即可.

        Window 对象方法（window是全局变量，也不用写全）
            alert()            显示带有一段消息和一个确认按钮的警告框。
            confirm()          显示带有一段消息以及确认按钮和取消按钮的对话框。
            prompt()           显示可提示用户输入的对话框。

            open()             打开一个新的浏览器窗口或查找一个已命名的窗口。
            close()            关闭浏览器窗口。
            setInterval()      设定一个定时器 -- 按照指定的周期（以毫秒计）来调用函数或计算表达式。（比如轮播图就需要用到定时器）
            clearInterval()    取消一个定时器 -- 取消由 setInterval() 设置的 timeout。
            setTimeout()       在指定的毫秒数后调用函数或计算表达式。（过几秒后执行一次，也就是只执行一次）
            clearTimeout()     取消由 setTimeout() 方法设置的 timeout。
            scrollTo()         把内容滚动到指定的坐标。

        交互方法：（alert、confirm、prompt）
            confirm("提示判断信息")： 比如下载是否取消，内容是否保存。 有返回值可获取，true、false
            prompt("提示输入信息")： 可以获取返回值,返回值即用户输入内容

        setInterval clearInterval：
            setInterval():涉及到两个参数，1.想要执行的函数 2.执行相隔的时间毫秒 返回值则是ID号，每一个定时器返回的ID号唯一
            clearInterval(ID): 暂停的是定时器返回的ID
            注意：setInterval()若点击多次则会出现bug clearInterval()无法清除对应的ID。此时可解决的方法有很多，比如：
                1.判断ID此时是否为undefined true则创建定时器，否则不执行。并在清除定时器后设置ID为undefined
                2.每次创建定时器先清除上一次的ID，第一次ID为空也无影响。
                3.加flag

        setTimeout clearTimeout：
            var ID = setTimeout(abc,2000); // 只调用一次对应函数.
            clearTimeout(ID);//调用前进行清除
            function abc(){
                alert('aaa');
            }


    History 对象：（没啥用）
        History 对象包含用户（在浏览器窗口中）访问过的 URL。
        History 对象是 window 对象的一部分，可通过 window.history 属性对其进行访问。

        属性：length  返回浏览器历史列表中的 URL 数量。（简言，多少历史页面）

        方法：（正如浏览器的上一个、下一个）
            back()    加载 history 列表中的前一个 URL。
            forward()    加载 history 列表中的下一个 URL。
            go()    加载 history 列表中的某个具体页面。（里面有参数1、-1、0三种，-1表示后退 1表示前进 0表示当前页面不跳转）

    Location 对象：（同上）
        Location 对象包含有关当前 URL 的信息。
        Location 对象是 Window 对象的一个部分，可通过 window.location 属性来访问。

        属性：.href='URL' 跳转到指定页面

        方法：
            location.assign(URL)
            location.reload()   重载 -- 就是浏览器的刷新
            location.replace(newURL)//注意与assign的区别

DOM 对象:(重点掌握)
什么是 DOM:（接下去学习的都是 HTML DOM）
DOM 是 W3C（万维网联盟）的标准。DOM 定义了访问 HTML 和 XML 文档的标准：
"W3C 文档对象模型（DOM）是中立于平台和语言的接口，它允许程序和脚本动态地访问和更新文档的内容、结构和样式。"

        W3C DOM 标准被分为 3 个不同的部分：
            1.核心 DOM - 针对任何结构化文档的标准模型（有层级结构，符合DOM标准）
            2.XML DOM - 针对 XML 文档的标准模型
            3.HTML DOM - 针对 HTML 文档的标准模型

        什么是 XML DOM？  －－－－>XML DOM 定义了所有 XML 元素的对象和属性，以及访问它们的方法。（JAVA中用的最多）
        什么是 HTML DOM？－－－－>HTML DOM 定义了所有 HTML 元素的对象和属性，以及访问它们的方法。

    DOM 节点：（DOM实质上也是对象）
        根据 W3C 的 HTML DOM 标准，HTML 文档中的所有内容都是节点(NODE)：
            1.整个文档是一个文档节点(document对象) -- 所有标签组成的文档对象 html就是
            2.每个 HTML 元素是元素节点(element 对象) -- 每一个标签对象
            3.HTML 元素内的文本是文本节点(text对象)
            4.每个 HTML 属性是属性节点(attribute对象) -- 对属性进行操作
            5.注释是注释节点(comment对象)

        之后便把这五个node对象（节点对象）封装成了NODE（节点）。其中还分了自身属性和导航属性

        节点(自身)属性:
            attributes - 节点（元素）的属性节点
            nodeType – 节点类型
            nodeValue – 节点值
            nodeName – 节点名称
            innerHTML - 节点（元素）的文本值

        导航属性:（像地图一样，从一个地方到另一个地方地图上要导航标记出来。这个地图好比文档树）
            parentNode - 节点（元素）的父节点 (推荐)一般就用这个比较多
            firstChild – 节点下第一个子元素
            lastChild – 节点下最后一个子元素
            childNodes - 节点（元素）的子节点

        导航属性在文档树中应用：
            document（html）：后面跟element（head）和element（body）。再之后head里面有elelement（title），其下有text（Title）。
                body下有element（div）之后跟text（文本信息）。
            这就是一个最基本的文档树。之后便可以用上面的导航属性进行查找。例如通过firstChild可以找到head。lastChild可以找到body
            head找html通过parentNode 。head找body通过chilNodes查找，以此类推。

        注意：一个标签嵌套的导航属性（如div嵌套div）中获取firstChild的nodeName并不一定是下一个标签信息，而可能是text，因为中间包
            含了\n\t这些文本内容。（因此first、lastChild可能没啥用）

        推荐导航属性：（加上element就不会出现如上找到text的情况）
            parentElement              // 父节点标签元素
            children                   // 所有子标签
            firstElementChild          // 第一个子标签元素
            lastElementChild           // 最后一个子标签元素
            nextElementtSibling        // 下一个兄弟标签元素 **
            previousElementSibling     // 上一个兄弟标签元素 **
        因此有了这些之后就可以对文档树进行导航，先找到一个节点，之后便可以利用属性导航

        节点树中的节点彼此拥有层级关系。
        父(parent),子(child)和同胞(sibling)等术语用于描述这些关系。父节点拥有子节点。同级的子节点被称为同胞（兄弟或姐妹）。
            在节点树中，顶端节点被称为根（root）
            每个节点都有父节点、除了根（它没有父节点）
            一个节点可拥有任意数量的子
            同胞是拥有相同父节点的节点

        访问 HTML 元素（节点）,访问 HTML 元素等同于访问节点,我们能够以不同的方式来访问 HTML 元素：
            1.页面查找：（也称全局查找，通过document进行查找）
                通过使用 getElementById() 方法            由于id唯一，因此只能找到一个
                通过使用 getElementsByTagName() 方法      不唯一
                通过使用 getElementsByClassName() 方法    因此根据class找不唯一，是一个数组
                通过使用 getElementsByName() 方法         不唯一且很少用

            2.局部查找：
                局部查找可以通过getElementByTagName()、getElementByClassName()方法，但不可以通过ID（因为ID全局唯一，不需要局部）
                同时也不能通过getElementByName()方法（就是不让用，规定）

    HTML DOM Event(事件)：
        HTML 4.0 的新特性之一是有能力使 HTML 事件触发浏览器中的动作（action），比如当用户点击某个 HTML 元素时启动一段 JavaScript。
        下面是一个属性列表，这些属性可插入 HTML 标签来定义事件动作。

        onclick        当用户点击某个对象时调用的事件句柄。
        ondblclick     当用户双击某个对象时调用的事件句柄。

        onfocus        元素获得焦点。               //练习：输入框
        onblur         元素失去焦点。               应用场景：用于表单验证,用户离开某个输入框时,代表已经输入完了,我们可以对它进行验证.
        onchange       域的内容被改变。             应用场景：通常用于表单元素,当元素内容被改变时触发.（三级联动）

        onkeydown      某个键盘按键被按下。          应用场景: 当用户在最后一个输入框按下回车按键时,表单提交.(一直按会一直触发事件)
        onkeypress     某个键盘按键被按下并松开。
        onkeyup        某个键盘按键被松开。
        onload         一张页面或一幅图像完成加载。
        onmousedown    鼠标按钮被按下。
        onmousemove    鼠标被移动。
        onmouseout     鼠标从某元素移开。（出来就触发）
        onmouseover    鼠标移到某元素之上。（进去就触发）
        onmouseleave   鼠标从元素离开
        screenX/Y      获取鼠标当前的XY坐标

        onselect      文本被选中。
        onsubmit      确认按钮被点击。

        onload：
            onload 属性开发中 只给 body元素加.
            这个属性的触发 标志着 页面内容被加载完成.
            应用场景: 当有些事情我们希望页面加载完立刻执行,那么可以使用该事件属性.（onload可以解决script先加载的问题 window.onload=function()
            window是一个窗口代表一个页面，当页面加载完之后，会执行后面的函数。通常来说要文档加载完了才加载js，这也是为什么js要放末尾的原因）

        onsubmit:（只能绑定form）
            是当表单在提交时触发. 该属性也只能给form元素使用.应用场景: 在表单提交前验证用户输入是否正确.如果验证失败.在该方法中我们应该
            阻止表单的提交.（可用于前端验证，把数据截下来）例如 event.preventDefault()就是阻止默认值
            建议都用标签内部onsubmit="return check()" function check(){return false}这种方式去阻止提交

        绑定事件的两种方式：
            1.根据标签后面的属性onclick进行绑定
            2.根据var obj = document.getElementByClassName("xxx")[0]; obj.onclick = function(){}进行绑定。
            两种绑定方式没有优劣，但第一种较为常用。但是jQuery通常都是用第二种方式，因为可以和HTML进行脱离，把js代码统一到js中。

        Event 对象：（也就是参数e，直接调用即可）
            Event 对象代表事件的状态，比如事件在其中发生的元素、键盘按键的状态、鼠标的位置、鼠标按钮的状态。
            事件通常与函数结合使用，函数不会在事件发生前被执行！event对象在事件发生时系统已经创建好了,并且会在事件函数被调用时传给
            事件函数.我们获得仅仅需要接收一下即可.
            比如onkeydown,我们想知道哪个键被按下了，需要问下event对象的属性，这里就是KeyCode；

            思考：onclick＝function(event){}; onsubmit="return check()"这些方法是谁调用的？
                浏览器调用操作系统来执行onsubmit，因此要拿到一个值

            注:jQuery中的on方法传参data也是根据event来获取的

        事件传播：
            比如div中嵌套子div，两个里面都有触发的事件，此时点击子div，父div也会跟着触发事件 -- 称为事件延伸（传播）
            在子div中用event.stopPropagation()的方法即可进行阻止事件延伸


    增删改查演示：
        node的CURD：
            增:
                createElement(name)创建元素   通过document文档节点创建
                appendChild();将元素添加
            删:
                获得要删除的元素
                获得它的父元素
                使用removeChild()方法删除
            改:
                第一种方式:
                    使用上面增和删结合完成修改
                第二中方式:
                    使用setAttribute();方法修改属性
                    使用innerHTML属性修改元素的内容
            查:
                使用之前介绍的方法.（之前上文介绍的导航+全、局部查找）

    修改 HTML DOM ：
        改变 HTML 内容：
            改变元素内容的最简答的方法是使用 innerHTML ，innerText。
            （若要增加标签里面的数据，通常用innerHTML不用innerTEXT，因为innerHTML可以解析标签）
            注：而获取是若不是获取里面的标签整体则用innerText或是value（因为innerHTML可以解析标签，还有chrome这个傻逼会自动补字体
                代码，妈的智障，要小心。而value则不会出现这种情况）

        改变 CSS 样式 ：
            元素.style.fontSize...属性修改元素的样式，但一般不会这么干,前端要骂娘（.style后面设置要修改的属性）

        改变 HTML 属性：
            elementNode.setAttribute(name,value)        设置它的属性和值（参数都是字符串）
            elementNode.getAttribute(name)              直接获取属性对应的值
            <-------------->elementNode.value(DHTML：动态的意思，微软搞的)  直接.属性设值

        创建新的 HTML 元素：
            createElement(name)

        删除已有的 HTML 元素：
            elementNode.removeChild(node)

        关于class的操作：
            elementNode.className           （elementNode指的是标签对象）
            elementNode.classList.add       （名字列表  添加的是class 属性里面的名字）
            elementNode.classList.remove    （用来删除class属性中的名字）模态对话框中经常使用

特殊补充： 1.有时在源码中常出现<a href="javascript:void(0))">xxx</a>这种形式 javascript:后面可以接函数 function、alert 等，那么这是啥
这种方式其实就是和 onclick 一样的，javascript 在这里就是一个伪协议，告诉后面接的是 js 的代码。（有的人愿意用这种方式，但不推荐，
弊端：有时不支持这种方式（伪协议不标准）。因此还是该用 onclick 就用 onclick。a 标签中使用这个不用#主要是为了 url 中少一个#）
void 用于阻拦返回值。（因此意义在于阉割 a 标签）

    2.this方法：
        <div onclick="show(this)">asdaf</div>   若在点击事件的函数中写this有什么作用
        this的作用类似python中的self，代指对象。这里若通过show打印this可以看出是window对象，但是不用理会这个对象。this指代的就是
        当前点击的这个标签（对应函数中只要不用this当做参数用其他的什么都行，比如self）
        （有时想要点击摸个事件响应使其标签下的兄弟标签进行改动，那么仅仅通过this-self获取当前的标签再直接向下修改即可，省着在梳理层级关系）

        注:DHTML并不是在任何情况下都能使用的比如console.log()中就不能通过.value来调用属性对应的值。因此有时需要替换为getAttribute

    3.document.write() 和 innerHTML的区别：
        前者是一个方法，当用onload进行加载时，会重新刷新整个页面，而后者只会更改某个特定的标签样式

实例练习： 1.模态对话框：
利用 classList.add/.remove 实现增加或删除某个根据 class 绑定的样式单
error: 记住 for i in xx 之前先考虑清楚 i 拿到的是啥，对象？索引...尽量少用
2 省市联动： 1.不要在标签中写，要动态获取省市 json-data（利用获取 id 并.createElement("option")对 innerHTML 赋值.append 进行创建） 2.可以利用 this 来获取到点击 select 的值其中 selectedIndex 获取索引,options 获取对象，这些都是 dhtml 中的增强方法 3.通过 self.options[self.selectedIndex]).innerHTML 一句搞定键，少些一大堆，不然 dom 用 for 循环遍历获取、删除要多麻烦有多麻烦 4.删除也是通过 city.options.length = 0;这一句直接全删。简单明了
error:谷歌浏览器这个垃圾！用 innerHTML 会默认加上俩字体标签
坑:删除标签时通过 for 循环遍历发现删除标签会少删一个，是因为删除了第一个标签下一个标签索引会替代前一个的索引，因此要--，让每次
删除的元素都为第一个。遍历的 length 不断减小而删每次都只删第一个。 3.左右移动： 1.获取两侧元素，其中一侧的子标签利用 getElementsByTagName 进行获取 2.同上避免--坑 3.根据长度遍历 options，（options 中存放的是 6 个 option 的数组）再创建标签通过遍历里的元素根据索引获取对应的元素标签。 4.利用 append 把标签加到另一边。option 只有一个，因为没有创建和删除仅仅是把标签当做块来进行增加到另一边，因此 append 之后会一边的
标签会消失（没有新生成的不是 create 是 append 就不会有新标签生成）

js 的作用域链和闭包：
在 python 中 if 里面的语句（在 if 中声明的变量）是没有作用域的。
而 js 中也和 python 类似，在 if、for、while 中没有作用域而在函数中有作用域，也是由里像外。（但差异还是很大）
作用域：
例如:
var c= "global";
function cc() {
console.log(c);
var c= "local";
console.log(c);
}在全局声明变量 c，此时第一个输出为 undefined 而不是 global（C/C++、JAVA）有块级作用域）输出结果为 global，local 若局部
没有则在全局进行查找。而 python 则是内部直接禁止如此打印，因为内部有 local，不允许在声明前进行调用（函数内部作用域优先则不会访问局部）
若要访问则加 global 声明（严谨）。而 js 我就服了，它直接报 undefined，因为它内部解析第一句不是打印而是 var c;这是 js 的声明提前，解释器在
加载时会先把所有变量找好（解释器隐含这么做的 var c = undefined;）因此打印未定义！（js 的特殊性）

        这就是说js压根没有块级作用域，而是函数作用域.
        块作用域：{}
            在JAVA中以代码块即{} 作为作用域的。而作用域块中的变量只会在作用域里面生效。出去则失效。
        函数作用域：（函数作为作用域）
            所谓函数作用域就是说：变量在声明它们的函数体以及这个函数体嵌套的任意函数体内都是有定义的。 故 var c;（去特么的）
            不仅js没有py也没有块级作用域(if内部没有作用域，内把全局的直接覆盖)（因为python没有代码块，因此和js一样是函数作为作用域）

    闭包：
        和python也类似，那么为什么需要闭包呢：
            局部变量无法共享和长久的保存，而全局变量可能造成变量污染，所以我们希望有一种机制既可以长久的保存变量又不会造成全局污染。
        特点：
            占用更多内存，不容易被释放
        何时使用：
            既想反复使用，又想避免全局污染
        如何使用：
            1.定义外层函数，封装被保护的局部变量。
            2.定义内层函数，执行对外部函数变量的操作。
            3.外层函数返回内层函数的对象，并且外层函数被调用，结果保存在一个全局的变量中。

    注：js的坑爹加载方式，这是python等语言中没有的！（python可不是执行前先加载。而是从上到下走一行执行一行的）
        程序在代码执行之前有一个加载的过程。加载这一遍的时候程序什么都不会执行。（加载和执行是两个过程）
        也就是说js底层的堆跟栈的确有一个声明的过程的（若把声明改为匿名函数则不会有上面同名函数被覆盖的现象）

    作用域链（Scope Chain）：（在函数调用之前，作用域链已经存在）
         在JavaScript中，函数也是对象，实际上，JavaScript里一切都是对象。函数对象和其它对象一样，拥有可以通过代码访问的属性和一系列
         仅供JavaScript引擎访问的内部属性。其中一个内部属性是[[Scope]]，由ECMA-262标准第三版定义，该内部属性包含了函数被创建的作用
         域中对象的集合，这个集合被称为函数的作用域链，它决定了哪些数据能被函数访问。

            var x=1;
            function foo() {                            #foo的作用域链： fooScopeChain=[foo.AO, global.VO];
                var y = 2;
                function bar() {    var z = 3;  }       #bar的作用域链： barScopeChain=[bar.AO, foo.AO, global.VO];
            }
         什么是AO,VO?
            在函数创建时，每个函数都会创建一个活动对象Active Object(AO)，全局对象为Global Object(VO)，创建函数的过程也就是为这个对象
            添加属性的过程，作用域链就是由这些绑定了属性的活动对象构成的。

            例如：找x变量；bar函数在搜寻变量x的过程中，先从自身AO对象上找，如果bar.AO存在这个属性，那么会直接使用这个属性的值，如果不存在，
                则会转到父级函数的AO对象，也就是foo.AO
                如果找到x属性则使用，找不到继续 在global.VO对象查找，找到x的属性，返回属性值。如果在global.VO中没有找到，则会抛出异常ReferenceError

            执行上下文。
                函数在执行时会创建一个称为“执行上下文（execution context）”的内部对象，执行上下文定义了函数
                执行时的环境。每个执行上下文都有自己的作用域链，用于标识符解析，当执行上下文被创建时，而它的作用
                域链初始化为当前运行函数的[[Scope]]所包含的对象。
            函数执行
                在函数执行过程中，每遇到一个变量，都会检索从哪里获取和存储数据，该过程从作用域链头部，也就是从活
                动对象（AO，先找的也是AO）开始搜索，查找同名的标识符，如果找到了就使用这个标识符对应的变量，如果没有则继续搜索作用域
                链中的下一个对象，如果搜索完所有对象都未找到，则认为该标识符未定义，函数执行过程中，每个标识符都
                要经历这样的搜索过程。

        过程：（附图）
            1.函数进入全局，创建VO对象，绑定x属性<入栈>
                global.VO={x=underfind; foo:reference of function}(这里只是预解析，为AO对象绑定声明的属性，函数执行时才会执行赋
                    值语句，所以值是underfind)
            2.遇到foo函数，创建foo.AO，绑定y属性<入栈>
                foo.AO={y=underfind, bar:reference of function}
            3.遇到bar函数，创建bar.AO，绑定z属性<入栈>
                bar.AO={z:underfind}
            4.作用域链和执行上下文都会保存在堆栈中，所以：
                bar函数的scope chain为：[0]bar.AO-->[1]foo.AO-->[2]global.VO

              foo函数的scope chain为：[0]foo.AO-->[1]global.VO
            //建议：少定义全局变量
            //理由：因为作用域链是栈的结构，全局变量在栈底，每次访问全局变量都会遍历一次栈，//这样会影响效率

            函数的scope等于自身的AO对象加上父级的scope，也可以理解为一个函数的作用域等于自身活动对象加上父级作用域.

        注意：作用域链的非自己部分在函数对象被建立（函数声明、函数表达式）的时候建立，而不需要等到执行

    一道思考题：
        for (var i =1;i<10;i++){
            setTimeout(function timer() {
                console.log(i);
            },1000);
        }最后打印的是9个10，因为setTimeout要等一秒才打印，而for循环则瞬间执行完成，因此此后打印的都是10。
        不仅如此js甚至不会等你循环内部结束再执行后面的语句，而是直接执行（或理解为 为了整个页面的渲染）。若后面改动了i那么到时候打印
        出来的就是改动后的i
