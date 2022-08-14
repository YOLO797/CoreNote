---
title: aioetcd3
order: 4
---

# aioetcd3

<Alert type="warning">异步 etcd 库使用了 V3 的 API，该库引用了 [aiogrpc](https://github.com/hubo1016/aiogrpc) 这个第三方老库，来实现异步的**grpc**，因此存在些许局限，需魔改</Alert>

- [github|aioetcd3](https://github.com/gaopeiliang/aioetcd3)
- 引用库 [aiogrpc](https://github.com/hubo1016/aiogrpc) 使用 `__anext__`、`loop.call_soon_threadsafe` 、`run_in_executor` 等实现
- 新版本官方已推出 [grpc.aio](/back_end/python/生态/rpc/grpc)

### 安装

```bash
$ pip install aioetcd3
```

### 1. 使用参考

##### 缺陷:

当多个 `endpoints` 时，如下：

```json
{
  "etcd_endpoints": "ipv4:///172.16.120.141:22379,172.16.120.142:22379,172.16.120.143:22379"
}
```

若 `172.16.120.141` 离线，该库依然有概率生成 `141` 这个错误的连接，导致不可用。需手动 捕获异常且 `update_server_list` 容错，因此异常难用

#### 1.1 开源参考

[server](https://github.com/matrixji/eha/blob/master/eha/agent/server.py)

#### 1.2 简单封装

```python
from pathlib import Path

from aioetcd3.client import Client

from dashboard import settings
from rook.parser import json_config

__all__ = (
    "EtcdProxy",
    "get_db"
)


def load_endpoints(): # 通过读json文件获取endpoints
    endpoints = None
    if Path(settings.ETCD_CONFIG).exists():
        conf = json_config.JsonConfig(settings.ETCD_CONFIG)
        endpoints = conf.get_key("etcd_endpoints")
    return endpoints


DEFAULT_ETCD_ENDPOINTS = load_endpoints()
DEFAULT_ETCD_TIMEOUT = 5


class EtcdProxy(Client):
    def __init__(self, endpoints: str = None, timeout=DEFAULT_ETCD_TIMEOUT, *args, **kwargs):
        if endpoints:
            self.endpoints = endpoints
        else:
            self.endpoints = DEFAULT_ETCD_ENDPOINTS
        super().__init__(self.endpoints, timeout=timeout, *args, **kwargs)

    def __new__(cls, *args, **kwargs):
        if not hasattr(cls, '_instance'):
            cls._instance = super().__new__(cls)
        return cls._instance

    def reset_endpoints(self, endpoints: str = None):
        """动态设置etcd地址  endpoints: "ipv4://host:port
        """
        global DEFAULT_ETCD_ENDPOINTS
        if endpoints:
            DEFAULT_ETCD_ENDPOINTS = endpoints
        else:
            DEFAULT_ETCD_ENDPOINTS = load_endpoints()
        self.close()


def get_db():
    return EtcdProxy()
```

启动时读`json`文件的`endpoints`地址到内存。单例，未开连接池，过于简陋的封装

### 2. 分布式锁

```python

```
