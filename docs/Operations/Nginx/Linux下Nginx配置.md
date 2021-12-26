---
title: Nginx（Linux）
order: 1

group:
  title: Nginx服务
  order: 2
---

# Nginx

###简介
nginx 是一个 web 服务。用来放置 web 服务的，号称能支持百万并发。C 语言写的，http://nginx.org/ ，对 windows 的支持比较差

web 服务：

- Apache：过去市面上基本都是这个，目前占有率下降，多为银行证券，为了追求稳定性使用。
- iis：windows 下是最著名的 web 服务器
- Tengine：淘宝在 nginx 的基础上进行了二次封装，开源的，针对大访问量网站的需求 http://tengine.taobao.org/ （访问级别不大 无区别）
- F5：硬件负载，收购了 nginx
- A10：对应 F5 的，也是硬件负载。
- LVS：linux 下著名做负载均衡的软件。告诉用户在多台服务器的情况下，应该访问那一台机器。（中国人写的 章文嵩博士 ali-> 滴滴）
- VUE：前端 Js 框架 （尤雨溪）唯二两个出名的国人开发

# 1.安装

### Linux 下

    cd /opt
    wget http://nginx.org/download/nginx-1.17.9.tar.gz

    解压： tar xf nginx-1.17.9.tar.gz

    cd nginx-1.17.9/

    编译：（之前先 cat README）
        ./configure --help
            - 找到安装路径指令： --prefix=PATH
            - 找到支持https协议指令： --with-http_ssl_module
            - 找到查看nginx状态的指令：--with-http_stub_status_module

        ./configure --prefix=PATH --with-http_ssl_module --with-http_stub_status_module

    make & make install

# 2.目录结构

**conf**：配置文件

**html**：存放静态文件 index.html 是默认的欢迎页面

**logs**：日志目录

**sbin**：二进制文件

    nginx启动之后会生成一个主进程，会跟进配置文件里的选项，worker_processes : 1
    这个选项来生成子进程（工作进程），主进程不负责处理用户的请求，只用来转发给子进程。真正负责处理用户请求的是子进程。

# 3.命令

    -?,-h         : this help
    -v            : show version and exit                                               显示版本号
    -V            : show version and configure options then exit
    -t            : test configuration and exit                                         测试配置文件
    -T            : test configuration, dump it and exit
    -q            : suppress non-error messages during configuration testing
    -s signal     : send signal to a master process: stop, quit, reopen, reload         停止退出，重启等
    -p prefix     : set prefix path (default: /usr/share/nginx/)
    -c filename   : set configuration file (default: /etc/nginx/nginx.conf)
    -g directives : set global directives out of configuration file

    ps -ef |grep nginx      查看nginx是否启动了，启动的进程
    ss -tnlp | grep nginx   查看nginx的端口，通常是80，即http端口，22是ssh端口，443是https端口，3306是mysql端口
    iptables -F             关闭防火墙 （注：危险操作，清除防火墙规则，但只要没有save还行）
    setenforce 0

# 4.配置文件

    #user  nobody;              # 使用哪个用户来启动子进程
        worker_processes  1;        # 工作进程的个数，配置cpu的核心数-1或-2，cpu的亲缘性绑定，让nginx的子进程工作再哪个核心上

        #error_log  logs/error.log;              # 错误日志的存放位置
        #error_log  logs/error.log  notice;
        #error_log  logs/error.log  info;

        #pid        logs/nginx.pid;              # 启动之后会生成一个pid文件（socket文件）


        events {
            worker_connections  1024;           # 每一个子进程工作可以处理的最大连接数，默认1024
                                                # 还可以设置 use [epoll|select|poll] 默认则是自己选择
        }


        http {
            include       mime.types;                   # 导入
            default_type  application/octet-stream;     # 默认的请求方式

            #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
            #                  '$status $body_bytes_sent "$http_referer" '
            #                  '"$http_user_agent" "$http_x_forwarded_for"';

                                                        # log_format main 可以定义日志格式

            #access_log  logs/access.log  main;         # 日志用什么格式输出

            sendfile        on;
            #tcp_nopush     on;

            #keepalive_timeout  0;
            keepalive_timeout  65;                      # 保持长连接的超时时间 65秒

            #gzip  on;

            server {
                listen       80;                        # 监听端口
                server_name  localhost;                 # 设置域名 此处为域名，直接写是肯定不会有个，除非本地HOSTS设置对应的

                #charset koi8-r;

                #access_log  logs/host.access.log  main;

                location / {
                    root   html;                        # 指定静态文件地址
                    index  index.html index.htm;        # 指定默认的index页面
                }

                #error_page  404              /404.html;    # 错误页面 找不到页面

                # redirect server error pages to the static page /50x.html
                #
                error_page   500 502 503 504  /50x.html;    # 错误页面 服务端错误（后端代码逻辑性错误等）
                location = /50x.html {
                    root   html;
                }

                location /img {
                    root /data/img;         # 若为root，那么表示/data/img 这个地址为根，还要有个/img目录才行
                    alias /data/img;        # 若为alias， 那么表示/data/img 这个地址就是/img的所在目录
                }

                # proxy the PHP scripts to Apache listening on 127.0.0.1:80
                #
                #location ~ \.php$ {
                #    proxy_pass   http://127.0.0.1;
                #}

                # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
                #
                #location ~ \.php$ {
                #    root           html;
                #    fastcgi_pass   127.0.0.1:9000;
                #    fastcgi_index  index.php;
                #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
                #    include        fastcgi_params;
                #}

                # deny access to .htaccess files, if Apache's document root
                # concurs with nginx's one
                #
                #location ~ /\.ht {
                #    deny  all;
                #}
            }


            # another virtual host using mix of IP-, name-, and port-based configuration
            #
            #server {
            #    listen       8000;
            #    listen       somename:8080;
            #    server_name  somename  alias  another.alias;

            #    location / {
            #        root   html;
            #        index  index.html index.htm;
            #    }
            #}


            # HTTPS server
            #
            #server {
            #    listen       443 ssl;
            #    server_name  localhost;

            #    ssl_certificate      cert.pem;
            #    ssl_certificate_key  cert.key;

            #    ssl_session_cache    shared:SSL:1m;
            #    ssl_session_timeout  5m;

            #    ssl_ciphers  HIGH:!aNULL:!MD5;
            #    ssl_prefer_server_ciphers  on;

            #    location / {
            #        root   html;
            #        index  index.html index.htm;
            #    }
            #}

        }

# 5.域名设置

**server_name**: server 下的 server_name 进行设置，由于没有备案需要更改本地 HOSTS 才能成功解析。

    server_name www.yukiball.com www.mmmmohime.com mmmmohime.com;

**多域名访问（虚拟主机）**： 在 Nginx 的设置里面设置多个 server

- 基于 ip 地址的
- 基于端口的
- 基于域名的：最简单的方式

  server {
  listen 80 default_server; # 设置 default 当使用 ip 地址访问，默认进入 server 设置的页面
  server_name www.taobao.dom taobao.com;

        location / {
            root /data/taobao;
            index index.html;
        }


  }

# 6.Nginx 日志

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
            #                  '$status $body_bytes_sent "$http_referer" '
            #                  '"$http_user_agent" "$http_x_forwarded_for"';

                                                        # log_format main 可以定义日志格式
            #access_log  logs/access.log  main;         # 日志用什么格式输出

    把注释去掉即可打开日志

**查看日志**

    tail -f logs/access.log
    remote_addr: 访问ip地址
    remote_user: 访问的用户
    [$time_local]: 访问的本地时间
    request: 包括请求方式、请求地址、请求协议版本
    status： 状态码
    body_bytes_sent 发送的大小
    http_user_agent 用户请求的浏览器
    http_x_forwarded_for

**设置网段禁止访问**

    deny 192.168.21.0/255.255.255.0;    设置这个网段都不能访问，不加子网掩码可以单独设置ip
    deny 192.168.21.0/24;  同上

**设置白名单**

    allow 192.168.21.131;
    以上均可写在server或location里面

# 7.反向代理

- **作用**：起到保护网站安全的作用，用户访问的永远是这台反向代理的 nginx 机器，因此只用维护 nginx 这台机器的安全防护即可。
- **动静分离**：动态网站和静态网站分离，nginx 可以直接请求静态文件，而避免请求 Django 和后端交互。直接缓存静态文件即可。
- **负载均衡**：F5、V10、LVS、haproxy（支持 4 层还支持 7 层）nginx 最早出来之前只支持 7 层，新版支持 4 层还支持 UDP 的负载均衡。缓解一台服务器压力，可以承受更多请求。

  假设目前在 ip 为 192.168.21.131 的一台主机下 配置文件中添加
  upstream django {
  server 192.168.21.128:81;
  server 192.168.21.131L81; # 若此时再加上一个 131 的 81 端口，当访问 131 的 81 端口，会发现在 128 和 131 之前轮询
  }

  server{
  listen 81;
  location / {
  root /data/html;
  index index.html;
  }
  }

### 权重

    upstream django {
        server 192.168.21.128:81 weight=3; # 表示权重访问3次128才访问一次131
        server 192.168.21.131L81;
    }

    server{
        listen 80 default_server;
        listem [::]:80 default_server;
        server_name _;

        location {
            proxy_pass http://django; #注意这里一定要加http:// + upstream别名
        }
    }

### ip_hash

每个请求做 hash 运算，这样每个固定的访客都会被负载到后端固定的机器

    upstream django {
        ip_hash;
        server 192.168.21.128:81;
        server 191.168.21.131:81;
    }

### backup

备份：

<!--</font >-->
