---
title: Postman
order: 2
---

Postman
Postman 是一款功能强大的网页调试与发送网页 HTTP 请求的 Chrome 插件。可以用于测试发送各种 Http 请求。

一、基本操作

    Authorization-授权
        身份认证，显示browser cookies，需要开启Interceptor。
        Basic Auth：填写用户名和密码，点击update request后，headers中自动添加Authorization。


    Headers-请求头
        通常是 json 的数据格式，不同格式根据不同类型切换比如excel就肯定是另一种格式
        key             value
        Content-Type    application/json



    Body-请求体
        form-data
            表单数据 key-value形式

        x-www-form-urlencoded
            选择x-www-form-urlencoded的参数方式后，postman自动的帮我们设置了Content-Type。窗体数据被编码为名称/值对

        raw
            通常选项，里面写入原生的josn数据（貌似键值对都是字符类型）配合最右边的JSON(application/json)可以进行验证是否参数正确

        binary
            二进制形式，文件流，字节流等

    CSRF验证：（貌似浏览器中的postman不需要）
        当向某一个地址POST一段JSON数据时通常会遇到403错误

        解决办法：chrome中（勾选Preserve log保护日志）用合法账户登录，找到登录url把其中的 Request Headers 的 Cookie
            及CSRF等内容添加到Postman的请求头中（即上文的Headers中）。
            在Postman中Authorization中选择合适的Auth type，输入对应的合法用户信息。重新发送请求即可。

二、测试部分

    Pre-request Script-


    Tests（部分）可以写脚本
        注：Django的HTTPResponse返回json时记得dumps

        判断返回的状态码：
            tests["Status code is 200"] = responseCode.code === 200;

        校验包含字符串：
            tests["Body matches string"] = responseBody.has("test","POST");

        解析JSON并检查：
            var jsonData = JSON.parse(responseBody);
            tests["request test"] = jsonData.test === "POST";

    Collection：
        可以把测试用例保存，Runner可以批量执行

在线可尝试商业版软件 Yapi https://yapi.ymfe.org/
