---
title: Docker操作及常用命令
order: 2
---

# Docker 操作及常用命令

## 1 Docker 基操

### 1.1 核心要素

`Docker`如下三核心：

- **镜像**（Images）：打包了业务代码、运行环境的包，是静态文件，不对外直接提供服务
- **容器**（Containers）：镜像运行时，对外提供服务
- **仓库**（Registry）：存放镜像的地方，容器和仓库不会直接交互，都是以镜像为载体
  - 公有仓库：Docker Hub、阿里、网易... 一般存放以下几类镜像
    - 操作系统基础镜像：CentOS、Ubuntu、suse、alpine
    - 中间件：Nginx、Redis、MySQL
    - 语言编译环境：python、go、rust
    - 业务镜像：breath-for-code
  - 私有仓库： 企业内部搭建
    - Docker Registry：官方提供仓库存储
    - Harbor：上述封装，WebUI、权限、操作审计等功能（常用）

<img src="./img/核心要素.png">

> **Docker** 执行流程：
>
> **docker pull：** `client` 通过 `grpc` 和 `DOCKER_HOST` 通信，`daemon` 进程去`images` 中查看目标镜像，若没有则去远程仓库 `registry` 下载到本地 `images` 中
>
> **docker run：** 镜像是静态的，需要容器来运行，因此 `daemon` 会启动一个容器服务运行镜像来对外提供服务
>
> **docker build：** 通过 `build` 执行 [DockerFile]() 来自定义的打包自己的镜像

### 1.2 基本流程

1. 查看镜像列表：

   ```shell
   docker images || docker image ls
   ```

2. 远程仓库获取镜像：

   ```shell
   # 从远程仓库拉取 镜像名称：tag标签
   docker pull nginx:alpine

   #说明：
   docker pull ubuntu
   # 等同于
   docker pull docker.io/library/ubuntu:lastest
   ```

3. 通过镜像来启动容器：

   ```shell
   docker run --name z-nginx-alpine -d nginx:alpine
   ```

4. 进入容器并查看进程：

   ```shell
   # 进入容器内部，分配一个tty终端
   docker exec -ti z-nginx-alpine /bin/shell	# or shell or bash
   ps aux

   # 退出
   exit
   ```

5. 本地构建镜像

   - 创建 DockerFile

     `centos-nfs：`

     ```shell
     # 定义docker使用那个基础系统镜像作为模板，后续命令都已这个基础镜像为准,等同于 pull 操作
     FROM centos:7.6.1810

     # RUN命令会在模板镜像中执行
     RUN yum -y install nfs-utils

     # 启动容器后执行如下命令（这就是docker容器启动后执行命令的原因）
     CMD ["systemctl", "restart", "nfs"]
     ```

     `ubuntu-nginx：`

     ```shell
     FROM ubuntu

     RUN apt-get update && apt i -y nginx

     CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
     ```

   - 构建本地镜像:

     ```shell
     docker build . -t z-nginx:ubuntu -f DockerFile
     ```

   - 使用新镜像启动

     ```shell
     docker run --name z-nginx-ubuntu -d z-nginx:ubuntu
     ```

   - 容器端口转发

     ```shell
     # 查看 nginx 页面
     docker exec -ti z-nginx-alpine bash
     curl localhost

     # 移除容器 并 重启设置端口转发再启动
     docker rm -f z-nginx-alpine
     docker run --name z-nginx-alpine -d -p 8080:80 nginx:alpine

     # 查看是否转发（获取到nginx首页）
     curl localhost:8080
     ```

6. 删除容器服务

   ```shell
   docker rm -f z-nginx-ubuntu
   ```

### 1.3 部署镜像仓库

> docker 实际复杂流程如下图：

<img src="./img/基本流程.png">

1. 导入镜像到文件中

   ```shell
   docker save -o zz-nginx-alpine.tar nginx:alpine
   ```

2. 从文件中加载镜像

   ```shell
   docker load -i zz-nginx-alpine.tar
   ```

3. 部署镜像仓库

   https://docs.docker.com/registry/

   ```shell
   # 使用docker镜像启动仓库服务
   docker run -d -p 5000:5000 registry registry:2
   ```

   > 默认仓库不带认证，若需要认证，请参考：[restricting-access](https://docs.docker.com/registry/deploying/#restricting-access)

## 2 Docker 常用命令

可以在官网找到 [所有命令](https://docs.docker.com/reference/)

> 可以使用 <kbd>Ctrl</kbd> + <kbd>F</kbd> 在页面中快速搜索

### `docker version`

查看 Docker 版本

::: details 示例

```shell
Client: Docker Engine - Community
 Cloud integration: 1.0.7
 Version:           20.10.2
 API version:       1.41
 Go version:        go1.13.15
 Git commit:        2291f61
 Built:             Mon Dec 28 16:14:16 2020
 OS/Arch:           windows/amd64
 Context:           default
 Experimental:      true

Server: Docker Engine - Community
 Engine:
  Version:          20.10.2
  API version:      1.41 (minimum version 1.12)
  Go version:       go1.13.15
  Git commit:       8891c58
  Built:            Mon Dec 28 16:15:28 2020
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.4.3
  GitCommit:        269548fa27e0089a8b8278fc4fc781d7f65a939b
 runc:
  Version:          1.0.0-rc92
  GitCommit:        ff819c7e9184c13b7c2607fe6c30ae19403a7aff
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
```

:::

### `docker info`

查看 Docker 的系统信息

::: details 示例

```shell
Client:
 Context:    default
 Debug Mode: false
 Plugins:
  app: Docker App (Docker Inc., v0.9.1-beta3)
  buildx: Build with BuildKit (Docker Inc., v0.5.1-docker)
  scan: Docker Scan (Docker Inc., v0.5.0)

Server:
 Containers: 1
  Running: 1
  Paused: 0
  Stopped: 0
 Images: 1
 Server Version: 20.10.2
 Storage Driver: overlay2
  Backing Filesystem: extfs
  Supports d_type: true
  Native Overlay Diff: true
 Logging Driver: json-file
 Cgroup Driver: cgroupfs
 Cgroup Version: 1
 Plugins:
  Volume: local
  Network: bridge host ipvlan macvlan null overlay
  Log: awslogs fluentd gcplogs gelf journald json-file local logentries splunk syslog
 Swarm: inactive
 Runtimes: runc io.containerd.runc.v2 io.containerd.runtime.v1.linux
 Default Runtime: runc
 Init Binary: docker-init
 containerd version: 269548fa27e0089a8b8278fc4fc781d7f65a939b
 runc version: ff819c7e9184c13b7c2607fe6c30ae19403a7aff
 init version: de40ad0
 Security Options:
  seccomp
   Profile: default
 Kernel Version: 5.4.72-microsoft-standard-WSL2
 Operating System: Docker Desktop
 OSType: linux
 Architecture: x86_64
 CPUs: 8
 Total Memory: 6.126GiB
 Name: docker-desktop
 ID: GEVB:2QBS:GAWG:ZFNQ:7ITG:VHFB:MP2G:CKI4:7RTO:2E2M:H6SH:KQKO
 Docker Root Dir: /var/lib/docker
 Debug Mode: false
 Registry: https://index.docker.io/v1/
 Labels:
 Experimental: false
 Insecure Registries:
  127.0.0.0/8
 Live Restore Enabled: false

WARNING: No blkio weight support
WARNING: No blkio weight_device support
WARNING: No blkio throttle.read_bps_device support
WARNING: No blkio throttle.write_bps_device support
WARNING: No blkio throttle.read_iops_device support
WARNING: No blkio throttle.write_iops_device support
```

:::

### `docker <命令> --help`

查看 Docker 命令帮助

::: details 示例

```shell
docker --help
```

```text
Usage:  docker [OPTIONS] COMMAND

A self-sufficient runtime for containers

Options:
      --config string      Location of client config files (default
                           "C:\\Users\\Yue_plus\\.docker")
  -c, --context string     Name of the context to use to connect to the
                           daemon (overrides DOCKER_HOST env var and
                           default context set with "docker context use")
  -D, --debug              Enable debug mode
  -H, --host list          Daemon socket(s) to connect to
  -l, --log-level string   Set the logging level
                           ("debug"|"info"|"warn"|"error"|"fatal")
                           (default "info")
      --tls                Use TLS; implied by --tlsverify
      --tlscacert string   Trust certs signed only by this CA (default
                           "C:\\Users\\Yue_plus\\.docker\\ca.pem")
      --tlscert string     Path to TLS certificate file (default
                           "C:\\Users\\Yue_plus\\.docker\\cert.pem")
      --tlskey string      Path to TLS key file (default
                           "C:\\Users\\Yue_plus\\.docker\\key.pem")
      --tlsverify          Use TLS and verify the remote
  -v, --version            Print version information and quit

Management Commands:
  app*        Docker App (Docker Inc., v0.9.1-beta3)
  builder     Manage builds
  buildx*     Build with BuildKit (Docker Inc., v0.5.1-docker)
  config      Manage Docker configs
  container   Manage containers
  context     Manage contexts
  image       Manage images
  manifest    Manage Docker image manifests and manifest lists
  network     Manage networks
  node        Manage Swarm nodes
  plugin      Manage plugins
  scan*       Docker Scan (Docker Inc., v0.5.0)
  secret      Manage Docker secrets
  service     Manage services
  stack       Manage Docker stacks
  swarm       Manage Swarm
  system      Manage Docker
  trust       Manage trust on Docker images
  volume      Manage volumes

Commands:
  attach      Attach local standard input, output, and error streams to a running container
  build       Build an image from a Dockerfile
  commit      Create a new image from a container's changes
  cp          Copy files/folders between a container and the local filesystem
  create      Create a new container
  diff        Inspect changes to files or directories on a container's filesystem
  events      Get real time events from the server
  exec        Run a command in a running container
  export      Export a container's filesystem as a tar archive
  history     Show the history of an image
  images      List images
  import      Import the contents from a tarball to create a filesystem image
  info        Display system-wide information
  inspect     Return low-level information on Docker objects
  kill        Kill one or more running containers
  load        Load an image from a tar archive or STDIN
  login       Log in to a Docker registry
  logout      Log out from a Docker registry
  logs        Fetch the logs of a container
  pause       Pause all processes within one or more containers
  port        List port mappings or a specific mapping for the container
  ps          List containers
  pull        Pull an image or a repository from a registry
  push        Push an image or a repository to a registry
  rename      Rename a container
  restart     Restart one or more containers
  rm          Remove one or more containers
  rmi         Remove one or more images
  run         Run a command in a new container
  save        Save one or more images to a tar archive (streamed to STDOUT by default)
  search      Search the Docker Hub for images
  start       Start one or more stopped containers
  stats       Display a live stream of container(s) resource usage statistics
  stop        Stop one or more running containers
  tag         Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE
  top         Display the running processes of a container
  unpause     Unpause all processes within one or more containers
  update      Update configuration of one or more containers
  version     Show the Docker version information
  wait        Block until one or more containers stop, then print their exit codes

Run 'docker COMMAND --help' for more information on a command.

To get more help with docker, check out our guides at https://docs.docker.com/go/guides/
```

:::

### `docker search`

在 [Docker Hub](https://hub.docker.com/) 上搜索镜像。

语法：`docker search [OPTIONS] TERM`

选项：

- `--filter , -f`
  - 根据提供的条件过滤输出
- `--format`
  - 使用 Go 模板进行漂亮的打印搜索
- `--limit`
  - 默认为 `25`
  - 最多搜索结果数
- `--no-trunc`
  - 不截断输出

### `docker pull`

从仓库拉取镜像。

语法：`docker pull [OPTIONS] NAME[:TAG|@DIGEST]`

> [参考官网手册](https://docs.docker.com/engine/reference/commandline/pull/)

选项：

- `--all-tags , -a`
  - 下载仓库中所有标记的镜像
- `--disable-content-trust`
  - 默认为：`true`
  - 跳过镜像验证
- `--platform`
  - `1.32+` 可用
  - 如果服务器支持多平台，则设置平台
- `--quiet , -q`
  - 禁止详细输出

### `docker run`

在新容器中运行命令。

语法：`docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`

> [参考官方手册](https://docs.docker.com/engine/reference/commandline/run/)

选项：

- `--add-host`
  - 添加自定义主机到 IP 映射（主机：ip）
- `--attach , -a`
  - 连接到 STDIN、STDOUT 或 STDERR
- `--blkio-weight`
  - 块 IO（相对权重），介于 10 和 1000 之间，或 0 禁用（默认 0）
- `--blkio-weight-device`
  - 块 IO 权重（相对设备重量）
- `--cap-add`
  - 添加 Linux 功能
- `--cap-drop`
  - 放弃 Linux 功能
- `--cgroup-parent`
  - 容器的可选父 cgroup
- `--cgroupns
  - `1.41+` 可用
  - 要使用的 C 组命名空间（主机|私有）"主机"：
    在 Docker 主机的 cgroup 命名空间"私有"中运行容器：
    在其自己的专用 cgroup 命名空间中运行容器'：
    使用由守护程序上的默认 cgroupns 模式选项配置的 cgroup 命名空间（默认）
- `--cidfile`
  - 将容器 ID 写入文件
- `--cpu-count`
  - CPU 计数（仅窗口）
- `--cpu-percent`
  - CPU 百分比（仅窗口）
- `--cpu-period`
  - 限制 CPU CFS（完全公平的调度程序）周期
- `--cpu-quota`
  - 限制 CPU CFS（完全公平的调度程序）配额
- `--cpu-rt-period`
  - `1.25+` 可用
  - 以微秒为单位限制 CPU 实时周期
- `--cpu-rt-runtime`
  - `1.25+` 可用
  - 以微秒为单位限制 CPU 实时运行时间
- `--cpu-shares , -c`
  - CPU 共享（相对权重）
- `--cpus`
  - `1.25+` 可用
  - CPU 数量
- `--cpuset-cpus`
  - 允许执行的 CPU （0-3， 0，1）
- `--cpuset-mems`
  - 允许执行的 MEM （0-3， 0，1）
- `--detach , -d`
  - 在后台运行容器并打印容器 ID
- `--detach-keys`
  - 覆盖分离容器的键序列
- `--device`
  - 将主机设备添加到容器
- `--device-cgroup-rule`
  - 将规则添加到 cGroup 允许的设备列表
- `--device-read-bps`
  - 限制设备读取速率（字节/秒）
- `--device-read-iops`
  - 限制设备读取速率（IO/秒）
- `--device-write-bps`
  - 将写入速率（字节/秒）限制为设备
- `--device-write-iops`
  - 将写入速率（IO/秒）限制为设备
- `--disable-content-trust`
  - 默认为：`true`
  - 跳过镜像验证
- `--dns`
  - 设置自定义 DNS 服务器
- `--dns-opt`
  - 设置 DNS 选项
- `--dns-option`
  - 设置 DNS 选项
- `--dns-search`
  - 设置自定义 DNS 搜索域
- `--domainname`
  - 容器 NIS 域名
- `--entrypoint`
  - 覆盖图像的默认入口点
- `--env , -e`
  - 设置环境变量
- `--env-file`
  - 在环境变量文件中读取
- `--expose`
  - 暴露端口或一系列端口
- `--gpus`
  - `1.40+` 可用
  - 要添加到容器的 GPU 设备（"全部"通过所有 GPU）
- `--group-add`
  - 添加要加入的其他组
- `--health-cmd`
  - 命令运行以检查运行状况
- `--health-interval`
  - 运行检查之间的时间（ms | s | h）（默认 0s）
- `--health-retries`
  - 报告不正常行为所需的连续故障
- `--health-start-period`
  - `1.29+` 可用
  - 容器的开始周期在开始运行状况重倒数之前初始化（ms | s | h）（默认 0s）
- `--health-timeout`
  - 允许运行一次检查的最大时间（ms | s | h）（默认 0s）
- `--help`
  - 输出帮助
- `--hostname , -h`
  - 容器主机名
- `--init`
  - `1.25+` 可用
  - 在容器内运行一个 init，该容器转发信号并收获进程
- `--interactive , -i`
  - 即使未连接，也保持 STDIN 打开
- `--io-maxbandwidth`
  - 系统驱动器的最大 IO 带宽限制（仅窗口）
- `--io-maxiops`
  - 系统驱动器的最大 IOps 限制（仅 Windows）
- `--ip`
  - IPv4 地址（例如：`172.30.100.104`）
- `--ip6`
  - IPv6 地址（例如：`2001:db8::33`）
- `--ipc`
  - 要使用的 IPC 模式
- `--isolation`
  - 容器隔离技术
- `--kernel-memory`
  - 内核内存限制
- `--label , -l`
  - 在容器上设置元数据
- `--label-file`
  - 在标签的行分隔文件中读取
- `--link`
  - 将链接添加到另一个容器
- `--link-local-ip`
  - 容器 IPv4/IPv6 链路本地地址
- `--log-driver`
  - 容器的日志记录驱动程序
- `--log-opt`
  - 日志驱动程序选项
- `--mac-address`
  - 容器 MAC 地址（例如：`92:d0:c6:0a:29:33`）
- `--memory , -m`
  - 内存限制
- `--memory-reservation`
  - 内存软限制
- `--memory-swap`
  - 交换限制等于内存加交换：'-1'，支持无限制交换
- `--memory-swappiness`
  - 默认为：`-1`
  - 调整容器内存交换（0 到 100）
- `--mount`
  - 将文件系统装载附加到容器
- `--name`
  - 为容器分配名称
- `--net`
  - 将容器连接到网络
- `--net-alias`
  - 为容器添加网络范围别名
- `--network`
  - 将容器连接到网络
- `--network-alias`
  - 为容器添加网络范围别名
- `--no-healthcheck`
  - 禁用任何容器指定的运行状况检查
- `--oom-kill-disable`
  - 禁用 OOM 杀手
- `--oom-score-adj`
  - 调整主机的 OOM 首选项 （-1000 到 1000）
- `--pid`
  - 要使用的 PID 命名空间
- `--pids-limit`
  - 调整容器皮斯限制（设置为 -1 无限制）
- `--platform`
  - `1.32+` 可用
  - 设置平台，如果服务器是多平台功能
- `--privileged`
  - 向此容器授予扩展权限
- `--publish , -p`
  - 将容器的端口发布到主机
- `--publish-all , -P`
  - 将所有公开端口发布到随机端口
- `--pull missing`
  - 运行前拉图像（"始终"|"缺少"|"从不"）
- `--read-only`
  - 将容器的根文件系统装载为只读
- `--restart no`
  - 重新启动策略，在容器退出时应用
- `--rm`
  - 容器退出时自动移除容器
- `--runtime`
  - 用于此容器的运行时
- `--security-opt`
  - 安全选项
- `--shm-size`
  - 大小 /开发/shm
- `--sig-proxy`
  - 默认为 `true`
  - 代理接收到进程的信号
- `--stop-signal`
  - SIGTERM 停止容器的信号
- `--stop-timeout`
  - `1.25+` 可用
  - 停止容器的超时（以秒为单位）
- `--storage-opt`
  - 容器的存储驱动程序选项
- `--sysctl`
  - Sysctl 选项
- `--tmpfs`
  - 装载 tmpfs 目录
- `--tty , -t`
  - 分配伪 TTY
- `--ulimit`
  - 极限选项
- `--user , -u`
  - 用户名或 UID（格式：`<name|uid>[:<group|gid>]`）
- `--userns`
  - 要使用的用户名空间
- `--uts`
  - 要使用的 UTS 命名空间
- `--volume , -v`
  - 绑定装载卷
- `--volume-driver`
  - 容器的可选卷驱动程序
- `--volumes-from`
  - 从指定的容器中装载卷
- `--workdir , -w`
  - 容器内的工作目录

### `docker exec`

在正在运行的容器中执行命令。

语法：`docker exec [OPTIONS] CONTAINER COMMAND [ARG...]`

> [参考官网手册](https://docs.docker.com/engine/reference/commandline/exec/)

选项：

- `--detach , -d`
  - 分离模式：在后台运行命令
- `--detach-keys`
  - 覆盖分离容器的键序列
- `--env , -e`
  - `1.25+` 以上可用
  - 设置环境变量
- `--env-file`
  - `1.25+` 以上可用
  - 在环境变量文件中读取
- `--interactive , -i`
  - 即使未连接，也保持 STDIN 打开
- `--privileged`
  - 向命令授予扩展权限
- `--tty , -t`
  - 分配伪 TTY
- `--user , -u`
  - 用户名或 UID（格式：`<name|uid>[:<group|gid>]`）
- `--workdir , -w`
  - `1.35+` 以上可用
  - 容器内的工作目录
