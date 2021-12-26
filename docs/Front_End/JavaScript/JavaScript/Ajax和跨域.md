---
title: Ajax和跨域
order: 4
---

AJAX
一 AJAX 预备知识：json 进阶：
1.1 什么是 JSON？
JSON(JavaScript Object Notation) 是一种轻量级的数据交换格式（主流）。JSON 是用字符串来表示 Javascript 对象；
请大家记住一句话：json 字符串就是 js 对象的一种表现形式(字符串的形式)即 js 中的原生对象
既然我们已经学过 python 的 json 模块，我们就用它来测试下 json 字符串和 json 对象到底是什么

            import json
            i=10
            s='hello'
            t=(1,4,6)
            l=[3,5,7]
            d={'name':"yuan"}

            json_str1=json.dumps(i)
            json_str2=json.dumps(s)
            json_str3=json.dumps(t)
            json_str4=json.dumps(l)
            json_str5=json.dumps(d)

            print(json_str1)   #'10'
            print(json_str2)   #'"hello"'
            print(json_str3)   #'[1, 4, 6]'
            print(json_str4)   #'[3, 5, 7]'
            print(json_str5)   #'{"name": "yuan"}'

        这里面的json_str就是json字符串；

        那么json字符串里都可以放哪些值呢？

        JSON字符串内的值：

        数字    （整数或浮点数）
        字符串 （在双引号中）
        逻辑值 （true 或 false）
        数组    （在方括号中）
        对象    （在花括号中，引号用双引）
        null

        看着是不是有点眼熟啊，对了，这就是咱们js的数据对象；不管是python还是其它语言，它们都有自己的数据类型，但如果要处理成json
        字符串那么，就要把数据换转成js对应的数据对象（比如python的元组就被处理成了数组，字典就被处理成object），再加上引号就是咱
        们的json字符串了；
        前端接受到json字符串，就可以通过JSON.parse()等方法解析成json对象(即js对象)直接使用了。

        之所以称json对象为js的子集，是因为像undefined,NaN,{'name':'igarashi'}等都不在json对象的范畴。

1.2 python 与 json 对象的对应：
python --> json --下面的这些都是 json 对象！！
dict object --注意 json 是个 js 中的对象,只是长得像 python 中的字典，py 中的 json.dump 只是转换为 json 中 object 的写法
list,tuple array
str,unicode string
int,long,float number
True true
False false
None null

1.3 .parse()和.stringify()
parse() 用于从一个 json 字符串中解析出 json 对象,如

    var str = '{"name":"igarashi","age":"23"}'

    结果：JSON.parse(str)     ------>  Object  {age: "23",name: "igarashi"}


    stringify()用于从一个json对象解析成json字符串，如

    var c= {a:1,b:2}

    结果：  JSON.stringify(c)     ------>      '{"a":1,"b":2}'

    注意1：单引号写在{}外，每个属性名都必须用双引号，否则会抛出异常。
    注意2:

        a={name:"igarashi"};   //ok
        b={'name':'igarashi'}; //ok
        c={"name":"igarashi"}; //ok

        alert(a.name);  //ok
        alert(a[name]); //undefined
        alert(a['name']) //ok

    坑：
        JSON.stringify() 是把对象！！！ -> 字符串  若原本就是字符串，则用了会出问题，会再次对字符串进行转义

1.4 django 向 js 发送数据
def login(request):
obj={'name':"igarashi"}
return render(request,'index.html',{"objs":json.dumps(obj)})
#----------------------------------
<script>
var temp={{ objs|safe }}
alert(temp.name);
alert(temp['name'])
</script>
此外，还可以通过下面介绍的 ajax 技术使 js 接受 django 相应的 json 数据。

1.5 JSON 与 XML 比较
可读性： XML 胜出；（仁者见仁，我就觉得 json 好）
解码难度：JSON 本身就是 JS 对象（主场作战），所以简单很多；
流行度： XML 已经流行好多年，但在 AJAX 领域，JSON 更受欢迎。（java 必学 XML）
注解：其实本没什么 json 对象，只是我们自己这么称呼罢了，所谓的 json 数据就是指 json 字符串，在前端解析出来的对象就是 js 对象的一部分！

二　什么是 AJAX：
AJAX（Asynchronous Javascript And XML）翻译成中文就是"异步 Javascript 和 XML"。即使用 Javascript 语言与服务器进行异步交互，传输的数据
为 XML（当然，传输的数据不只是 XML）。

    同步交互：客户端发出一个请求后，需要等待服务器响应结束后，才能发出第二个请求；
    异步交互：客户端发出一个请求后，无需等待服务器响应结束，就可以发出第二个请求。
    AJAX除了异步的特点外，还有一个就是：浏览器页面局部刷新；（这一特点给用户的感受是在不知不觉中完成请求和响应过程）

三 AJAX 常见应用情景：
当我们在百度中输入一个"萌"字后，会马上出现一个下拉列表！列表中显示的是包含"萌"字的 4 个关键字。

    其实这里就使用了AJAX技术！当文件框发生了输入变化时，浏览器会使用AJAX技术向服务器发送一个请求，查询包含"萌"字的前10个关键字，然后
    服务器会把查询到的结果响应给浏览器，最后浏览器把这4个关键字显示在下拉列表中。

    整个过程中页面没有刷新，只是刷新页面中的局部位置而已！
    当请求发出后，浏览器还可以进行其他操作，无需等待服务器的响应！

    当输入用户名后，把光标移动到其他表单项上时，浏览器会使用AJAX技术向服务器发出请求，服务器会查询名为igarashi的用户是否存在，最终服务器
    返回true表示名为igarashi的用户已经存在了，浏览器在得到结果后显示“用户名已被注册！”。

    整个过程中页面没有刷新，只是局部刷新了。在请求发出后，浏览器不用等待服务器响应结果就可以进行其他操作。
    注：此过程一般是在缓存redis等中完成，不会访问数据库，以后再论。

四 AJAX 的优缺点：
优点：
AJAX 使用 Javascript 技术向服务器发送异步请求;（能异步）
AJAX 无须刷新整个页面;（是局部）
因为服务器响应内容不再是整个页面，而是页面中的局部，所以 AJAX 性能高;（性能好）这里指相对一次完整的请求
缺点：
AJAX 并不适合所有场景，很多时候还是要使用同步交互;
AJAX 虽然提高了用户体验，但无形中向服务器发送的请求次数增多了，导致服务器压力增大;
因为 AJAX 是在浏览器中使用 Javascript 技术完成的，所以还需要处理浏览器兼容性问题;

五 AJAX 技术：
四步操作：
创建核心对象：var xmlhttp = XMLHTTPrequest() #step1
使用核心对象打开与服务器的连接；
发送请求
注册监听，监听服务器响应。

    XMLHTTPRequest：
        open(请求方式, URL, 是否异步)   #打开与服务器的连接，step2
        send(请求体)                   #发送请求，GET请求没有请求体，因此应send(null)保证所有浏览器识别） #step3
        onreadystatechange，指定监听函数，它会在xmlHttp对象的状态发生变化时被调用 #监听变为一个值，指代到了第几步  #step4
        readyState，当前xmlHttp对象的状态，其中4状态表示服务器响应结束
        status：服务器响应的状态码，只有服务器响应结束时才有这个东东，200表示响应成功；
        responseText：获取服务器的响应体，它只有在readyState为4时才能获取到！

六 AJAX 实现：
6.1 准备工作(后台设定)：
就是配置好 urls 并在 views 中建立一个函数专门来处理通过 open(PG 方法,/某页面/,)传递 ajax 的异步请求，并返回需要的响应

    6.2 AJAX核心（XMLHttpRequest）
        其实AJAX就是在Javascript中多添加了一个对象：XMLHttpRequest对象。所有的异步交互都是使用XMLHttpServlet对象完成的。也就是说，我们只
        需要学习一个Javascript的新对象即可。
        var xmlHttp = new XMLHttpRequest()；（大多数浏览器都支持DOM2规范）

        注意，各个浏览器对XMLHttpRequest的支持也是不同的！为了处理浏览器兼容问题，给出下面方法来创建XMLHttpRequest对象：见ajax.html

    6.3　打开与服务器的连接（open方法）
        当得到XMLHttpRequest对象后，就可以调用该对象的open()方法打开与服务器的连接了。open()方法的参数如下：

        open(method, url, async)：

        method：请求方式，通常为GET或POST；
        url：请求的服务器地址，例如：/ajaxdemo1/AServlet，若为GET请求，还可以在URL后追加参数；
        async：这个参数可以不给，默认值为true，表示异步请求；

        var xmlHttp = createXMLHttpRequest();
        xmlHttp.open("GET", "/ajax_get/", true);　

    6.4　发送请求
        当使用open打开连接后，就可以调用XMLHttpRequest对象的send()方法发送请求了。send()方法的参数为POST请求参数，即对应HTTP协议的请求
        体内容，若是GET请求，需要在URL后连接参数。

        注意：若没有参数，需要给出null为参数！若不给出null为参数，可能会导致FireFox浏览器不能正常发送请求！
        xmlHttp.send(null);

    6.5　接收服务器响应
        当请求发送出去后，服务器端Servlet就开始执行了，但服务器端的响应还没有接收到。接下来我们来接收服务器的响应。

        XMLHttpRequest对象有一个onreadystatechange事件，它会在XMLHttpRequest对象的状态发生变化时被调用。下面介绍一下XMLHttpRequest对象
        的5种状态：

            0：初始化未完成状态，只是创建了XMLHttpRequest对象，还未调用open()方法；
            1：请求已开始，open()方法已调用，但还没调用send()方法；
            2：请求发送完成状态，send()方法已调用；
            3：开始读取服务器响应；
            4：读取服务器响应结束。
        onreadystatechange事件会在状态为1、2、3、4时引发。（注意出现2、3、4则是由于代码顺序问题，放于open上面即可监听到1）

        　　下面代码会被执行四次！对应XMLHttpRequest的四种状态！
                xmlHttp.onreadystatechange = function() {
                    alert('hello');
                };

        但通常我们只关心最后一种状态，即读取服务器响应结束时，客户端才会做出改变。我们可以通过XMLHttpRequest对象的readyState属性来得到
        XMLHttpRequest对象的状态。
        还要关心服务器响应的状态码是否为200，其服务器响应为404，或500，那么就表示请求失败了。我们可以通过XMLHttpRequest对象的
        status属性得到服务器的状态码。

        xmlHttp.onreadystatechange = function() {
            if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                alert(xmlHttp.responseText);
            }
        };

        最后，我们还需要获取到服务器响应的内容，可以通过XMLHttpRequest对象的responseText得到服务器响应内容。（step4监听推荐放上面，防卡）

    6.6  if 发送POST请求：
        <1>需要设置请求头：xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            注意 :form表单会默认这个键值对;不设定，Web服务器会忽略请求体的内容。类似form表单的enctype="multipart/form-data"需要设置值

        <2>在发送时可以指定请求体了：xmlHttp.send("username=yuan&password=123") 在send中就是这样传值的，之后即可在对应views中获取

        !!!!!BUG setRequestHeader("Content-Type", "application/x-www-form-urlencoded");一定要放于open之后，别没脑子一股脑放于前面，还没
        open("POST"...)打开连接，设置什么请求头？还有发送POST一定要注意跨域问题也就是csrf
        利用在views中导入from django.views.decorators.csrf import csrf_exempt
        并在views处理ajax请求的函数前加@csrf_exempt   #csrf防御  -- 这样即可处理跨域禁止问题，得到数据

    思考：启动后台后，直接运行html，会怎么样？这就涉及到咱们一会要讲到的同源策略机制和跨域请求；

七　 AJAX 实例：
见代码 ajax.html func2() 1.在 username 表单字段中添加 onblur 事件，调用 send()方法；
2.send()方法获取 username 表单字段的内容，向服务器发送异步请求，参数为 username；
3.Django 的视图函数：获取 username 参数，判断是否为"igarashi"，如果是响应 true，否则响应 false

    注意:合理利用onblur和onchange 陷入死循环可用this.focus()防止

八 jquery 实现的 ajax：
8.1 快捷 API：
首先先不说$.ajax()这是最底层的方法
        先来说说$.get() 和 $.post()
        <1>$.get(url, [data], [callback], [type]) //data:可以不写，懒得再写之后触发的函数就用回调
<2>$.post(url, [data], [callback], [type]) //type: text|html|json|script（第四个参很少用到若数据不是 type 指定的则不执行回调）

            [callback]：回调函数的参数即是server端返回的response，若想要看回调函数中可以传多少参数可以用里面封装好的arguments
            得出["response数据","success（即stateText）",Object（即XMLHttpRequest对象,包含了readyState、state=200等等超多信息）]

        注：[] 表示可写可不写，建议把数据放入data而不是?=&传值，不然会涉及到url编码，见8.2 2POST下

        <3>$.getJSON()
            与$.get()是一样的，只不过就是做后一个参数type必须是json数据了。一般同域操作用$.get()就可以，$.getJson 最主要是用来进行
            jsonp跨域操作的。

        <4>$.getScript()使用 AJAX 请求，获取和运行 JavaScript:(想要什么时候用才会什么时候加载)

    论：为什么ajax请求后得到的HttpResponse("GET OK!")没有再另一个页面打开？
        因为之前的请求不是进行了整个页面的刷新，返回的OK就会给你看到整个页面。而ajax最大的特点就是局部刷新，不把页面整个返回。数据并不是放在页面上，
        而是放到XMLHttpRequest通过回调函数里面进行接收。

    8.2  核心API的基本使用：
        <1> $.ajax的两种写法：
            $.ajax("url",{})
            $.ajax({})          //{}里面是一组组键值对 url:"/  /"

        <2> $.ajax的基本使用：
            $.ajax({
                url:"//",
                data:{a:1,b:2},
                type:"GET",
                success:function(data){}    #注意这里若要用到data通常要加！
            })

        <3> 回调函数:
            $.ajax('/user/allusers', {
                beforeSend: function (jqXHR, settings) {
                    console.log(arguments);
                    jqXHR.setRequestHeader('test', 'haha');
                    jqXHR.testData = {a: 1, b: 2};
                },
                success: function (data) {//与上文callback的参数相同
                    console.log(arguments);
                },
                error: function (jqXHR, textStatus, err) {
                    // jqXHR: jQuery增强的xhr
                    // textStatus: 请求完成状态
                    // err: 底层通过throw抛出的异常对象，值与错误类型有关
                    console.log(arguments);
                },
                complete: function (jqXHR, textStatus) {//无论成功失败都能放到里面
                    // jqXHR: jQuery增强的xhr
                    // textStatus: 请求完成状态 success | error
                    console.log('statusCode: %d, statusText: %s', jqXHR.status, jqXHR.statusText);
                    console.log('textStatus: %s', textStatus);
                },
                statusCode: {
                    '403': function (jqXHR, textStatus, err) {
                        console.log(arguments);  //注意：后端模拟errror方式：HttpResponse.status_code=500
                    },
                    '400': function () {
                    }
                }//若要模拟直接在views中HttpResponse.status_code="400"即可
            });

    8.3  核心API的重要字段(参数)：
        <1> ----------请求数据相关: data, processData, contentType, traditional--------------

            data: 当前ajax请求要携带的数据，是一个json的object对象，ajax方法就会默认地把它编码成某种格式
                (urlencoded:?a=1&b=2)发送给服务端；此外，ajax默认以get方式发送请求。

            processData：声明当前的data数据是否进行转码或预处理，默认为true，即预处理。若设置为false，那么对data：{a:1,b:2}会调用json对象
                的toString()方法，即{a:1,b:2}.toString(),最后得到一个［object，Object］形式的结果。

                该属性的意义在于，当data是一个dom结构或者xml数据(或二进制文件)时，我们希望数据不要进行处理，直接发过去，就可以讲其设为true。

            contentType：默认值: "application/x-www-form-urlencoded"。发送信息至服务器时内容编码类型。
                用来指明当前请求的数据编码格式；urlencoded:?a=1&b=2；如果想以其他方式提交数据，比如contentType:"application/json"，
                即向服务器发送一个json字符串：

            traditional：一般是我们的data数据有数组时会用到 ：data:{a:22,b:33,c:["x","y"]}, traditional为false会对数据进行深层次迭代；

        <2> ------------------------ 响应数据: dataType、dataFilter------------------------
            dataType：预期服务器返回的数据类型,服务器端返回的数据会根据这个值解析后，传递给回调函数。（告诉服务器我想要啥数据，你得给我）
                默认不需要显性指定这个属性，ajax会根据服务器返回的content Type来进行转换；dataType的可用值：html｜xml｜json｜text｜script

            dataFilter: 类型：Function 给 Ajax返回的原始数据的进行预处理的函数。（不重要）

        <3> 请求类型 type：GET、POST。默认为 "GET"。注意：其它 HTTP 请求方法，如 PUT 和 DELETE 也可以使用，但仅部分浏览器支持。

        <4> 前置处理 beforeSend(XHR)
            类型：Function 发送请求前可修改 XMLHttpRequest 对象的函数，如添加自定义 HTTP 头。XMLHttpRequest
            对象是唯一的参数。这是一个 Ajax 事件。如果返回 false 可以取消本次 ajax 请求。

        <5> jsonp  类型：String
            在一个 jsonp 请求中重写回调函数的名字。这个值用来替代在 "callback=?" 这种 GET 或 POST 请求中 URL
            参数里的 "callback" 部分，比如 {jsonp:'onJsonPLoad'} 会导致将 "onJsonPLoad=?" 传给服务器。

        <6> jsonpCallback  类型：String
            为 jsonp 请求指定一个回调函数名。这个值将用来取代 jQuery 自动生成的随机函数名。这主要用来让 jQuery 生成度独特的函数名，
            这样管理请求更容易，也能方便地提供回调函数和错误处理。你也可以在想让浏览器缓存 GET 请求的时候，指定这个回调函数名。

额外：csrf 跨站请求伪造：
假设现在有银行网站和非法网站，若用户表单提交了密码，此时我后台向银行页面提交，这是禁止的才行。csrf 为了防止则会给你一个随机字符串，
你发送表单数据必须携带 csrf 之前给你的随机字符串（上一次请求获取到的，因为正常的 post 请求一定是第二次请求，一定是先 get 才能 post。第一次
GET 请求我先把 csrf 的随机字符串给你，下次你用随机字符串发送数据）

    django为用户实现防止跨站请求伪造的功能，通过中间件 django.middleware.csrf.CsrfViewMiddleware 来完成。而对于django中设置防跨站
    请求伪造功能有分为全局和局部。

    全局：
    　　中间件 django.middleware.csrf.CsrfViewMiddleware

    局部：
        @csrf_protect，为当前函数强制设置防跨站请求伪造功能，即便settings中没有设置全局中间件。
        @csrf_exempt，取消当前函数防跨站请求伪造功能，即便settings中设置了全局中间件。

    注：导入from django.views.decorators.csrf import csrf_exempt,csrf_protect

    对于传统的form，可以通过表单的方式将token再次发送到服务端，而对于ajax的话，使用如下方式。
        $.ajaxSetup({
            data: {csrfmiddlewaretoken: '{{ csrf_token }}' },  //虽然这里写的是ajaxSetup,其实只是在ajax里面加上data的的键值对即可
        });
        OR：
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

九 跨域请求（重点！！！） -- 对于 JSONP，根本没用到 ajax 也就是 XMLHttpRequest
9.1 同源策略机制（必会）：
为什么 ajax 能够通过 url 来访问到 urls 下的路径呢？因为启动 Django 输入的"http://127.0.0.1:8080"就是源（同源的源即这部分）
而若不运行 Django 打开网页，此时虽然能渲染页面，这是本机的 IP 地址+浏览器分配的端口组成的源"http://localhost:63342"
因此此时无法根据 Django 开的服务器下的路径来访问数据。

        浏览器有一个很重要的概念——同源策略(Same-Origin Policy)。所谓同源是指，域名，协议，端口相同。不同源的客户端脚本(javascript、
        ActionScript)在没明确授权的情况下，不能读写对方的资源。
        简单的来说，浏览器允许包含在页面A的脚本访问第二个页面B的数据资源，这一切是建立在A和B页面是同源的基础上。
        如果Web世界没有同源策略，当你登录淘宝账号并打开另一个站点时，这个站点上的JavaScript可以跨域读取你的淘宝账号数据，这样整个Web世界就无隐私可言了。

    9.2 跨域：
        由于浏览器的同源策略，它不准你跨域（不准你的127.0.0.1:8000项目到127.0.0.1:8001去访问数据）
        其实对于黑客来说，什么都阻碍不了，现在什么网站，你要说想搞掉它，技术上都可以实现。同源策略上的确提供了一些防护，但没有东西是绝对安全的。
        因此要在浏览器的同源阻碍下获取数据就需要一个script标签，这个特点就是<script>中的src可以跨域请求数据（想想之前debug前端的第三方js脚本）
        但凡有src就都能跨域图片、视频等等... src就是通过jsonp的技术实现跨域请求。

        既然如此，同源岂不是显得很没意义，木马也可以通过src直接访问？不，其实是有意义的，木马要访问它首先要知道接口，项目中还必须返回jsonp的格式，
        通过jsonp发送只能通过GET方式

    9.3 jsonp的js实现：（这里参考要双开，用了另一个Django来测试）
        JSONP是JSON with Padding的略称,即json+padding(Padding这里我们理解为填充)。可以让网页从别的域名（网站）那获取资料，即跨域读取数据。
        它是一个非官方的协议，它允许在服务器端集成Script tags返回至客户端，通过javascript callback的形式实现跨域访问（这仅仅是JSONP简单的实现形式）
        jsonp不是技术，而是一种策略。（原理即script标签的src有地址就会自动请求，和img同）

        <script>
            function fun1(arg){
                alert("igarashi: "+arg)
            }
        </script>
        <script src="http://127.0.0.1:8002/get_byjsonp/"></script>  之后8001利用src访问8002，8002就 return HttpResponse('fun1("kakkoii")')
        在写有这个script标签用来跨域访问的页面上进行访问，此时回调出跨域的数据(注意要开8002)

        这其实就是JSONP的简单实现模式，或者说是JSONP的原型：创建一个回调函数，然后在远程服务上调用这个函数并且将JSON 数据形式作为参数传递，完成回调。
        将JSON数据填充进回调函数，这应该就是JSONP的JSON+Padding的含义吧。
        一般情况下，我们希望这个script标签能够动态的调用，而不是像上面因为固定在html里面所以没等页面显示就执行了，很不灵活。我们可以通过javascript
        动态的创建script标签，这样我们就可以灵活调用远程服务了。

        function addScriptTag(src){ //动态创建script标签
            var script = document.createElement('script');  //创建script标签
            script.setAttribute("type","text/javascript");  //为其指定属性
            script.src = src;                               //路径当做参数
            document.body.appendChild(script);              //最后把标签添加到body里面
            document.body.removeChild(script);
        }

        为了更加灵活，现在将你自己在客户端定义的回调函数的函数名传送给服务端，服务端则会返回以你定义的回调函数名的方法，将获取的json数据
        传入这个方法完成回调：
        <button onclick="f()">submit</button>
        <script>
            function fetch(arg){
                alert("Hello "+arg)
            }
            function f(){
                 addScriptTag("http://127.0.0.1:8002/get_byjsonp/?callbacks=fetch")
                 //get_byjsonp是路径（自己定义）传入的callbacks=fetch告诉服务端是哪一个函数名
            }
        </script>
        ----------------------views.py
        def get_byjsonp(req):

            func=req.GET.get("callbacks",None)   #通过get进行取值，娶到callback对应的值，这个值即是前端的函数名

            return HttpResponse("%s('igarashi')"%func)  #拼接

    9.4 jQuery对JSONP的实现（上面的实现方式显得有些繁琐）
        jQuery框架也当然支持JSONP，可以使用$.getJSON(url,[data],[callback])方法
        <script type="text/javascript">
            $.getJSON("http://127.0.0.1:8002/get_byjsonp?callback=?",function(arg){//此处?是由于callback后跟着回调函数
                alert("hello"+arg)                                                //按理来说应写在上面，此处则当做参数。
            });                                                                   //以后执行这个参数则执行function代码
        </script>   //callback=?传到后端则后端会随机给callback写一个字符串当做函数名字（但它是什么并不重要，还是按如上方式转）

        结果是一样的，要注意的是在url的后面必须添加一个callback参数，这样getJSON方法才会知道是用JSONP方式去访问服务，callback后面的
        那个问号是内部自动生成的一个回调函数名。
        此外，如果说我们想指定自己的回调函数名，或者说服务上规定了固定回调函数名该怎么办呢？我们可以使用$.ajax方法来实现

        <script type="text/javascript">
           $.ajax({
                url:"http://127.0.0.1:8002/get_byjsonp",
                dataType:"jsonp",
                jsonp: 'callbacks',
                jsonpCallback:"SayHi"
           });                          //$.ajax()会把jsonp和jsonpCallback组合为键值对"callbacks":"SayHi"发送过去
            function SayHi(arg){
                alert(arg);
            }
        </script>

        #--------------------------------- http://127.0.0.1:8002/get_byjsonp
        def get_byjsonp(req):

        callback=req.GET.get('callbacks')
        print(callback)
        return HttpResponse('%s("igarashi")'%callback)

        当然，最简单的形式还是通过回调函数来处理：（也就是无需像上文创建一个SayHi函数，直接写回调到ajax里面）
        dataType:"jsonp",           //必须有，告诉server，这次访问要的是一个jsonp的结果。
        jsonp: 'callbacks',         //jQuery帮助随机生成的：callbacks="wner"
        success:function(data){     //替代上文的jsonpCallback和后面的function
            alert(data)
        }

        jsonp: 'callbacks'就是定义一个存放回调函数的键，jsonpCallback是前端定义好的回调函数方法名'SayHi'，server端接受callback键对
        应值后就可以在其中填充数据打包返回了;

        jsonpCallback参数可以不定义，jquery会自动定义一个随机名发过去，那前端就得用回调函数来处理对应数据了。
        利用jQuery可以很方便的实现JSONP来进行跨域访问。　
