---
title: NFS服务
order: 1
group:
  title: NFS
  order: 14
---

# NFS

### 1. 简介

### 2. 服务端

#### 2.1 软件配置

#### 2.2 共享配置

### 3. 客户端

#### 3.1 挂载命令

- 通过 `ip` 挂载

  ```sh
  # v3版本
  $ mount.nfs -vvv -o vers=3 172.16.120.141:/share/Users/zz /home/zz
  ```

- 通过 **域名** 挂载

  ```sh
  # v4版本
  $ mount.nfs -vvv  nas.local:/share/pql /home/pql
  ```

#### 3.2 获取挂载 `nfs` 客户端:

> 查询默认服务端口 `cat /etc/services| grep nfs`

- 命令快速查: （不太好用）

  ```sh
  ss | grep :nfs
  ```

- 使用 **python**:

  ```python
  import psutil

  [
      {
          "laddr": f"{net.laddr.ip}:{net.laddr.port}",
          "raddr": f"{net.raddr.ip}:{net.raddr.port}"}
      for net in psutil.net_connections()
      if net.laddr.port == 2049 and
      isinstance(net.laddr, psutil._common.addr) and
      isinstance(net.raddr, psutil._common.addr)
  ]
  ```
