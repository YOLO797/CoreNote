---
title: web框架本质
order: 1
group:
  title: 网络框架基础
  order: 21
---

# 搭建一个 web 框架

import socket

# def handle_requset(client):

# buf = client.recv(1024)

# print(buf.decode("utf8")) #拿到的是 get 请求发送过来的 http 协议请求头

#

# client.sendall(bytes("HTTP/说明.md.说明.md 201 OK\r\n\r\n", "utf8"))

# client.send("<h1 style='color:red'>Hello, Igarashi</h1>".encode("utf8"))

#

#

# def main():

# sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# sock.bind(("127.0.0.说明.md", 8200))

# sock.listen(5)

#

# while True:

# connection, address = sock.accept()

# handle_requset(connection)

# connection.close()

#

#

# if **name** == '**main**':

# main()

'''
接下来来了解一下 WSGI：
'''
from wsgiref.simple_server import make_server # 这里是依靠 web 服务器来实现简化并调用内部的 makeserver（类似当时的 socketserver，笔记 5.2）

# 这在最简单的基础上，完成功能的增强和简化过程（之前 socket 的方式仅能拿到 bytes 的头，若想解析十分繁琐）

# 解耦：

def f1(request): # 传 environ 是因为比如 form 表单 get、post 等等要处理各种信息，比如登录的逻辑...
return [b'<h1>Hello Book!</h1>']

def f2(request):
return [b'<h1>Hello Web!</h1>']

def login(request):
print(request)

    return [b'<h1>Hello Login!</h1>']

import time

def current_time(request): # 这里用后端来做
f = open("current_time.html", "rb")
data = f.read()
cur_time = time.ctime(time.time()) # 拼接到 html 中 -- 用模板语言，这里自创

    data = str(data, "utf8").replace("!cur_time!", str(cur_time))  # 这个后端规定好的替换就类似模板

    return [data.encode("utf8")]

# 每一个路径都要对应一个函数，去匹配路径，但 if el 很 low，因此用循环写一个 routers()

def routers(): # 就像路由表一样，因此以后在这里扩充即可.!!!Django 的话则是用反射 getattr(obj,"路径名找到方法名字符串（应该不是这样）"),详见反射 4.3
urlpatters = {
("/book", f1),
("/web", f2),
("/login", login),
("/current_time", current_time), # 这里元组要有逗号
}
return urlpatters # 返回这一个的元组，方便后面循环遍历判断

def application(environ, start_response): # 函数名自己定义，请求内容都在 environ 中，start_response 则是设定响应头
start_response("200 OK", [("Content-Type", "text/html")]) # 按 html 解析，后面还有 json...

    # 自己设定响应头非常麻烦,这里第一个参数作为状态码，第二个参数是一个列表，
    # 里面是元组(多个)，每个元组是键值对，而这个键值对就是每个响应头，如果想给响应头设置信息仅仅设置元组即可

    path = environ["PATH_INFO"]  # 封装成字典类型 PATH_INFO指路径（客户端要访问的路径）

    urlpatters = routers()

    func = None
    for item in urlpatters:
        if path == item[0]:
            func = item[1]
            break
    if func:
        return func(environ)
    else:
        return [b"<h1>404!<h1>"]

    # if path == "/book":解耦取代
    #     return f1(environ)
    # elif path == "/web":
    #     return f2(environ)
    # else:
    #     return [b"<h1>404!<h1>"]

httpd = make_server("127.0.0.说明.md", 8080, application) # 上面的函数作为一个参数传过去，构建出一个 http 对象

# 虽然这个模块之前没有接触过，但和 socket 实现效果看似相同，能完成整个 http 解析还省事不少

print("Server HTTP on port 8000 ....")

# 开始监听 HTTP 请求

httpd.serve_forever() # 此时在内部才会调用 application
