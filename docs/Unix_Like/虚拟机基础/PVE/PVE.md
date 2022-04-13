---
title: PVE虚拟机
order: 1
group:
  title: PVE
  order: 61
---

# Proxmox

[Proxmox](https://www.proxmox.com/en) 虚拟环境（简称**PVE**）是用于操作来宾操作系统的基于 **Debian Linux** 和 **KVM** 的虚拟化平台，免费提供，也可购买商业支持。

##### 优势

- 几乎可以在**所有 `x86` 硬件**上运行
- 每台主机**不到 5 分钟即可**完成安装
- 高可用
- **开源**

##### 缺陷

- 使用 [corosync](http://corosync.github.io/corosync/) 来管理集群。**最多可以管理或控制 32 个节点**。`Proxmox` 集群的虚拟化和存储主机的最大数量为**32 台物理服务器**。

### 1. 安装

[安装 wiki](https://pve.proxmox.com/wiki/Installation)

### 2.指南

[Proxmox VE Administration Guide](https://pve.proxmox.com/pve-docs/pve-admin-guide.html)
