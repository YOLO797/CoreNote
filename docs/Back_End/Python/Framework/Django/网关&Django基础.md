---
title: Django基础
order: 1
group:
  title: Django
  order: 22
---

---------------Web 框架篇----------------
Django~初识：

DRP 原则： Don't repeat yourself -- 避免重复是编程中重要的思想（这就是为啥要学函数，学类）学框架也是如此
为啥称为程序员为码农，因为他们搬砖，他们做的不是脑力活而是体力活

一 什么是 web 框架？
为了解决一个开放性的问题，设计出的具有一定约束的支撑结构使用框架可以帮你快速开发特定的系统。
简单地说: 就是你用别人搭建好的舞台来做表演。

    Web框架的实质：(参见web实质)
        对于所有的Web应用，本质上其实就是一个socket服务端，用户的浏览器其实就是一个socket客户端。
        所有的web框架，都是在socket前提上做的一步步的封装。

        当url回车后服务端（socket的服务端，通过socket来实现了其本质）拿到的是get请求发送过来的http协议请求头。此时没有响应信息，而解析请求或
        响应信息则涉及到底层的操作（不是我们该关心的）就是说，我不管你是怎么解析的，我只要把想要的东西能拿到就行（比如：host，进行键值对设定）

        Web应用的流程：
            1.浏览器发送一个HTTP请求
            2.服务器收到请求，生成一个HTML文档
            3.服务器把HTML文档作为HTTP响应的body发送给浏览器
            4.浏览器收到HTTP响应，从HTTP body中取出HTML文档并显示。（HTTP规范有一本书那么多，无需关心）

        而对于真实开发中的python web程序来说，一般会分为两部分：
            1.服务器程序：
                服务器程序负责对socket服务器进行封装，并在请求到来时，对请求的各种数据进行整理。

            2.应用程序：
                应用程序则负责具体的逻辑处理。为了方便应用程序的开发，就出现了众多的Web框架，例如：Django、Flask、web.py 等。不同的框架
                有不同的开发方式，但是无论如何，开发出的应用程序都要和服务器程序配合，才能为用户提供服务。这样，服务器程序就需要为不同的
                框架提供不同的支持。这样混乱的局面无论对于服务器还是框架，都是不好的。对服务器来说，需要支持各种不同框架，对框架来说，只有
                支持它的服务器才能被开发出的应用使用。这时候，标准化就变得尤为重要。我们可以设立一个标准，只要服务器程序支持这个标准，框架
                也支持这个标准，那么他们就可以配合使用。一旦标准确定，双方各自实现。这样，服务器可以支持更多支持标准的框架，框架也可以使用
                更多支持标准的服务器。

        最简单的Web应用就是先把HTML用文件保存好，用一个现成的HTTP服务器软件，接收用户请求，从文件中读取HTML，返回。

        如果要动态生成HTML，就需要把上述步骤自己来实现。不过，接受HTTP请求、解析HTTP请求、 ，如果我们自己来写这些
        底层代码，还没开始写动态HTML呢，就得花个把月去读HTTP规范。

        正确的做法是底层代码由专门的服务器软件实现，我们用Python专注于生成HTML文档。因为我们不希望接触到TCP连接、HTTP原始请求和响应格式，
        所以，需要一个统一的接口，让我们专心用Python编写Web业务。

        这个接口就是WSGI：Web Server Gateway Interface。网络服务网关接口（与网络相关的内容，要会用）


    WSGI（Web Server Gateway Interface）：
        是一种规范，它定义了使用python编写的web app与web server之间接口格式，实现web app与web server间的解耦。（参加10.4实质）
        python标准库提供的独立WSGI服务器称为wsgiref。（作为摸清原理使用，效率低下，开发中不用，会用其他的web服务器）

        from wsgiref.simple_server import make_server    #这里是依靠web服务器来实现简化并调用内部的makeserver（类似当时的socketserver，笔记5.2）

         # 这在最简单的基础上，完成功能的增强和简化过程（之前socket的方式仅能拿到bytes的头，若想解析十分繁琐）

        application即RunServer，就是解析请求，并返回结果给用户用的
        def application(environ, start_response):                       #函数名自己定义，请求内容都在environ中，start_response则是设定响应头
            """
            :param environ：一个包含所有HTTP请求信息的dict对象；
            :param start_response：一个发送HTTP响应的函数。
            :return: 将作为HTTP响应的Body（用户看到的页面）发送给浏览器。
            """

            Django 框架的开始                                            #之后Django经历生命周期，返回结果

            start_response("200 OK", [("Content-Type", "text/html")])   #按html解析，后面还有json...，

            # 自己设定响应头非常麻烦,这里第一个参数作为状态码，第二个参数是一个列表，
            # 里面是元组(多个)，每个元组是键值对，而这个键值对就是每个响应头，如果想给响应头设置信息仅仅设置元组即可

            return [b'<h1>Hello Web!</h1>']                             #拿到框架处理的返回结果，再返回给用户。

        httpd = make_server("127.0.0.1", 8080, application) #上面的函数作为一个参数传过去，构建出一个http对象

        # 虽然这个模块之前没有接触过，但和socket实现效果看似相同，能完成整个http解析还省事不少

        print("Server HTTP on port 8000 ....")

        # 开始监听HTTP请求
        httpd.serve_forever() #此时在内部才会调用application

        WSGI下的application()函数就是符合WSGI标准的一个HTTP处理函数为我们做了两件事：
            （1）：封装socket对象以及准备过程（socket，bind，listen）
            （2）：提供了两个接口：
                1.environ对象：封装成一个包含所有HTTP请求信息的dict对象。
                    if environ["PATH_INFO"] == "xx" return xx页面 PATH_INFO指路径（客户端要访问的路径）environ/index...

                2.start_response：一个发送HTTP响应的函数，可以很方便的设值响应头（响应码，响应信息）

        1.整个application()函数本身没有涉及到任何解析HTTP的部分，也就是说，底层代码不需要我们自己编写，我们只负责在更高层次上考虑如何响应请求。

        2.application()函数必须由WSGI服务器来调用。有很多符合WSGI规范的服务器，我们可以挑选一个来用。

        3.在application()函数中，调用：
            start_response('200 OK', [('Content-Type', 'text/html')])

            就发送了HTTP响应的Header，注意Header只能发送一次，也就是只能调用一次start_response()函数。
            start_response()函数接收两个参数，一个是HTTP响应码，一个是一组list表示的HTTP Header，每
            个Header用一个包含两个str的tuple表示。

        通常情况下，都应该把Content-Type头发送给浏览器。其他很多常用的HTTP Header也应该发送。

        然后，函数的返回值b'<h1>Hello, web!</h1>'将作为HTTP响应的Body发送给浏览器。（服务器自己的语法就能返回页面）

        有了WSGI，我们关心的就是如何从environ这个dict对象拿到HTTP请求信息，然后构造HTML，
        通过start_response()发送Header，最后返回Body。

        解耦：
            把彼此的功能都分隔开，即解耦。逻辑部分是逻辑部分，配置部分是配置部分，日志是日志...(把混杂在起一个解耦，使其没有那么强的关联性)

二 MVC 和 MTV 模式：
对上述的自制框架再解耦：
比如把路由放到新的文件(myweb 下的 urls)中，进行解耦。以后无论谁进入这个文件下都知道这个用来配置路径与函数的分配（路由系统的分配） 1.把各个页面的逻辑函数都放到 controller 下。之后 controller 就是放各个页面处理函数用的 2.再建一个 view 文件夹，用来存放各个页面的 html 3.最后再用 models 进行数据的获取(建对应的类，需要的就是写字段)用于创建数据库表以及操作数据库内容

    著名的MVC模式：所谓MVC就是把web应用分为模型(M),控制器(C),视图(V)三层；他们之间以一种插件似的，松耦合的方式连接在一起。
    模型负责业务对象与数据库的对象(ORM),视图负责与用户的交互(页面)，控制器(C)接受用户的输入调用模型和视图完成用户的请求。
        controller：来决定返回给用户的是什么内容。通过在controller里面拿到一个当前时间（通常是在model中请求，model响应后controller拿到数
        据），把时间（拿到的数据）嵌到html里面（view）

    Django的MTV模式本质上与MVC模式没有什么差别，也是各组件之间为了保持松耦合关系，只是定义上有些许不同，Django的MTV分别代表：
       Model(模型)：负责业务对象与数据库的对象(ORM)
       Template(模版)：负责如何把页面展示给用户（模板中有成套的模板语言）       --与MVC的view相似，存放html文件的
       View(视图)：负责业务逻辑，并在适当的时候调用Model和Template            --相当于MVC中的controller，存放视图函数（即页面的逻辑函数）

    此外，Django还有一个url分发器（url控制器即之前的server部分，被淡化），它的作用是将一个个URL的页面请求分发给不同的view处理，view再
    调用相应的Model和Template（因此这部分其实是控制，淡化了则成url控制器）

三 django 的流程和命令行工具：
Django 和之前自己写的框架是一样一样的，他比我写的框架就多了一个好处，就是功能全一点（比如说我的有十个功能，它顶多也就有一万个功能，笑）。

    django实现流程：（每一部分先做到不求甚解即可，先摸清外观，后面讨论内在）
        #安装： pip3 install django
          添加环境变量

        #1  创建project：
           django-admin startproject mysite .（注意末尾的 "."）

           ---mysite

              ---settings.py
              ---url.py
              ---wsgi.py

           ---- manage.py(启动文件)

        #2  创建APP ：
           python mannage.py startapp  app01

        #3  settings配置：
           TEMPLATES  （下有一个DIR值为路径表示去哪里找templates，老版本甚至没有配置）

           STATICFILES_DIRS=(
                os.path.join(BASE_DIR,"statics"),    #比如以后用到的静态文件如js、jQuery、图片等。统一放到新建的statics目录
            )                                        注：这里的路径名是自己定义的，而html中的则是根据STATIC_URL找的

           STATIC_URL = '/static/'  （这里可以修改名字，不知为啥默认的static也一直可以）
           #  我们只能用 STATIC_URL，但STATIC_URL会按着你的STATICFILES_DIRS去找
           注：这里的路径实质上是{{ STATIC_URL }}下保存的值,也就是'static'注意不是join拼接的没有s -- /static/jquery-3.3.1.min.js

        #4  根据需求设计代码：
               url.py
               view.py

        #5  使用模版：
           render(req,"index.html")

        #6  启动项目：
           python manage.py runserver  127.0.0.1:8090

        #7  连接数据库，操作数据：
           model.py


    django的命令行工具：（首先那就是先通过命令行创建一个Django）
        django-admin.py 是Django的一个用于管理任务的命令行工具，manage.py是对django－admin.py的简单包装,每一个Django Project里都会有
        一个mannage.py。

        <1> 如何创建一个Django项目呢？就通过 : django-admin.py startproject mysite 这句命令
            当前目录下会生成mysite的工程，目录结构如下：
                manage.py ----- Django项目里面的工具，通过它可以调用django shell和数据库等。（像是一个入口）
                settings.py ---- 包含了项目的默认设置，包括数据库信息，调试标志以及其他一些工作的变量。
                urls.py ----- 负责把URL模式映射到应用程序。（urls即路由分配，应用程序及视图函数views）
                --还有wsgi.py ----- Django也和我们之前一样用wsgi，只不过它又进行了封装其他内容（封装socket&解析http）

        <2>在mysite目录下创建blog应用: python manage.py startapp blog
            为什么要创建一个application？因为真正网站的应用可能不止一个（如支付、论坛、视频这就是三个application）但它们都是一个Django项目中的
            此时有多了还多文件，但对我们最有用的是models（数据库）和views（功能）。剩下的test用于检测，admin后面非常有用
            （Django之所以这么强大很大程度得益于admin和models（orm非常强大））migrations则是跟数据库有关系的（初始化）

        <3>启动django项目：python manage.py runserver 8080
            这样我们的django就启动起来了！当我们访问：http://127.0.0.1:8080/时就可以看到：

        <4>生成同步数据库的脚本：python manage.py makemigrations
            同步数据库:  python manage.py migrate

            注意：在开发过程中，数据库同步误操作之后，难免会遇到后面不能同步成功的情况，解决这个问题的一个简单粗暴方法是把migrations目录下
                的脚本（除__init__.py之外）全部删掉，再把数据库删掉之后创建一个新的数据库，数据库同步操作再重新做一遍。

            若出现：expected str, bytes or os.PathLike object, not NoneType
            大概率表示不仅仅删除了migrations目录下的文件都删了，但是没有删除文件夹，
            删除文件夹后运行python manage.py makemigrations + app名 即可

        <5>当我们访问http://127.0.0.1:8080/admin/时，会出现：（记住之前要先初始化数据库）
            所以我们需要为进入这个项目的后台创建超级管理员：python manage.py createsuperuser，设置好用户名和密码后便可登录啦！

        <6>清空数据库：python manage.py  flush

        <7>查询某个命令的详细信息： django-admin.py  help  startapp
            admin 是Django 自带的一个后台数据库管理系统。

        <8>启动交互界面 ：python manage.py  shell
            这个命令和直接运行 python 进入 shell 的区别是：你可以在这个 shell 里面调用当前项目的 models.py 中的 API，对于操作数据，还有一
            些小测试非常方便。

        <9> 终端上输入python manage.py 可以看到详细的列表，在忘记子名称的时候特别有用。

        实例练习：（这一系列参考mysite）
            －提交数据并展示
            －提交数据并展示(数据库)

        实例BUG汇总：(终于把bug清了，开心~)
            1.出现Database下db界面显示sqlite3异常（飘红）是由于没有安装相关支持的SDK-Xerial，因此无法显示
            2.出现App Mynewsite could not be found. Is it in INSTALLED_APPS?
                这时候需要在settings.py中找到INSTALLED_APPS =  添加app名 即后面加'blog'（如'Toure.apps.ToureConfig'）,告诉Django找哪一个app
            3.当数据库中没有添加的数据（应用名.表名）时，先运行manage.py makemigrations进行迁移，再运行python manage.py migrate --run-syncdb同步

四 Django 的配置文件(settings)：
一、概述：

     #静态文件交由Web服务器处理，Django本身不处理静态文件。简单的处理逻辑如下(以nginx为例)：

     #          URI请求-----> 按照Web服务器里面的配置规则先处理，以nginx为例，主要求配置在nginx.
                             #conf里的location

                         |---------->如果是静态文件，则由nginx直接处理

                         |---------->如果不是则交由Django处理，Django根据urls.py里面的规则进行匹配

    # 以上是部署到Web服务器后的处理方式，为了便于开发，Django提供了在开发环境的对静态文件的处理机制，方法是这样：

    #1、在INSTALLED_APPS里面加入'django.contrib.staticfiles',

    #2、在urls.py里面加入
       if settings.DEBUG:
           urlpatterns += patterns('', url(r'^media/(?P<path>.*)$',
           'django.views.static.serve', {'document_root': settings.MEDIA_ROOT }),
            url(r'^static/(?P<path>.*)$',
          'django.views.static.serve',{'document_root':settings.STATIC_ROOT}), )

    # 3、这样就可以在开发阶段直接使用静态文件了。

    二、MEDIA_ROOT和MEDIA_URL

            #而静态文件的处理又包括STATIC和MEDIA两类，这往往容易混淆，在Django里面是这样定义的：

            #MEDIA:指用户上传的文件，比如在Model里面的FileFIeld，ImageField上传的文件。如果你定义

            #MEDIA_ROOT=c:\temp\media，那么File=models.FileField(upload_to="abc/")＃，上传的文件就会被保存到c:\temp\media\abc
            #eg：
                class blog(models.Model):
                       Title=models.charField(max_length=64)
                       Photo=models.ImageField(upload_to="photo")
            #     上传的图片就上传到c:\temp\media\photo，而在模板中要显示该文件，则在这样写
            #在settings里面设置的MEDIA_ROOT必须是本地路径的绝对路径，一般是这样写:
                     BASE_DIR= os.path.abspath(os.path.dirname(__file__))
                     MEDIA_ROOT=os.path.join(BASE_DIR,'media/').replace('\\','/')

            #MEDIA_URL是指从浏览器访问时的地址前缀，举个例子：
                MEDIA_ROOT=c:\temp\media\photo
                MEDIA_URL="/data/"
            #在开发阶段,media的处理由django处理：

            #    访问http://localhost/data/abc/a.png就是访问c:\temp\media\photo\abc\a.png

            #    在模板里面这样写<img src="{{MEDIA_URL}}abc/a.png">

            #    在部署阶段最大的不同在于你必须让web服务器来处理media文件，因此你必须在web服务器中配置，
            #  以便能让web服务器能访问media文件
            #    以nginx为例，可以在nginx.conf里面这样：

                     location ~/media/{
                           root/temp/
                           break;
                        }

            #    具体可以参考如何在nginx部署django的资料。

    三、STATIC_ROOT和STATIC_URL、
        STATIC主要指的是如css,js,images这样文件，在settings里面可以配置STATIC_ROOT和STATIC_URL,
        配置方式与MEDIA_ROOT是一样的，但是要注意

        #STATIC文件一般保存在以下位置：

        #1、STATIC_ROOT：在settings里面设置，一般用来放一些公共的js,css,images等。

        #2、app的static文件夹，在每个app所在文夹均可以建立一个static文件夹，然后当运行collectstatic时，
        #    Django会遍历INSTALL_APPS里面所有app的static文件夹，将里面所有的文件复制到STATIC_ROOT。因此，
        #   如果你要建立可复用的app，那么你要将该app所需要的静态文件放在static文件夹中。

        # 也就是说一个项目引用了很多app，那么这个项目所需要的css,images等静态文件是分散在各个app的static文件的，比
        #  较典型的是admin应用。当你要发布时，需要将这些分散的static文件收集到一个地方就是STATIC_ROOT。

        #3、STATIC文件还可以配置STATICFILES_DIRS，指定额外的静态文件存储位置。
        #  STATIC_URL的含义与MEDIA_URL类似。

        # ----------------------------------------------------------------------------
        #注意1:
            #为了后端的更改不会影响前端的引入，避免造成前端大量修改

            STATIC_URL = '/static/'               #引用名
            STATICFILES_DIRS = (
                os.path.join(BASE_DIR,"statics")  #实际名 ,即实际文件夹的名字
            )

            #django对引用名和实际名进行映射,引用时,只能按照引用名来,不能按实际名去找
            #<script src="/statics/jquery-3.1.1.js"></script>
            #------error－－－－－不能直接用，必须用STATIC_URL = '/static/':
            #<script src="/static/jquery-3.1.1.js"></script>

        #注意2(statics文件夹写在不同的app下,静态文件的调用):

            STATIC_URL = '/static/'

            STATICFILES_DIRS=(
                ('hello',os.path.join(BASE_DIR,"app01","statics")) ,
            )

            #<script src="/static/hello/jquery-1.8.2.min.js"></script>

        #注意3:
            STATIC_URL = '/static/'
            {% load staticfiles %}
           # <script src={% static "jquery-1.8.2.min.js" %}></script>
