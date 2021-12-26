---
title: aio_etcd
order: 3
---

# 异步 etcd 库：

<Alert type="info">由于是 V2 的 API，比较局限，因此后续换用了 aioetcd3 的 V3 库</Alert>

## aio_etcd 使用 watch 做监控 遇到的坑：

首先目录是有层级关系的：/A/B/C B 死了，C 就没了，A 死了，B 就没了，下层受限于上层。因此对于监控来说，etcd 或 zk 这样的目录设计，其实挺
适合监控的（监控就是一个重要东西死了，一片就没了）

#### 写入客户端 set_client.py

    import aio_etcd as etcd

    class EtcdClient:

        def __init__(self):
            self.client = etcd.Client(host="127.0.0.1", port=2379)

        async def set(self, key, value, ttl=None):
            return await self.client.write(key, value, ttl=ttl)

        async def get(self, key):
            return await self.client.get(key)

        async def watch(self, key, callback, recursive=True):
            return await self.client.eternal_watch(key, callback, recursive=recursive)


    async def set_client():
        etcdctl = EtcdClient()
        c = 0
        for i in range(100):
            await etcdctl.set(f"/nodes/node{i}", i, ttl=10)
            c += 1
            print(c)


    if __name__ == '__main__':
        import asyncio

        loop = asyncio.get_event_loop()
        loop.run_until_complete(set_client())

#### 执行监控端 watch_client.py

    from watch import EtcdClient

    async def get_response(response):
        print(response.__dict__)
        return response


    async def watch_node():
        etcdctl = EtcdClient()
        c = 0
        while True:
            ret = await etcdctl.watch("/nodes", get_response)
            c += 1
            print(c, ret)


    if __name__ == '__main__':
        import asyncio

        loop = asyncio.get_event_loop()
        loop.run_until_complete(watch_node())

[问题]：正常来讲，set 执行 100 次，应该 watch 到 200 次，因为设置了 ttl，10s 之后还会继续监听到后面 100 次的结果。但实际上 watch 一共才执行了
90 多次，就他妈离谱。

原因就是用了 while 死循环， 收到节点反馈后再去注册监听（每次循环后再建立新的监听）此时理论上就存在了一小段建立监听的空闲时间。

这就导致了 会监听丢失多个 etcd 的反馈信息。

看到一老外在 stackoverflow.com 上说，他也是用 while，心里：妈的，艹 nm...

### 解决办法：

使用：

    async def eternal_watch(self, key, callback, index=None, recursive=None):

它构造了 await res 进行返回，而不是像 watch 那样直接返回（注：非异步 etcd 也有此函数，无回调，构造了生成器，利用协程 yield 进行返回）

【注意】：

- 另外 watch 函数其实就是 self.read(self,wait=True) 这就很垃圾

- eternal_watch 貌似会逃过外侧打印的执行，而是直接执行完 callback 即结束。
