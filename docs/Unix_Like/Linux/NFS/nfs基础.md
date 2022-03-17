---
title: NFS服务
order: 1
group:
  title: NFS
  order: 14
---

# NFS Server

获取挂载 `nfs` 客户端:

> 查询默认服务端口 `cat /etc/services| grep nfs`

- 命令快速查:

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
