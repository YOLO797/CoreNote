---
title: Screen
order: 1

group:
  title: 超好用的运维提速小工具
  order: 30
---

# Screen

<Alert type="info">简单云服务器部署工具，用于远程 `ssh` 断掉的请求，也能一直运行，不会被意外原因而杀掉</Alert>

**安装 screen 工具**

- Ubuntu:

  ```bash
  sudo apt-get install screen
  ```

- CentOS:

  ```bash
  yum install screen
  ```

**使用简介**

- 创建 screen 窗口：

  ```bash
  screen -S  name	# 这里name 是自己起得名字，方便管理
  ```

- 退出：

  ```bash
  Ctrl a + d
  ```

- 恢复：

  ```bash
  screen -r
  ```

- 查看 `screen` 进程：

  ```bash
  screen -ls
  ```

- 进入进程：

  - 单个 `screen` 进程：

    ```bash
    screen -r -d
    ```

  - 多个 `screen` 进程：(通过它的 **PID** 进入)

    ```bash
    screen -ls	# 查看进程id号
    screen -r -d 1805	# 进入id为 1805 的 screen 进程
    ```
