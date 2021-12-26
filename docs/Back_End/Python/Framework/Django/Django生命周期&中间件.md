---
title: Django进阶三
order: 4
---

零、在浏览器中输入 URL，在 Django 中都发生了什么？

    生命周期：（椭圆形周期）
        用户请求————>匹配路由规则/login/->login————>对应匹配def login(req):—————>返回渲染/login/——————>返回用户

        其实，在视图函数的前面，还挡了一部分功能，这部分功能即是管道。

    管道：
        管道是竖着的，用户请求则需要经过一系列的管道，返回用户时也要再次经历几个管道。跨过的管道即是中间件。在Python-Django中体现为类。
        假设有三个中间件，就是经过三个类，经过这些类的方法。出去的时候也经过方法。

        但方法与方法还不一样，在各个管道中，进来的是各个管道的方法一、出去的则是各个管道的方法二

一、Django 请求的生命周期：（重要！！）

    - Web框架的本质：socket       那么Django里面有没有socket？    --  没有  虽然Django里面没有socket，但是Django用来别人的socket
    - 别人的socket + Django       各种各样的Server，如WSGIRefServer、GeventServer等。
    - 这些Server需要遵循一个规范，这个规范即是WSGI（Web服务网关接口）
    - Django默认用的就是 wsgiref + Django （配合测试，性能低下，生产环境不能用 uWSGI+ Django）

    1.实质：
        socket              - 用来接收用户的http请求头、体
            client.recv()   - 接收请求并解析处理，请求相关
                Django层    - 这就是Django框架的开始
            client.send()   - 产出字符串
        s/c.close           - 一次访问完毕

        因此上下部分的socket都是别人提供的，因此约束，scoket必须要做几件事：
            1.处理请求相关的信息，拿到头、体做一个解析
            2.把解析的结果给Django，等待Django返回用户的信息
            3.拿到返回的信息发送给用户

        from wsgiref.simple_server import make_server

        def RunServer(environ, start_response):
            Django框架的开始：
            中间件
            路由系统
            视图函数、数据库、模板引擎渲染。。。

            start_response("200 OK", [("Content-Type", "text/html")])       #最后再拿出一个响应头
            return [bytes("Django返回结果",encoding="utf-8")]               #再拿出个响应体，返回给用户

        httpd = make_server("127.0.0.1", 8080, application)

        httpd.serve_forever()

        在wsgi.py中的WSGIHandler的call方法中与上大体相同，里面即是所有请求经过的一步步过程

    2.HTTP请求的完整流程：
        用户请求————>WSGI（经过这套协议下的各种Server）——————>Django(中间件————>匹配路由规则/login/->login——————————————————————
                                                                                                                           |
        返回用户<————交给WSGI<————Django完(中间件<————调用模板渲染/login/<————调用数据库<————对应匹配视图函数：def login(req):<——

二、Django 中间件：

    中间件：即settings中的MIDDLEWARE的设置。django 中的中间件（middleware），在django中，中间件其实就是一个类，在请求到来和结束后，
        django会根据自己的规则在合适的时机执行中间件中相应的方法。

    1.用户请求则是经过MIDDLEWARE里面的一层层中间件才到达视图函数。
    2.视图函数返回HttpResponse则在经过MIDDLEWARE里面的一层层中间件返回才发送给用户。

    其中接触的有csrf，即是在方法一里面拿到req，看看有无csrf_token。如果有的话继续执行，没有则进行报错
    （此时没有执行视图函数，直接执行之前管道--各个中间件的方法二，返回用户错误信息）

    注：Django1.7之类的老版本则是在出错，跳到最后的中间件，再返回。

    黑名单功能：
        req中可以拿到所有用户的ip，此时可以列一个列表，每次进行比对。如果在则直接返回黑名单用户的请求。不在则通过验证继续执行。

    1、自定义中间件：（前两个方法必会）
        根据settings中的各个MIDDLEWARE类，发现都共有process_request 和 process_response方法，故
        <0>：导入from django.utils.deprecation impot MiddlewareMixin
        <1>：继承MiddlewareMixin类
        <2>：重写process_request(self,request) 和 process_response(self,request,response)方法
        <3>：此时会报错，原因是process_request会把其中的request层层传递，而process_response方法的response则必需要return用户才能获取。

        注：可以导入from django.shortcuts import HttpResponse，并在process_request方法中return HttpResponse("停止")  则可以直接
            返回用户响应的信息 -- 停止  那么这样就问题来了，请求没有进入视图函数则返回！！因此不要在process_request轻易返回值。

    2.其他的三个方法：
        def process_view(self,request,callback,callback_args,callback_kwargs):  #   其中callback就是视图函数view
            response = callback(request,*callback_args,**callback_kwargs):  #   提前执行视图函数view，（不会再执行后面的process_view）
            return response #   此时返回HTTPResponse，跳到最后一个中间件的process_response方法，一步步返回

        def process_exception(self,request,exception):
            print("m1.process_exception")
            return HttpResponse("错误了")  #   若此时进行异常处理，则不再执行后续exception，直接跳到最后中间件的response

        两道闪电：
            <1>.请求先是从用户发送到中间件执行所有的request，之后返回执行所有的view，之后到达view视图函数
            <2>.若报错则从最后执行异常，执行完报错，再跳回最后的response，执行到第一个返回给用户

        def process_template_response(self,request,response):
            print("m1.process_template")
            return response
        此时没有任何现象发生，因为它对视图函数的返回值有一定的要求，返回对象中若有render方法，这个函数才被调用
        -因此构造类：

        class Foo:
            def __init__(self, req,status,msg):
                self.req = req
                self.status = status
                self.msg = msg

            def render(self):
                import json
                ret = {
                    "status":self.status,
                    "msg":self.msg,
                }
                # return HttpResponse("返回template中间件")
                return HttpResponse(json.dumps(ret))

        -视图函数中：
            obj = Foo(req)
            return obj          此时出现template

        那么它有啥用？     -- 封装
            用处就是封装，若不知道Foo里面有什么，只用返回一个Foo的对象obj即可。在视图函数中，若代码特别多，则可以转接到一个类进行处理。
            把业务代码都放到Foo类内的render方法中

        因此以后可以把ajax请求的返回都封装到Foo类中，返回用：return Foo(req,True,"错误信息")

        只是可以做一定的组件化，没有也一样。因此作用就是抽出来解耦 class JsonResponse:   - 以后的ajax请求返回都调用此序列化即可

    3，注册中间件：
        在setting中添加列表MIDDLEWARE = [

        ]即可

    4.应用：
        -用户请求的日志：每次都记录用户的请求，若有100个视图函数难不成请求日志写一百遍？
        -黑名单
        -缓存：另外一台机器内存里面的东西，所有请求先来，先去缓存中看看有没有，有的话就从缓存中直接给你，没有再去数据库拿。

        场景：对所有请求、或一部分请求做批量处理时利用中间件
