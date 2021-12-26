---
title: FastAPI踩坑集合
order: 4
---

# FastAPI 踩坑集合

## OpenApi 的坑：

FastAPI 默认通过 CDN 的 swagger js 文件来生成对应 openapi 文档，若文档出现无法使用，或变为 default 的点不开情况，多半是 FastAPI 的版本
升级了，更新了 swagger 相关 js 文件， 因此建议下载后本地静态加载 swagger 文件，或更新 FastAPI 版本

## 日志的坑：

## 文件下载遇见的坑

Fastapi 返回 FileResponse 时，在有请求头必须带 token 验证时，前端无法下载所遇见的坑

[注意]：ajax 这弔东西，获取到了下载的文件，会转成 json 字符串转存到前端内存中，就很 2

### 下载的方式

通常前端文件下载有以下几种方式：

#### 1.a 标签：（只能用 get 请求）

最常见不做赘述

#### form 表单：动态创建表单加到 fbody 中，最后删除表单（这种可以使用 post 来搞）

- 第一种:将传条件的以表单提交的方式进行(推荐这种)-----这种方式也可以用来页面跳转
        $("#表单id").attr("action", file_path);//改变表单的提交地址为下载的地址
        $("#表单id").submit();//提交表单
- 第二种:动态创建表单加到 fbody 中，最后删除表单(推荐这种,可以将组合条件的值也动态的加入表单中)：
        //动态创建表单加到fbody中，最后删除表单
        function download() {
        try {
            var queryForm = $("#表单id");
            var exportForm = $("<form action='file_path' method='post、get都行'></form>")
            exportForm.html(queryForm.html());
            $(document.body).append(exportForm);
            exportForm.submit();
        } catch (e) {
            console.log(e);
        } finally {
            exportForm.remove();
        }
  }

注意:动态 form 必须加到 DOM 树，否则会报异常:Form submission canceled because the form is not connected。而且提交完需要删除元素。

#### window:

以 window.location.href="xxx"的方式请求下载地址
这种方法需要自己手动的拼接地址传递参数。get 请求携带参数的方式: xxxx.html?username=xxx&password=xxxx

但是以上方法都是垃圾，带不了请求头，有博客说可以使用 jq 的 ajaxform，没弄过，懒得弄，感觉不靠谱，最靠谱的往往还是最原始的

### XMLHttpRequest 解决一切不可能

直接附上代码，附注释：

    function downloadFileObject(je) {
      var url = _redirct_url(je.url, je.method, get_context())

      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);   // 也可以使用POST方式，根据接口
      xhr.responseType = "blob";    // 返回类型blob，别问，问就是cv
      // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑

      xhr.setRequestHeader("x-token", $.cookie('x_token')); //添加头，恶心死我
      xhr.onload = function () {
        // 请求完成
        if (this.status === 200) {
          var blob = this.response;
          var disposition = this.getResponseHeader("content-disposition")
          var reader = new FileReader();
          reader.readAsDataURL(blob);  // 转换为base64，可以直接放入a表情href

          reader.onload = function (e) {
            // 转换完成，创建一个a标签用于下载
            var a = document.createElement('a');
            a.href = e.target.result;
            // attachment; filename*=utf-8''%E5%A4%87%E4%BB%BD1.tar.gz 以下是通过 content-disposition 来获取文件名
            var reg2 = new RegExp("%.*.tar.gz$")
            var filename = ""
            if (reg2.test(disposition)){
              filename= decodeURIComponent(reg2.exec(disposition)[0]);
            } else {
              var tempstr = disposition.split(" ")[1].replace('filename="', "")
              filename = decodeURIComponent(tempstr.substr(0, tempstr.length-1));
            }
            a.download = filename;
            $("body").append(a);    // 修复firefox中无法触发click
            a.click();
            $(a).remove();
          }
        }
      };
      // 发送ajax请求
      xhr.send()
    }

这就是 "ajax" （神他妈 ajax，虽然本质一样）异步下载文件的简单方法

### 另一种解决方法：

FASTAPI 的 FileResponse 都应该指定类型，而不是想当然的都指定为流然后扔给前端解析，类型指定可以参考 mimetypes

前端 Quasar 提供了解决导出文件的办法： http://www.quasarchs.com/quasar-utils/other-utils/

    import { exportFile } from 'quasar'

    // mimeType是可选的；
    // 默认的mimeType为“text/plain”
    (status) exportFile(fileName, rawData[, mimeType])

最简单的例子：

    import { exportFile } from 'quasar'

    const status = exportFile('important.txt', 'Some important content')

    if (status === true) {
      // 浏览器允许
    }
    else {
      // 浏览器拒绝
      console.log('Error: ' + status)
    }

这里可以：

    const res = await downloadVersion(version)  # 向FastAPI发送下载的get请求，FastAPI那边返回text/plain 的FileResponse

    let disposition: any = res.headers['content-disposition']
    let filename = ''
    let temp_str = disposition.split(' ')[1].replace('filename="', '')
    filename = decodeURIComponent(temp_str.substr(0, temp_str.length - 1))  # 上面到这步都是在获取文件名

    const status = exportFile(filename, res.data, 'text/plain') # 直接调用Quasar提供的接口

## Websocket uvicorn 环境 的坑

场景描述：前端通过 ws://x.x.x.x:xxxx/xxx 的 websocket 协议请求 FASTAPI 时，报 WARNING: Unsupported upgrade request. 的情况

原因：
这可能是当前的 fastapi 环境中并没有支持 websocket 的 upgrade 请求。
通过 pip install uvicorn 来安装的 uvicorn 0.12.2 版本并没有带有 websockets
客户端中的连接 ws 协议的 js 代码中也报错：handshake: Unexpected response code: 400。

解决方式：
要安装带有 websockets 功能的 uvicorn 需要使用 pip install uvicorn[standard]来安装

    pip3 uninstall uvicorn  # 先把之前安装的不支持websocket的版本给卸载掉

    pip3 install uvicorn[standard]  # 安装[standard]版本的包

使用 uvicorn[standard]时有明确的提示，我们同时安装了 websockets-8.1

[注意]: 除了安装 websockets 外，在 uvloop，http 协议方面也有变化，还会自动增加对 env 文件的支持， 除此之外，还会对--reloader 有影响，之前在
进行开发时使用 unicorn main:app 启动项目添加 --reloader 选项从而实现项目热更新，而更换成了 uvicorn[standard]之后，添加--reloader 选项
启动项目会遇到项目一直报警：WARNING WatchGodReload detected file change in \*.log 文件（可能是我的日志文件在本地开发时放在项目代码里，
把日志目录移到项目外估计就可以），从而导致项目一直循环重启。这是因为 uvicorn[standard]的热加载是依赖于 watchdog 模块, watchdog 是
github 上的一个开源项目，采用观察者模式用于监控一个文件目录下的文件和文件夹的变动，从而实现热加载，和默认的--reloader 机制不一样造成的。
