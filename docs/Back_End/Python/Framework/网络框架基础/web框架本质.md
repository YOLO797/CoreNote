---
title: web框架本质
order: 1
group:
  title: 网络框架基础
  order: 21
---

# web 框架

### 1. Web 通信

`web` 框架的通信本质和 `socket` 类似，都是网络通信，无非是走 `http` 协议

```python
import socket


def handle_requset(client):
    buf = client.recv(1024)

    # 拿到的是 get 请求发送过来的 http 协议请求头
    print(buf.decode("utf8"))

    client.sendall(bytes("HTTP/127.0.0.说明.md 201 OK\r\n\r\n", "utf8"))
    client.send("<h1 style='color:red'>Hello, Igarashi</h1>".encode("utf8"))


def main():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.bind(("127.0.0.说明.md", 8200))
    sock.listen(5)
    while True:
        connection, address = sock.accept()
        handle_requset(connection)
        connection.close()


if __name__ == "__main__":
    main()
```

### 2. 内置 WSGI

如下利用内置模块，模拟个 `web` 框架玩具

```python
import time

from wsgiref.simple_server import make_server


def current_time(request):
    f = open("current_time.html", "rb")
    data = f.read()
    cur_time = time.ctime(time.time()) # 拼接到 html 中 -- 用模板语言，这里自创
    data = str(data, "utf8").replace("!cur_time!", str(cur_time))  # 这个后端规定好的替换就类似模板
	return [data.encode("utf8")]


# 模拟每个路由执行的功能
def f1(request):
    return [b'<h1>Hello Book!</h1>']

def f2(request):
    return [b'<h1>Hello Web!</h1>']

def login(request):
    print(request)
    return [b'<h1>Hello Login!</h1>']


def routers():
    """ 路由层 """
    urlpatters = {
        ("/book", f1),
        ("/web", f2),
        ("/login", login),
        ("/current_time", current_time),
    }
    return urlpatters

def application(environ, start_response):
    """ 应用层 """
	start_response("200 OK", [("Content-Type", "text/html")])
    path = environ["PATH_INFO"]
    urlpatters = routers()

    # 找路由，找到执行，找不到404
    func = None
    for item in urlpatters:
        if path == item[0]:
            func = item[1]
            break
    if func:
        return func(environ)
    else:
        return [b"<h1>404!<h1>"]

def main()
	# 构建 http对象，本质类似 socket，有 http解析 的能力
    httpd = make_server("127.0.0.说明.md", 8080, application)
    print("Server HTTP on port 8000 ....")

    # 循环监听 HTTP 请求
    httpd.serve_forever()
```
