---
title: Zookeeper
order: 1

group:
  title: 集群ZK
  order: 11
---

# Zookeeper 集群搭建以及 python 操作 zk

##一、Zookeeper 原理简介
ZooKeeper 是一个开放源码的分布式应用程序协调服务，它包含一个简单的原语集，分布式应用程序可以基于它实现同步服务，配置维护和命名服务等。

###1.Zookeeper 设计目的：
【最终一致性】：client 不论连接到那个 Server，展示给它的都是同一个视图。

【可靠性】：如果消息 m 被到一台服务器接收，那么消息 m 将被所有服务器接收。

【实时性】：Zookeeper 保证客户端将在一个时间间隔范围内获得服务器的更新信息，或者服务器失效的信息。
但由于网络延时等原因，Zookeeper 不能保证两个客户端能同时得到刚更新的数据，如果需要最新数据，应该在读数据之前调用 sync()接口。

【等待无关（wait-free）】：慢的或者失效的 client 不得干预快速的 client 的请求，使得每个 client 都能有效的等待。

【原子性】：更新只能成功或者失败，没有中间状态。

【顺序性】：包括全局有序和偏序两种：全局有序是指如果在一台服务器上消息 a 在消息 b 前发布，则在所有 Server 上消息 a 都将在消息 b 前被发布；
偏序是指如果一个消息 b 在消息 a 后被同一个发送者发布，a 必将排在 b 前面。

###2.Zookeeper 工作原理

#### 在 zookeeper 的集群中，各个节点共有下面 3 种角色和 4 种状态：

角色：

- leader：
- follower
- observer

状态：

- leading：当前 Server 即为选举出来的 leader。
- following：leader 已经选举出来，当前 Server 与之同步。
- observing：observer 的行为在大多数情况下与 follower 完全一致，但是他们不参加选举和投票，而仅仅接受(observing)选举和投票的结果。
- looking：当前 Server 不知道 leader 是谁，正在搜寻。

#### Zab 协议：

Zookeeper 的核心是原子广播，这个机制保证了各个 Server 之间的同步。实现这个机制的协议叫做 Zab 协议（ZooKeeper Atomic Broadcast protocol）。

Zab 协议有两种模式：

- 恢复模式（Recovery 选主）：当服务启动或者在领导者崩溃后，Zab 就进入了恢复模式，当领导者被选举出来，且大多数 Server 完成了和 leader 的
  状态同步以后，恢复模式就结束了。

- 广播模式（Broadcast 同步）：状态同步保证了 leader 和 Server 具有相同的系统状态。

#### zxid：

为了保证事务的顺序一致性，zookeeper 采用了递增的事务 id 号（zxid）来标识事务。所有的提议（proposal）都在被提出的时候加上了 zxid。

实现中 zxid 是一个 64 位的数字，它高 32 位是 epoch 用来标识 leader 关系是否改变，每次一个 leader 被选出来，它都会有一个新的 epoch，标识当前属于那个 leader 的统治时期。低 32 位用于递增计数。

###3.Zookeeper 集群节点

- Zookeeper 节点部署越多，服务的可靠性越高，建议部署奇数个节点，因为 zookeeper 集群是以宕机个数过半才会让整个集群宕机的。
- 需要给每个 zookeeper 1G 左右的内存，如果可能的话，最好有独立的磁盘，因为独立磁盘可以确保 zookeeper 是高性能的。
- 如果你的集群负载很重，不要把 zookeeper 和 RegionServer 运行在同一台机器上面，就像 DataNodes 和 TaskTrackers 一样。

#### 实验环境：

通常可以在一台服务器上面，开 3 个 docker 容器。然后使用网桥连接 3 个 docker 容器。这样，就可以模拟 3 台服务器了！

#### 创建网桥

【网桥好处】:

- 隔离性和互操作性： 连到同一自定义的 bridge 的各个容器默认相互之间曝露所有端口，并且不对外部曝露

- 自动提供容器之间的 DNS 解析服务： 连到同一自定义的 bridge 的各个容器不用做特殊 DNS 配置，可直接通过 hostname 访问

- 运行中容器联网配置： 可对运行中的容器配置自定义或取消配置自定义 bridge

- bridge 之间相互独立： 用户可创建 N 多个 bridge，且连接于不同的 bridge 之上的容器相互独立

创建自定义 bridge，名字叫 br1：

    docker network create --driver=bridge --subnet=172.168.0.0/16 br1

    语法解释：
    --driver=bridge 表示使用桥接模式

    --subnet 表示网络地址

为容器配置静态 IP，可以使用以下命令

    docker run -it --network my-net --ip 172.18.0.250 imageID bash

###4.Zookeeper 核心要点

- Zookeeper 节点必须是奇数

- 【修改 zoo.cfg】
  末尾增加 3 行参数。表示有 3 个 zk 节点！

      server.X=A:B:C
      server.X=A:B:C
      server.X=A:B:C

      X-代表服务器编号

      A-代表ip

      B和C-代表端口，这个端口用来系统之间通信

- 创建 ServerID 标识

        除了修改zoo.cfg配置文件外,zookeeper集群模式下还要配置一个myid文件,这个文件需要放在dataDir目录下。
        这个文件里面有一个数据就是A的值（该A就是zoo.cfg文件中server.A=B:C:D中的A）,在zoo.cfg文件中配置的dataDir路径中创建myid文件

##二、使用 python 操作 zookeeper

###1.kazoo 介绍
zookeeper 的开发接口以前主要以 java 和 c 为主，随着 python 项目越来越多的使用 zookeeper 作为分布式集群实现，python 的 zookeeper 接口也出现
了很多，现在主流的纯 python 的 zookeeper 接口是 kazoo。因此如何使用 kazoo 开发基于 python 的分布式程序是必须掌握的。

#### 安装 kazoo

    pip3 install kazoo
