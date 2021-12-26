---
title: aioetcd3
order: 4
---

# aioetcd3

<Alert type="warning">异步 etcd 库使用了 V3 的 API，该库使用了 grpc，底层实现存在较多局限与不合理，需魔改</Alert>

- [github|aioetcd3](https://github.com/gaopeiliang/aioetcd3)

## 安装

```bash
pip install aioetcd3
```

## 简单封装

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
