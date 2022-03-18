---
title: ufs 快捷命令
order: 1

group:
  title: UDS管理平台
  order: 3
---

# UFS 快捷命令

### 1. 部署相关

#### 1.1 更新集群代码

- 免密认证

  ```sh
  $ ssh-keygen
  $ ssh-copy-id -i ~/.ssh/id_rsa.pub -p 22 root@172.16.120.142
  ```

- 远程拷贝

  ```shell
  $ scp -r agent conf dashboard monitor mounter rook static version.py ubind watchdog root@172.16.120.142:/opt/uxs
  ```

- 远程执行命令

  ```sh
  $ ssh 172.16.120.142 "systemctl restart uxs-agent"
  ```

- 重启服务

  ```sh
  systemctl restart uxs-dashboard
  systemctl restart uxs-agent
  systemctl restart uxs-monitor
  systemctl status uxs-dashboard
  systemctl status uxs-agent
  systemctl status uxs-monitor
  ```

- 手动启动服务

  ```sh
  $ python3 /opt/uxs/dashboard/uxsdashboard.py

  $ python3 /opt/uxs/agent/uxsagent.py

  $ python3 /opt/uxs/monitor/uxsmonitor.py
  ```

- 查看服务进程

  ```sh
  $ ps -ef |grep uxsdashboard

  $ ps -ef |grep uxsagent

  $ ps -ef |grep uxsmonitor
  ```

- 删除服务 PID 文件

  ```sh
  $ rm -rf /var/run/uxsagent.pid

  $ rm -rf /var/run/uxsmonitor.pid
  ```

- 查看各个服务日志

  ```sh
  $ tailf /var/log/uxs/uxsdashboard.log

  $ tailf /var/log/uxs/uxsagent.log

  $ tailf /var/log/uxs/uxsmonitor.log
  ```

#### 1.2 ETCD 相关

- 重置 ETCD

  ```sh
  # 修改 new
  $ vim /etc/uxs/config.json

  # 重置endpoints
  $ vim /etc/uxs/etcd.json

  {
      "etcd_endpoints": "ipv4:///127.0.0.1:22379"
  }

  # 清空etcd
  systemctl stop uxsetcd
  rm -rf /var/lib/etcd/uxs_default.etcd
  ```

#### 1.3 生成许可

- 生成许可证

  ```sh
  $ ufs_make_license --serial_number 17A179CFF629D10322E69AF61A959E013DCE5075  --chunkservers=1000 --clients=10000 --expire_date=2099-01-01 --capcity=2PiB
  ```

#### 1.4 MSS 服务相关

-

#### 1.5 CSS 服务相关

-

#### 1.x 挂载相关

- 挂载子目录

  ```sh
  $ /usr/bin/ufsmount -o ufsioretries=3,ufstimeout=1,ufsdelayedinit,internal /export/nas/Users
  ```

- 挂载回收站目录

  ```sh
  $ /usr/bin/ufsmount -m /export/meta/
  ```

- 远程挂载

  ```sh
  $ ufsmount -H
  ```

---

### 2. 调度相关

#### 2.1 节点高可用

#### 2.2 NAS 服务高可用

- 监听 IP

  ```sh
  $ watch -n 1 "ip a"
  ```

- 添加网卡 IP

  ```sh
  $ ip addr add 172.16.120.171/24 broadcast 172.16.120.255 dev eth1
  ```

- 删除网卡 IP

  ```sh
  $ ip addr del 172.16.120.171/24 dev eth1
  ```

- 刷新网卡

  ```sh
  $ ip addr flush eth1
  ```

- 设置网卡状态

  ```sh
  $ ip link set eth1 down
  $ ip link set eth1 up
  ```
