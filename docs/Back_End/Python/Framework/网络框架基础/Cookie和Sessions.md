---
title: Cookie和Sessions
order: 2
---

初识 Cookie：
当你在访问网站时需要登录，只需要一次登录即可跳转不同页面，这需要通过 Cookie 才行。
但是用户在不同的电脑登录，需要重复输入登录信息，因此推理出 Cookie 是在用户的浏览器上，硬盘的某个位置。

    为什么需要http不像tcp那样，是无状态的，发了回之后就断开了，

Cookie: 1.保存在用户浏览器端的一些键值对 2.可以主动清除 3.也可以被"伪造"（即攻击者携带） 4.跨网站、跨域之间不是共享的（它是根据一个域名一个包放进去的，如果跨域之间能共享 Cookie 就完了） 5.浏览器设置不接受 Cookie（禁用后则永远无法进行登录）
6.Cookie 是放到响应头 or 请求头中的，响应头（包含 cookie）+响应内容到浏览器，打开响应头找到 cookie（请求头同理）

禁止浏览器设置 Cookie：
投票利用 Cookie 设置次数不可取，若把网站的 Cookie 禁止则可以无限刷票。
当禁止浏览器 Cookie 后访问时出现 CSRF 这是由于没有接收到模板{% csrf_token %}。因为 csrf 也会写在 Cookie 中，带着 Cookie 去。代码中利用
@csrf_exempt #csrf 防御可去除。

做登录时遇到的 BUG：
我真特么的是个傻逼，设计原因，我利用<a class="btn btn_login" onclick="login()"  >登录</a>来做登录，没有用表单进行提交。而是用 jQuery 进行
获取要提交的数据在利用$.post()进行提交，而在提交过程中，我在 a 标签的后面居然还写了一个 href="{% url "BILogin" %}"，真是傻逼。
最后回调判断利用了 window.location.href="/app01/index";这种方式在前端进行了页面跳转，我感觉开发中以后绝对不是这样实现的，学后改进。

1、获取 Cookie：
request.COOKIES['key']
request.get_signed_cookie(key, default=RAISE_ERROR, salt='', max_age=None)
参数：
default: 默认值
salt: 加密盐
max_age: 后台控制过期时间

2、服务端设置 Cookie：
rep = HttpResponse(...) 或 rep ＝ render(request, ...)

    rep.set_cookie(key,value,...)
    rep.set_signed_cookie(key,value,salt='加密盐',...)
        参数：
            key,              键
            value='',         值
            max_age=None,     超时时间
            expires=None,     超时时间(IE requires expires, so set it if hasn't been already.)IE里面搞的和max_age相同
                              设置这个字段则是用datatime.datetime.utcnow() + datatime.timedelta(seconds=5)注意时区
            path='/',         Cookie生效的路径，/ 表示根路径(全局生效，即所有url都生效)，特殊的：根路径的cookie可以被任何url的页面访问
                              /xx路径/则表示只有指定的xx路径才生效
            domain=None,      Cookie生效的域名（这里默认是对应的二级域名，跟ip没有任何关系，多个域名是可以指向一个ip的。cookie只是改域名绑定的！）
            secure=False,     https传输（基于安全的，有的请求是需要证书的，若用https访问需设置为true）
            httponly=False    只能http协议传输，无法被JavaScript获取document.cookie来进行修改，但是它没法防止全部覆盖。
                              例如以前连接别人wifi支付通过document.cookie即可获取账户密码。说是做安全用的其实比不加这个能够稍微安全一些而已
                              （不是绝对安全，底层抓包可以获取到也可以被覆盖）要想真正安全还是需要https证书级别的安全对数据加密才行。

    return rep

    domain和path一个是设置前面的域名www.igarashi.com另一个是设置/app01/login的，之后即可给对应详细页面设定cookie。domain若没有设置则默认为
    当前页面。若要给www.igarashi.com和orm.igarashi.com等多个页面进行cookie设置则可以设置为domain="igarashi.com"，此时都可以进行获取cookie。

3.客户端浏览器设置 cookie
由于 cookie 保存在客户端的电脑上，所以，JavaScript 和 jquery 也可以操作 cookie。(这里是利用 jquery.cookie.js 插件)
<script src='/static/js/jquery.cookie.js'></script>
$.cookie("list_pager_num", 30,{ path: '/' }); 参数与上大同小异
expires 参数略有不同，支持两种时间和 datatime 对象
d = new Date() d.setDate(d.getDate + 1)

4.Cookie 应用：
为啥有要有 Cookie：
以前没有 cookie 时登录，若直接在内存中设置一个 flag 让其正确输入时变为 true，此时只要有一个用户登录成功即改为 True，后续用户无需登录
这样就乱了套了。还有就是每个人登录的要看每个人的信息，若用 url 改则直接在 url 拼接?u=fuuka 即可访问，此时不就又崩了，没有登录则看到后台管理
除非把用户名和密码都带上，此时可以下一个页面再到数据库进行一次认证，但这么做太垃圾了。因此要借助 cookie 做用户认证。

    登录认证：（用cookie可以是可以但要付出代价）
        普通Cookie：
            -敏感信息（直接看到）不适合放在Cookie里面，敏感信息放在数据库，每次用户访问频繁操作数据库。
        签名Cookie：
            -利用set/get_signed_cookie加密（可能解密），这样比之前好一点，但能破解就没什么卵用
                此时多了个参数salt=。。获取时加密盐要相同

            加密：参考set_signed_cookie里面的.sign()前的value，能够自定义替换，而unsign找回
                Django里面用的时间TimestampSinger（value的类型）加密，tornado里面用的hash1加密

            自定义加密（签名）：
                可以自己建立一个加密类继承TimestampSinger，实现sign和unsign方法

        ====================》因此，Cookie做认证：将不敏感的信息放在cookie中（如用户名）之后频繁操作数据库，做到数据不外露==============
        注：这种方式说到底虽然保证信息不外露，但是数据库的压力增加，因此这种验证方式还是不太好。因此用另一种认证方式

初识 Session： 1.本质上来说 cookie 和 session 没有关系，但 session 和 cookie 却有关系。 2.若说 cookie 是放在客户端浏览器上的键值对，那么 session 则是放在服务器端上的但 session 要依赖于 cookie 来实现。 3.给服务器端发消息，服务器端生成一个随机字符串，然后把随机字符串写的客户端浏览器的 cookie。 4.同时在它的服务器端搞一个字典，把随机字符串当做 key，后面当做 value。每一个用户生成一个键值对。 5.以后用户便拿到服务器端 session 给的随机字符串（key）到服务器端进行验证（通过 key 获取 value）

    注：若公司不允许用session时，只能用cookie做认证。 flask等等小框架都没有session，此时要自己创建session。

Session：
session 是服务器端的一个键值对
session 的内部机制依赖于 cookie

    样式：
        session={
            随机字符串1：{                #每一个随机字符串对应一个用户
                'is_login':True,         #对应的可以是cookie传来的各种信息，内部维护的就是一个大的字典
                'username':"igarashi",
                'id':
                ....
            }
        }
    上文初识提到的过程Django用一句requset.session['username']=user完成/['is_login']=True
    而登录认证是则利用if requset.session['is_login']:
    这一句其实做了N多操作，它获取当前用户的随机字符串，根据随机字符串获取对应信息

Django 之 Session：
Django 中默认支持 Session，其内部提供了 5 种类型的 Session 供开发者使用： 1.数据库（默认） 2.缓存 3.文件 4.缓存+数据库 5.加密 cookie

1、数据库 Session：（默认保存在数据库中）
Django 默认支持 Session，并且默认是将 Session 数据存储在数据库中，即：django_session 表中。

    a. 配置 settings.py
        SESSION_ENGINE = 'django.contrib.sessions.backends.db'   # 引擎（默认）

        SESSION_COOKIE_NAME ＝ "sessionid"                       # Session的cookie保存在浏览器上时的key，即：sessionid＝随机字符串（默认）
        SESSION_COOKIE_PATH ＝ "/"                               # Session的cookie保存的路径（默认）
        SESSION_COOKIE_DOMAIN = None                             # Session的cookie保存的域名（默认）
        SESSION_COOKIE_SECURE = False                            # 是否Https传输cookie（默认）
        SESSION_COOKIE_HTTPONLY = True                           # 是否Session的cookie只支持http传输（默认）
        SESSION_COOKIE_AGE = 1209600                             # Session的cookie失效日期（2周）（默认）(这里是默认的失效时间)
        SESSION_EXPIRE_AT_BROWSER_CLOSE = False                  # 是否关闭浏览器使得Session过期（默认）
        SESSION_SAVE_EVERY_REQUEST = False                       # 是否每次请求都保存Session，默认修改之后才保存（默认）
        #当设置为True时只要进行请求则不失效，配合set_expiry(10)效果更好

    b. 使用
        def index(request):
            # 获取、设置、删除Session中数据
            request.session['k1']                #获取不到则报错
            request.session.get('k1',None)       #获取不到为None
            request.session['k1'] = 123
            request.session.setdefault('k1',123) # 存在则不设置
            del request.session['k1']            # 删除信息中的某一条

            request.session.clear()  == request.session.delete(request.session.session_key)  #都是把所有信息删除clear简单，用于注销

            # 所有 键、值、键值对
            request.session.keys()
            request.session.values()
            request.session.items()
            request.session.iterkeys()
            request.session.itervalues()
            request.session.iteritems()


            # 用户session的随机字符串
            request.session.session_key

            # 将所有Session失效日期小于当前日期的数据删除（防止脏数据的产生）
            request.session.clear_expired()

            # 检查 用户session的随机字符串 在数据库中是否(request.session已包含判断)
            request.session.exists("session_key")

            # 删除当前用户的所有Session数据
            request.session.delete("session_key")

            request.session.set_expiry(value)  #如60*60
                * 如果value是个整数，session会在些秒数后失效。
                * 如果value是个datatime或timedelta，session就会在这个时间后失效。
                * 如果value是0,用户关闭浏览器session就会失效。
                * 如果value是None,session会依赖全局session失效策略。

2、缓存 Session：
a. 配置 settings.py

        SESSION_ENGINE = 'django.contrib.sessions.backends.cache'  # 引擎（若要放到缓存中只需要改这么一个配置即可）
        SESSION_CACHE_ALIAS = 'default'                            # 使用的缓存别名（默认内存缓存，也可以是memcache），此处别名依赖缓存的设置

    通用配置，上面的是引擎配置
        SESSION_COOKIE_NAME ＝ "sessionid"                        # Session的cookie保存在浏览器上时的key，即：sessionid＝随机字符串
        SESSION_COOKIE_PATH ＝ "/"                                # Session的cookie保存的路径
        SESSION_COOKIE_DOMAIN = None                              # Session的cookie保存的域名
        SESSION_COOKIE_SECURE = False                             # 是否Https传输cookie
        SESSION_COOKIE_HTTPONLY = True                            # 是否Session的cookie只支持http传输
        SESSION_COOKIE_AGE = 1209600                              # Session的cookie失效日期（2周）(这里是默认的失效时间)
        SESSION_EXPIRE_AT_BROWSER_CLOSE = False                   # 是否关闭浏览器使得Session过期
        SESSION_SAVE_EVERY_REQUEST = False                        # 是否每次请求都保存Session，默认修改之后才保存

    b. 使用
        同上

3、文件 Session：
a. 配置 settings.py

        SESSION_ENGINE = 'django.contrib.sessions.backends.file'    # 引擎
        SESSION_FILE_PATH = None                                    # 缓存文件路径，如果为None，则使用tempfile模块获取一个临时地址
        tempfile.gettempdir()                                       # 如：/var/folders/d3/j9tj0gz93dg06bmwxmhh6_xm0000gn/T


        SESSION_COOKIE_NAME ＝ "sessionid"                          # Session的cookie保存在浏览器上时的key，即：sessionid＝随机字符串
        SESSION_COOKIE_PATH ＝ "/"                                  # Session的cookie保存的路径
        SESSION_COOKIE_DOMAIN = None                                # Session的cookie保存的域名
        SESSION_COOKIE_SECURE = False                               # 是否Https传输cookie
        SESSION_COOKIE_HTTPONLY = True                              # 是否Session的cookie只支持http传输
        SESSION_COOKIE_AGE = 1209600                                # Session的cookie失效日期（2周）
        SESSION_EXPIRE_AT_BROWSER_CLOSE = False                     # 是否关闭浏览器使得Session过期
        SESSION_SAVE_EVERY_REQUEST = False                          # 是否每次请求都保存Session，默认修改之后才保存

    b. 使用
        同上

4、缓存+数据库 Session：
数据库用于做持久化，缓存用于提高效率

    a. 配置 settings.py
        SESSION_ENGINE = 'django.contrib.sessions.backends.cached_db'        # 引擎

    b. 使用
        同上

5、加密 cookie Session：
a. 配置 settings.py
SESSION_ENGINE = 'django.contrib.sessions.backends.signed_cookies' # 引擎

    b. 使用
        同上

扩展：Session 用户验证：(利用装饰器)即登录验证可以写在装饰器中，另见下章 dispatch
def login(func):
def wrap(request, *args, \*\*kwargs): # 如果未登陆，跳转到指定页面
if request.path == '/test/':
return redirect('http://www.baidu.com')
return func(request, *args, \*\*kwargs)
return wrap
