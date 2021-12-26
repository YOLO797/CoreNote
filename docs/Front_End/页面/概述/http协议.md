---
title: HTTP协议
order: 2
---

HTTP 协议:
HTTP（hypertext transport protocol），即超文本传输协议。这个协议详细规定了浏览器和万维网服务器之间互相通信的规则。

    HTTP就是一个通信规则，通信规则规定了客户端发送给服务器的内容格式，也规定了服务器发送给客户端的内容格式。其实我们要学习的就是这个两个格式！
    客户端发送给服务器的格式叫“请求协议”；服务器发送给客户端的格式叫“响应协议”。

    特点：（重要）
        1.HTTP叫超文本传输协议，基于请求/响应模式的！
        2.HTTP是无状态协议。连完就完。（FTP是有状态的）
            比如哔哩哔哩服务器把页面发送给浏览器后，就完了，每次操作都是这样。下次请求时不会保存上一次的记忆。而用户登录后则是根据cookie和
            session实现好似让它有了记录的功能，但其实服务器还是没有记录的，每次都是全新的。

    URL：统一资源定位符，就是一个网址：协议名://域名:端口/路径，例如：http://www.bilibili.com:80/index.html

    一、请求协议：request
        请求协议的格式如下：
            请求首行；  // 请求方式 、请求路径 、协议和版本，例如：GET 、/index.html 、HTTP/1.1
            请求头信息；// 请求头名称:请求头内容，即为key:value格式，例如：Host:localhost
            空行；     // 用来与请求体分隔开
            请求体。   // GET没有请求体，只有POST有请求体。

        浏览器发送给服务器的内容就这个格式的，如果不是这个格式服务器将无法解读！在HTTP协议中，请求有很多请求方法，其中最为常用的就是GET和POST。
        不同的请求方法之间的区别，后面会一点一点的介绍。

        1.GET请求：
            当输入一个url回车其实就向服务器发送了get请求。虽然你什么都没做，但浏览器把如下信息都告诉服务器了。如下是GET的请求内容。

        HTTP默认的请求方法就是GET
            * 没有请求体
            * 数据必须在1K之内！
            * GET请求数据会暴露在浏览器的地址栏中

        GET请求常用的操作：
            1. 在浏览器的地址栏中直接给出URL，那么就一定是GET请求
            2. 点击页面上的超链接也一定是GET请求
            3. 提交表单时，表单默认使用GET请求，但可以设置为POST

            Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
            Accept-Encoding:gzip, deflate, sdch
            Accept-Language:zh-CN,zh;q=0.8
            Cache-Control:no-cache          --缓存，现在还用不到
            Connection:keep-alive
            Cookie:csrftoken=z5H43ZwARx7AIJ82OEizBOWbsAQA2LPk
            Host:127.0.0.1:8090
            Pragma:no-cache
            Upgrade-Insecure-Requests:1
            User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36
            Name
            login/
            1 requests ❘ 737 B transferred ❘ Finish: 5 ms ❘ DOMContentLoaded: 14 ms ❘ Load: 14 ms（这部分在network的Request Headers中）

        GET 127.0.0.1:8090/login  HTTP/1.1：GET请求，请求服务器路径为  127.0.0.1:8090/login ，协议为1.1；

        Host:localhost：请求的主机名为localhost；

        *User-Agent: Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0：与浏览器和OS相关的信息。有些网站会显示用户的系统版本
            和浏览器版本信息，这都是通过获取User-Agent头信息而来的；（用户代理，有用）

        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8：告诉服务器，当前客户端可以接收的文档类型，其实这里包
            含了*/*，就表示什么都可以接收；

        Accept-Language: zh-cn,zh;q=0.5：当前客户端支持的语言，可以在浏览器的工具选项中找到语言相关信息；（简体中文和中文）

        Accept-Encoding: gzip, deflate：支持的压缩格式。数据在网络上传递时，可能服务器会把数据压缩后再发送；

        Accept-Charset: GB2312,utf-8;q=0.7,*;q=0.7：客户端支持的编码；

        Connection: keep-alive：客户端支持的链接方式，保持一段时间链接，默认为3000ms；（以前是close，表示立即断）

        Cookie: JSESSIONID=369766FDF6220F7803433C0B2DE36D98：每个人cookie是不一样的。
            第一次服务端不光会返回页面，还会把cookie返回给浏览器。而我下次再访问网站的时候，带着这个cookie去访问（在请求中把上一次服务器响应
            中发送过来的Cookie在请求中一并发送去过。这个Cookie的名字为JSESSIONID。），服务器那边就可以进行识别。判断这个cookie是谁，是不是
            已经登录了。若登录后就不要重复登录，直接显示你要看的内容。

        注意：
            1.HTTP无状态：无状态是指协议对于事务处理没有记忆能力，服务器不知道客户端是什么状态。从另一方面讲，打开一个服务器上的网页
                和你之前打开这个服务器上的网页之间没有任何联系
            2.如果你要实现一个购物车，需要借助于Cookie或Session或服务器端API（如NSAPI and ISAPI）记录这些信息，请求服务器结算页面时同时将这些
                信息提交到服务器
            3.当你登录到一个网站时，你的登录状态也是由Cookie或Session来“记忆”的，因为服务器并不知道你是否登录
                优点：服务器不用为每个客户端连接分配内存来记忆大量状态，也不用在客户端失去连接时去清理内存，以更高效地去处理WEB业务
                缺点：客户端的每次请求都需要携带相应参数，服务器需要处理这些参数

            容易犯的误区：
                1、HTTP是一个无状态的面向连接的协议，无状态不代表HTTP不能保持TCP连接，更不能代表HTTP使用的是UDP协议（无连接）
                2、从HTTP/1.1起，默认都开启了Keep-Alive，保持连接特性，简单地说，当一个网页打开完成后，客户端和服务器之间用于传输
                    HTTP数据的TCP连接不会关闭，如果客户端再次访问这个服务器上的网页，会继续使用这一条已经建立的连接
                3、Keep-Alive不会永久保持连接，它有一个保持时间，可以在不同的服务器软件（如Apache）中设定这个时间


        2　POST请求:（不安全！！）
            (1). 数据不会出现在地址栏中
            (2). 数据的大小没有上限
            (3). 有请求体
            (4). 请求体中如果存在中文，会使用URL编码！

            username=%E5%BC%A0%E4%B8%89&password=123（URL编码）

            为什么要进行URL编码：
                我们都知道Http协议中参数的传输是"key=value"这种键值对形式的，如果要传多个参数就需要用“&”符号对键值对进行分割。
                如"?name1=value1&name2=value2"，这样在服务端在收到这种字符串的时候，会用“&”分割出每一个参数，然后再用“=”来分割出参数值。

                针对“name1=value1&name2=value2”我们来说一下客户端到服务端的概念上解析过程:
                上述字符串在计算机中用ASCII吗表示为：
                    6E616D6531 3D 76616C756531 26 6E616D6532 3D 76616C756532。
                    6E616D6531：name1
                    3D：=
                    76616C756531：value1
                    26：&
                    6E616D6532：name2
                    3D：=
                    76616C756532：value2
                服务端在接收到该数据后就可以遍历该字节流，首先一个字节一个字节的吃，当吃到3D这字节后，服务端就知道前面吃得字节表示一个key，
                再向后吃，如果遇到26，说明从刚才吃的3D到26子节之间的是上一个key的value，以此类推就可以解析出客户端传过来的参数。

                现在有这样一个问题，如果我的参数值中就包含=或&这种特殊字符的时候该怎么办。
                比如说“name1=value1”,其中value1的值是“va&lu=e1”字符串，那么实际在传输过程中就会变成这样“name1=va&lu=e1”。
                我们的本意是就只有一个键值对，但是服务端会解析成两个键值对，这样就产生了歧义。

                如何解决上述问题带来的歧义呢？解决的办法就是对参数进行URL编码
                URL编码只是简单的在特殊字符的各个字节前加上%，例如，我们对上述会产生奇异的字符进行URL编码后结果：“name1=va%26lu%3De1”，
                这样服务端会把紧跟在“%”后的字节当成普通的字节，就是不会把它当成各个参数或键值对的分隔符。

            使用表单可以发POST请求，但表单默认是GET：（如下是POST提交表单后的请求内容）

                Request Headers
                Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
                Accept-Encoding:gzip, deflate
                Accept-Language:zh-CN,zh;q=0.8
                Cache-Control:no-cache
                Connection:keep-alive
                Content-Length:13
                Content-Type:application/x-www-form-urlencoded
                Cookie:csrftoken=z5H43ZwARx7AIJ82OEizBOWbsAQA2LPk
                Host:127.0.0.1:8090
                Origin:http://127.0.0.1:8090
                Pragma:no-cache
                Referer:http://127.0.0.1:8090/login/
                Upgrade-Insecure-Requests:1
                User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1)
                           AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36

                Form Data
                username:igarashi（这里是假设用了一个post表单，提交了igarashi为用户名）
                （正常来讲会封装成字典形式，但chrome浏览器封装了WebKit...形式，原理都是多出了一个请求体&内容 Request Payload）

            POST请求是可以有体的，而GET请求不能有请求体。
                Referer: http://localhost:8080/hello/index.jsp：请求来自哪个页面，例如你在百度上点击链接到了这里，那么Referer:
                    http://www.baidu.com；如果你是在浏览器的地址栏中直接输入的地址，那么就没有Referer这个请求头了；

                Content-Type: application/x-www-form-urlencoded：表单的数据类型，说明会使用url格式编码数据；url编码的数据都是以“%”为前缀，
                    后面跟随两位的16进制。（multipart/form-data 同理，enctype设置的）
                    注：这个很有用，Ajax和jQuery会反复用到Content-Type（其实就是url的编码方式，告诉服务器以哪种编码方式把数据编码了返回给我）
                    在<meta http-equiv="content-Type" charset=UTF8">中也有用到（不过省略了）还有请求头Refresh中也有content中存的2;url...

                Content-Length:13：请求体的长度，这里表示13个字节。

                keyword=igarashi：请求体内容！igarashi是在表单中输入的数据，keyword是表单字段的名字（如username）。

            Referer的应用：（记住，浏览器发送给服务器的这些请求数据服务器是可以获取并进行判断的）
                Referer请求头是比较有用的一个请求头，它可以用来做统计工作，也可以用来做防盗链。

                统计工作：我公司网站在百度上做了广告，但不知道在百度上做广告对我们网站的访问量是否有影响，那么可以对每个请求中的Referer进行分析，
                    如果Referer为百度的很多，那么说明用户都是通过百度找到我们公司网站的。（统计从哪里来的+次数）

                防盗链：我公司网站上有一个下载链接，而其他网站盗链了这个地址，例如在我网站上的index.html页面中有一个链接，点击即可下载JDK7.0，
                    但有某个人的微博中盗链了这个资源，它也有一个链接指向我们网站的JDK7.0，也就是说登录它的微博，点击链接就可以从我网站上下载
                    JDK7.0，这导致我们网站的广告没有看，但下载的却是我网站的资源。这时可以使用Referer进行防盗链，在资源被下载之前，我们对
                    Referer进行判断，如果请求来自本网站，那么允许下载，如果非本网站，先跳转到本网站看广告，然后再允许下载。


    二、响应协议：response
        1、响应内容
            响应协议的格式如下：
                --响应首行
                --响应头信息
                --空行
                --响应体

            响应内容是由服务器发送给浏览器的内容，浏览器会根据响应内容来显示。遇到<img src=''>会开一个新的线程加载，所以有时图片多的话，
            内容会先显示出来，然后图片才一张张加载出来。（如下是服务器的响应内容 -- 都是服务器告诉浏览器的信息）

                Request URL:http://127.0.0.1:8090/login/
                Request Method:GET
                Status Code:200 OK
                Remote Address:127.0.0.1:8090
                Response Headers
                view source
                Content-Type:text/html; charset=utf-8
                Date:Wed, 26 Oct 2016 06:48:50 GMT
                Server:WSGIServer/0.2 CPython/3.5.2
                X-Frame-Options:SAMEORIGIN

                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Title</title>
                </head>
                <body>
                <form action="/login/" method="post">
                  用户名：<input type="text" name="username"/>
                  <input type="submit" value="提交"/>
                </form>
                </body>
                </html>

            HTTP/1.1 200 OK：响应协议为HTTP1.1，状态码为200，表示请求成功，OK是对状态码的解释。

            Server:WSGIServer/0.2 CPython/3.5.2：服务器的版本信息。（这里是用Django WSGI服务器的版本信息）

            Content-Type: text/html;charset=UTF-8：响应体使用的编码为UTF-8。

            Content-Length: 724：响应体为724字节。

            Set-Cookie: JSESSIONID=C97E2B4C55553EAB46079A4F263435A4; Path=/hello：响应给客户端的Cookie。（第一次访问除了返回内容，还有cookie）

            Date: Wed, 25 Sep 2017 04:15:03 GMT：响应的时间，这可能会有8小时的时区差。

        2、状态码：
            响应头对浏览器来说很重要，它说明了响应的真正含义。例如200表示响应成功了，302表示重定向，这说明浏览器需要再发一个新的请求。

            200：请求成功，浏览器会把响应体内容（通常是html）显示在浏览器中；
            404：请求的资源没有找到，说明客户端错误的请求了不存在的资源；
            500：请求资源找到了，但服务器内部出现了错误；（服务器崩了）
            302：重定向，当响应码为302时，表示服务器要求浏览器重新再发一个请求，服务器会发送一个响应头Location，它指定了新请求的URL地址；

            304：当用户第一次请求index.html时，服务器会添加一个名为Last-Modified响应头，这个头说明了index.html的最后修改时间。（之后打包发给浏览器）
                浏览器会把index.html内容，以及最后响应时间缓存下来（缓存到磁盘）。当用户第二次请求index.html时，在请求中包含一个名为If-Modified-Since
                请求头，它的值就是第一次请求时服务器通过Last-Modified响应头发送给浏览器的值，即index.html最后的修改时间，If-Modified-Since请求
                头就是在告诉服务器，我这里浏览器缓存的index.html最后修改时间是这个,您看看现在的index.html最后修改时间是不是这个，如果还是，
                那么您就不用再响应这个index.html内容了，我会把缓存的内容直接显示出来。而服务器端会获取If-Modified-Since值，与index.html
                的当前最后修改时间比对，如果相同，服务器会发响应码304，表示index.html与浏览器上次缓存的相同，无需再次发送，浏览器可以显示
                自己的缓存页面，如果比对不同，那么说明index.html已经做了修改，服务器会响应200。
            （简单来说就是第一次打包个时间和页面，浏览器进行缓存，下一次访问时先让服务器看看是否缓存的文件和你要再次打包的一样，一样就直接从本地加载）

        3、其他响应头：
            告诉浏览器不要缓存的响应头：（服务器加上如下响应头，浏览器不再缓存，每次都更新给你发一次数据）
            <1>强制缓存：
                当客户端请求后，会先访问缓存数据库看缓存是否存在。如果存在则直接返回；不存在则请求真的服务器，响应后再写入缓存数据库。

                Expires: -1 或 Thu, 10 Nov 2018 08:45:11 GMT
                    表示缓存到期时间，是一个绝对的时间 (当前时间+缓存时间)
                    在响应消息头中，设置这个字段之后，就可以告诉浏览器，在未过期之前不需要再次请求。

                    缺点：
                        1.用户可能会将客户端本地的时间进行修改，而导致浏览器判断缓存失效，重新请求该资源。
                        2.写法太复杂了。表示时间的字符串多个空格，少个字母，都会导致非法属性从而设置失效。

                Cache-Control: no-cache 或  max-age=2592000
                    弥补Expires，该字段表示资源缓存的最大有效时间，在该时间内，客户端不需要向服务器发送请求。这两者的区别就是前者
                    是绝对时间，而后者是相对时间。Cache-control 的优先级高于 Expires

                    字段常用的值：（这些值可以混合使用）
                        max-age：即最大有效时间，在上面的例子中我们可以看到
                        must-revalidate：如果超过了 max-age 的时间，浏览器必须向服务器发送请求，验证资源是否还有效。
                        no-cache：虽然字面意思是“不要缓存”，但实际上还是要求客户端缓存内容的，只是是否使用这个内容由后续的对比来决定。
                        no-store: 真正意义上的“不要缓存”。所有内容都不走缓存，包括强制和对比。
                        public：所有的内容都可以被缓存 (包括客户端和代理服务器， 如 CDN)
                        private：所有的内容只有客户端才可以缓存，代理服务器不能缓存。默认值。

                Pragma:
                    在 HTTP/1.1 之前，如果想使用 no-cache，通常是使用 Pragma 字段。
                    no-cache：该字段唯一的值，只是浏览器约定俗成的实现，没有确切规范，缺乏可靠性。

            <2>对比缓存:
                见6.3 <3>

            <3>自动刷新响应头:
                浏览器会在3秒之后请求http://www.baidu.com：
                Refresh: 3;url=http://www.baidu.com

        4、HTML中指定响应头：（在服务器端将要发送给浏览器的html中指定）
            在HTMl页面中可以使用<meta http-equiv="" content="">来指定响应头，例如在index.html页面中给出
            <meta http-equiv="Refresh" content="3;url=http://www.baidu.com">，表示浏览器只会显示index.html页面3秒，
            然后自动跳转到http://www.baidu.com.

    注：请求头和请求内容  -- 中间用两个换行符换行
        其实GET和POST都不安全，都能抓包抓到。（POST是网络请求包数据封装到了FormData中，抓到了一样能分析。比如手机连了别人的wifi支付获取密
        码，通过wifi捕捉请求）

CSS
CSS 是 Cascading Style Sheets 的简称，中文称为层叠样式表，用来控制网页数据的表现，可以使网页的表现与数据内容分离。
（和 html 差很多，各种各样的样式控制方式） 这部分真的不再笔记了，太浪费时间。博客已下载。
注：以后在 pycharm 中加载网页其中路径下包含的文件名不要有类似 "+" 号这种的特殊字符出现，不然出现 404 无法访问！
