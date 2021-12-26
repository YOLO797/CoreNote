---
title: Nginx（Ubuntu）
order: 1
---

生产环境的部署：
一、web server 简介：
之前的项目都是用自带的 WSGI：很垃圾，测试用。无法处理并发，30 个服务器崩溃，极限了。
Apache：早期的，之前的主流。起线程，来一个连接，起一个线程，因此处理并发能力有限（一千个就差不多了）。
Nginx：现在的主流，比 Apache 轻量，处理并发的能力比 Apache 强很多（更能承载高并发）因为底层用的是 epoll（IO 多路复用）。因此处理上万个并发。

    二、如何在生产上部署Django：
        Django的部署可以有很多方式，采用nginx+uwsgi+Django的方式是其中比较常见的一种方式。

    三、uwsgi介绍：
        uWSGI本身就是一个Web服务器（web server），它完全可以不跟Nginx搭配就能承载高并发，但是大家都这么干，也不知道为什么，大概就是Nginx稳定吧。
        uWSGI实现了WSGI协议、uwsgi、http等协议。Nginx中HttpUwsgiModule（是一个模块）的作用是与uWSGI服务器进行交换。

        Nginx：其实是用来承载静态页面（但uWSGI其实也能承载静态页面），

        要注意 WSGI / uwsgi / uWSGI 这三个概念的区分。（注意大小写）

        1.WSGI是一种Web服务器网关接口。它是一个Web服务器（如nginx，uWSGI等服务器）与web应用（如用Flask框架写的程序）通信的一种规范。

        2.uwsgi是一种线路协议而不是通信协议，在此常用于在uWSGI服务器与其他网络服务器的数据通信。（为uWSGI量身定制的线路协议，是协议！）

        3.而uWSGI是实现了uwsgi和WSGI两种协议的Web服务器。

        4.uwsgi协议是一个uWSGI服务器自有的协议，它用于定义传输信息的类型（type of information），每一个uwsgi packet前4byte为传输信息类型描述，
            它与WSGI相比是两样东西。（之前代替它的是fast cgi协议，性能低了10倍）

        用户请求到你的Django流程：
            user（用户）--->nginx（把数据发给nginx服务器）--->uwsgi（通过uwsgi协议）--->uWSGI（转发给uWSGI服务器）--->Django（再转发给Django）
            注意：uWSGI和Nginx之间是架了一个本地的unix socket，之后会把请求转到这个socket上

        uWSGI的主要特点如下：（uwsgi启用5个workers就能处理约2000个并发，约数十万用户，见图）
            1.超快的性能
            2.低内存占用（实测为apache2的mod_wsgi（这是个模块）一半左右）
            3.多app管理（终于不用冥思苦想下个app用哪个端口比较好了-.-）
            4.详尽的日志功能（可以用来分析app性能和瓶颈）
            5.高度可定制（内存大小限制，服务一定次数后重启等）

        总而言之uwgi是个部署用的好东东，正如uWSGI作者所吹嘘的：生产环境，就用uWSGI

    四、uWSGI 安装使用：
        <1>安装：
            # Install the latest stable release:
            pip install uwsgi
            # ... or if you want to install the latest LTS (long term support) release,
            pip install https://projects.unbit.it/downloads/uwsgi-lts.tar.gz

        <2>基本测试：
            mkdir uWSGI_test dir and Create a file called test.py:

            # test.py
            def application(env, start_response):
                start_response('200 OK', [('Content-Type','text/html')])
                return [b"Hello World"] # python3
                #return ["Hello World"] # python2
            运行:
            uwsgi --http :8000 --wsgi-file test.py

        <3>用uwsgi 启动django
            uwsgi --http :8000 --module mysite.wsgi（这个mysite在你的Django工程目录下自带）

            之后可以把参数写到配置文件里：
                igarashi@igarashi-ubuntu:~/uwsgi-test$ more crazye-uwsgi.ini

                [uwsgi]
                http = :9000
                    #the local unix socket file than commnuincate to Nginx这就是之前提到的和Nginx的socket通信的进程
                socket = 127.0.0.1:8001
                    # the base directory (full path)告诉uWSGI项目的BASE_DIR
                chdir = /home/alex/CrazyEye
                    # Django's wsgi file因为上面写了绝对路径，此时直接写路径即可
                wsgi-file = CrazyEye/wsgi.py
                    # maximum number of worker processes启动四个进程
                processes = 4
                    #thread numbers startched in each worker process每个进程里面启两个线程
                threads = 2

                    #monitor uwsgi status监控命令，监控后台。启动则会多一个进程
                stats = 127.0.0.1:9191
                    # clear environment on exit退出时把相关的环境、环境变量清除掉
                vacuum          = true

            启动：
                /usr/local/bin/uwsgi crazye-uwsgi.ini

        备注：
            ps -ef |grep uwsgi     #查看uwsgi启动的进程
            sudo apt-cache search uwsgi |grep uwsgi     #全库搜索和uwsgi相关的包等等
            sudo pip3 install uwsgitop  #安装uwsgi的监控
                之后 uwsgitop :9191 端口号 #即可进行监控



    五、Nginx安装使用：
        Nginx不仅仅可以服务python，还可以服务java、php、等等等等

        安装：
            sudo apt-get install nginx
            sudo /etc/init.d/nginx start    # start nginx

        Nginx配置：
            cd /etc/nginx   #切换到nginx下
            ls 出现sites-enabled  #java、php、python的程序放在这个下面
            more、vim sites-enabled/default  #查看、或编辑。里面有server，监听端口是80，443是https需要证书，root默认路径。这就是nginx的配置。

        接下来看看python怎么玩.

        为你的项目生成Nginx配置文件:
            想要与uwsgi通信，需要有uwsgi_params（这在新版的Nginx上都有）这是双方通信的协议变量什么的，不用管。
            因此cd切换到自己的项目下 要拷贝uwsgi_params 之后ls
            创建一个文件名，必须要以mysite_nigix.conf结尾。之后把如下copy进来 --这是官网提供的

            # mysite_nginx.conf

            # the upstream component nginx needs to connect to
            upstream django {
                # server unix:///path/to/your/mysite/mysite.sock; # for a file socket
                server 127.0.0.1:8001; # for a web port socket (we'll use this first)这是所有过来的请求转发到8001，
                上述socket端口，uwsgi.ini配置文件下的socket端口
            }

            # configuration of the server
            server {
                # the port your site will be served on  表示用户访问的是8000端口
                listen      8000;
                # the domain name it will serve for  待论
                server_name .example.com; # substitute your machine's IP address or FQDN
                charset     utf-8;

                # max upload size  用户请求的数据最大是75M，不用动
                client_max_body_size 75M;   # adjust to taste

                # Django media
                location /media  { #为了Django上传文件用的，但其实一般有static即可
                    alias /path/to/your/mysite/media;  # your Django project's media files - amend as required
                }

                location /static { #alias指的是别名，这个是Nginx要去拿你的静态文件的路径
                    alias /path/to/your/mysite/static; # your Django project's static files - amend as required
                    如    /home/igarashi/igarashisite/statics
                }

                # Finally, send all non-media requests to the Django server.  把非静态文件的请求发给Django server
                location / {
                    uwsgi_pass  django;
                    include     /path/to/your/mysite/uwsgi_params; # the uwsgi_params file you installed
                }
            }

            之后这个文件是要放在nginx下才能生效，也就是/etc/nginx下的sites-enabled/下，里面有default（共存的）可以利用快捷方式
            sudo ln -s mysite_nginx.conf /etc/nginx/sites-enabled       #这条命令即建立软连接

            配置完成后需要重启 /etc/init.d/nginx restart  重启之后访问8000端口。若报错，此时显示日志
            tail -f /var/log/nginx/access.log & error.log（有两个日志）
            为什么报错呢？因为nginx要把请求转到uWSGI上，可是还没启动

        注意：在生产上Django下的setting.py 下的DEBUG = True要改为Flase。绝对不能让别人看到报错的大黄页（里面提示哪一行出错）
              多app的页面可能出现某页面下的static静态文件找不到，解决办法就是把所有的静态文件拷贝到nginx的static的目录中。
              不用自己找每一个目录下app的静态文件，Django自带命令 打开python3 manage.py 显示了collectstatic命令
              运行后，让你是否拷贝到xx之下，yes后报错，表示没有设置STATIC_ROOT,即没有指定把静态文件copy到哪一个目录下。
              STATIC_ROOT="all_static_files" #若写statics则和STATIC_URL同，此时报错，禁止把目录冲掉。
              之后它是在默认的BASE_DIR下拷贝建立all_static_files文件。之后配置到nginx的static下重启nginx即可。

    总结：
        1.生成项目的uwsgi.ini文件
        2.copy nginx 下的uwsgi_params文件到你的Django项目目录，不用更改内容
        3.生成nginx的配置文件，xx_nginx.conf 软连接到nginx下的sites-enabled中
            sudo ln -s ~/path/to/your/mysite/mysite_nginx.conf /etc/nginx/sites-enabled/
        4.STATIC_ROOT = os.path.join(BASE_DIR, "all_static/") 配置要拷贝的setting.py
        5.python manage.py collectstatics 把所有app 的静态文件copy 到统一的目录，使nginx可以访问
        6.重启nginx，启动uWSGI  $：uwsgi xx_uwsgi.ini
