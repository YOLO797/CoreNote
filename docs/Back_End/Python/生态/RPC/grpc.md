---
title: grpc
order: 4
group:
  title: RPC远程调用
  order: 34
---

# grpc

> 目前最为主流，基于 go 语言开发的 rpc，有 python`异步版` 可以和 `FastAPI` 相结合，异步，好用！

### 1. 部分文档

##### 1.1 论文

[graphics](https://github.com/grpc/proposal)

##### 1.2 服务配置

[Service Config in gRPC](https://github.com/grpc/grpc/blob/master/doc/service_config.md)
[arg_keys](https://grpc.github.io/grpc/core/group__grpc__arg__keys.html)

##### 1.3 重试策略

[what is xDS](https://github.com/grpc/grpc/blob/master/doc/grpc_xds_features.md)

##### 1.4 开源引用

[aioetcd3](/data-base/etcd/aioetcd3) 使用老版本的非 `aio` 异步，基于线程实现的库

##### 1.5 Python 文档

[gRPC Python’s documentation](https://grpc.github.io/grpc/python/index.html) 此 **API 是稳定** 的

[grpc (github.com)](https://github.com/grpc/grpc/tree/master/src/python/grpcio) 需要 `python >= 3.6`
