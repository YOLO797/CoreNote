---
title: etcd
order: 1
group:
  title: ETCD
  order: 1
---

# etcd

## 一、简介

etcd 是一个高可用的分布式键值(key-value)数据库。etcd 内部采用 raft 协议作为一致性算法，etcd 基于 Go 语言实现。

提供配置共享和服务发现的系统比较多，其中最为大家熟知的是[Zookeeper]（后文简称 ZK），而 ETCD 可以算得上是后起之秀了。
在项目实现，一致性协议易理解性，运维，安全等多个维度上，ETCD 相比 Zookeeper 都占据优势。

etcd 是一个服务发现系统，具备以下的特点：

- 简单：安装配置简单，而且提供了 HTTP API 进行交互，使用也很简单

- 安全：支持 SSL 证书验证

- 快速：根据官方提供的 benchmark 数据，单实例支持每秒 2k+读操作

- 可靠：采用 raft 算法，实现分布式系统数据的可用性和一致性

## 二、ETCD vs ZK

本文选取 ZK 作为典型代表与 ETCD 进行比较，而不考虑[Consul]项目作为比较对象，原因为 Consul 的可靠性和稳定性还需要时间来验证（
项目发起方自身服务并未使用 Consul, 自己都不用)。

- 一致性协议： ETCD 使用[Raft]协议， ZK 使用 ZAB（类 PAXOS 协议），前者容易理解，方便工程实现；

- 运维方面：ETCD 方便运维，ZK 难以运维；

- 项目活跃度：ETCD 社区与开发活跃，ZK 已经快死了；

- API：ETCD 提供 HTTP+JSON, gRPC 接口，跨平台跨语言，ZK 需要使用其客户端；

- 访问安全方面：ETCD 支持 HTTPS 访问，ZK 在这方面缺失；

据公开资料显示，至少有 CoreOS, Google Kubernetes, Cloud Foundry, 以及在 Github 上超过 500 个项目在使用 ETCD。

## 三、应用场景

和 ZK 类似，ETCD 有很多使用场景，包括：

- 1.配置管理

- 2.服务注册于发现

- 3.选主

- 4.应用调度

- 5.分布式队列

- 6.分布式锁

## 四、读写性能

按照官网给出的[Benchmark], 在 2CPU，1.8G 内存，SSD 磁盘这样的配置下，单节点的写性能可以达到 16K QPS, 而先写后读也能达到 12K QPS。
这个性能还是相当可观的。

## 五、工作原理

ETCD 使用 Raft 协议来维护集群内各个节点状态的一致性。

简单说，ETCD 集群是一个分布式系统，由多个节点相互通信构成整体对外服务，每个节点都存储了完整的数据，并且通过 Raft 协议保证每个节点维护的数据是一致的。

1.每个节点都会维护一个状态机。

2.任意时刻至多存在一个有效的主节点。

3.主节点处理所有来自客户端的写操作，并通过 Raft 协议保证写操作对状态机的改动会可靠的同步到其他节点。

**ETCD 工作原理核心部分在于 Raft 协议。主要分为三个部分：选主，日志复制，安全性。**

### 1.选主

- Raft 协议是用于维护一组服务节点数据一致性的协议。

- 这一组服务节点构成一个集群，并且有一个主节点来对外提供服务。

- 当集群初始化，或者主节点挂掉后，面临一个选主问题。集群中每个节点，任意时刻处于 Leader, Follower, Candidate 这三个角色之一。选举特点如下：
  - 当集群初始化时候，每个节点都是 Follower 角色；

  - 当 Follower 在一定时间内没有收到来自主节点的心跳，会将自己角色改变为 Candidate，并发起一次选主投票；当收到包括自己在内超过半
    数节点赞成后，选举成功；当收到票数不足半数选举失败，或者选举超时。若本轮未选出主节点，将进行下一轮选举
    （出现这种情况，是由于多个节点同时选举，所有节点均为获得过半选票）。

  - 若 Candidate 节点收到来自主节点的信息后，会立即终止选举过程，进入 Follower 角色。

  - 为了避免陷入选主失败循环，每个节点未收到心跳发起选举的时间是一定范围内的随机值，这样能够避免 2 个节点同时发起选主。

### 2.日志复制

所谓日志复制，是指**主节点**将每次操作形成日志条目，并**持久化**到本地磁盘，然后通过网络 IO 发送给其他节点。

其他节点根据日志的逻辑时钟(TERM)和日志编号(INDEX)来判断是否将该日志记录持久化到本地。当主节点收到包括自己在内**超过半数**节点成功返回，
那么认为该日志是可提交的(committed），并将日志输入到状态机，将结果返回给客户端。

注：每次选主都会形成一个唯一的 TERM 编号，相当于逻辑时钟。每一条日志都有全局唯一的编号。

主节点通过网络 IO 向其他节点追加日志。若某节点收到日志追加的消息，首先判断该日志的 TERM 是否过期，以及该日志条目的 INDEX 是否比当前以及
提交的日志的 INDEX 跟早。若已过期，或者比提交的日志更早，那么就拒绝追加，并返回该节点当前的已提交的日志的编号。否则，将日志追加，并返回成功。

当主节点收到其他节点关于日志追加的回复后，若发现有拒绝，则根据该节点返回的已提交日志编号，发生其编号下一条日志。

主节点像其他节点同步日志，还作了拥塞控制。具体地说，主节点发现日志复制的目标节点拒绝了某次日志追加消息，将进入日志探测阶段，一条一条
发送日志，直到目标节点接受日志，然后进入快速复制阶段，可进行批量日志追加。

按照日志复制的逻辑，我们可以看到，集群中慢节点不影响整个集群的性能。另外一个特点是，数据只从主节点复制到 Follower 节点，这样大大简化了逻辑流程。

### 3.安全性

####【引出问题】：
截止此刻，选主以及日志复制并不能保证节点间数据一致。

- 试想，当一个某个节点挂掉了，一段时间后再次重启，并当选为主节点。

- 而在其挂掉这段时间内，集群若有超过半数节点存活，集群会正常工作，那么会有日志提交。

- 这些提交的日志无法传递给挂掉的节点。当挂掉的节点再次当选主节点，它将缺失部分已提交的日志。

- 在这样场景下，按 Raft 协议，它将自己日志复制给其他节点，会将集群已经提交的日志给覆盖掉

这显然是不可接受的。

####【其他协议解决办法】：

- 新当选的主节点会询问其他节点，和自己数据对比，确定出集群已提交数据，然后将缺失的数据同步过来。

这个方案有明显缺陷，增加了集群恢复服务的时间（集群在选举阶段不可服务），并且增加了协议的复杂度。

####【Raft 解决的办法】

- 在选主逻辑中，对能够成为主的节点加以限制，确保选出的节点已定包含了集群已经提交的所有日志。

- 如果新选出的主节点已经包含了集群所有提交的日志，那就不需要从和其他节点比对数据了。

简化了流程，缩短了集群恢复服务的时间。

####【疑惑】
这里存在一个问题，加以这样限制之后，还能否选出主呢？

答案是：
只要仍然有超过半数节点存活，这样的主一定能够选出。

因为已经提交的日志必然被集群中超过半数节点持久化，显然前一个主节点提交的最后一条日志也被集群中大部分节点持久化。

当主节点挂掉后，集群中仍有大部分节点存活，那这存活的节点中一定存在一个节点包含了已经提交的日志了。

至此，关于 Raft 协议的简介就全部结束了。

## 六、接口

ETCD 提供 HTTP 协议，在最新版本中支持 Google gRPC 方式访问。具体支持接口情况如下：

- ETCD 是一个高可靠的 KV 存储系统，支持 PUT/GET/DELETE 接口；

- 为了支持服务注册与发现，支持 WATCH 接口（通过 http long poll 实现）；

- 支持 KEY 持有 TTL 属性；

- CAS（compare and swap)操作;

- 支持多 key 的事务操作；

- 支持目录操作

##七、正式安装(单节点)
etcd 在生产环境中一般推荐集群方式部署。在这里，主要讲讲单节点安装和基本使用。
因为 etcd 是 go 语言编写的，安装只需要下载对应的二进制文件，并放到合适的路径就行。

### 下载软件包

访问下载链接：

    https://github.com/etcd-io/etcd/releases

目前最新版本是 3.3.10，所以完整的下载链接如下：

    https://github.com/etcd-io/etcd/releases/download/v3.3.10/etcd-v3.3.10-linux-amd64.tar.gz

### 安装

    $ wget https://github.com/coreos/etcd/releases/download/v3.1.5/etcd-v3.1.5-linux-amd64.tar.gz
    $ tar xzvf etcd-v3.1.5-linux-amd64.tar.gz
    $ mv etcd-v3.1.5-linux-amd64 /opt/etcd

解压后是一些文档和两个二进制文件 etcd 和 etcdctl。etcd 是 server 端，etcdctl 是客户端。如下所示：

    $ ls
    Documentation  etcd  etcdctl  README-etcdctl.md  README.md  READMEv2-etcdctl.md

其中 etcd 是 server 端，etcdctl 是客户端，操作之后会生成一个 default.etcd，主要用来存储 etct 数据。
启动一个单节点的 etcd 服务，只需要运行 etcd 命令就行。不过有可能会出现以下问题：

    root@ubuntu:/opt/etcd-v3.3.10# ./etcd bash: ./etcd: 权限不够

这个时候需要提高文件的权限，采用如下方法：

    root@ubuntu:/opt/etcd-v3.3.10# chmod 755 etcd

再次启动 etcd:

    root@ubuntu:/opt/etcd-v3.3.10# ./etcd

成功后可以看见以下提示：

    2018-11-11 15:46:43.134431 I | etcdmain: etcd Version: 3.3.10
    2018-11-11 15:46:43.134941 I | etcdmain: Git SHA: 27fc7e2
    2018-11-11 15:46:43.135324 I | etcdmain: Go Version: go1.10.4
    2018-11-11 15:46:43.135572 I | etcdmain: Go OS/Arch: linux/amd64
    2018-11-11 15:46:43.135781 I | etcdmain: setting maximum number of CPUs to 1, total number of available CPUs is1
    2018-11-11 15:46:43.136055 W | etcdmain: no data-dir provided, using default data-dir ./default.etcd
    2018-11-11 15:46:43.136331 N | etcdmain: the server is already initialized as member before, starting as etcd member...
    2018-11-11 15:46:43.136847 I | embed: listening for peers on http://localhost:2380
    2018-11-11 15:46:43.137159 I | embed: listening for client requests on localhost:2379
    2018-11-11 15:46:43.138055 I | etcdserver: name = default
    2018-11-11 15:46:43.138328 I | etcdserver: data dir = default.etcd
    2018-11-11 15:46:43.138718 I | etcdserver: member dir = default.etcd/member
    2018-11-11 15:46:43.139011 I | etcdserver: heartbeat = 100ms
    2018-11-11 15:46:43.139280 I | etcdserver: election = 1000ms
    2018-11-11 15:46:43.139545 I | etcdserver: snapshot count = 100000
    2018-11-11 15:46:43.139839 I | etcdserver: advertise client URLs = http://localhost:2379
    2018-11-11 15:46:43.141035 I | etcdserver: restarting member 8e9e05c52164694d in cluster cdf818194e3a8c32 at commit index 46
    2018-11-11 15:46:43.141923 I | raft: 8e9e05c52164694d became follower at term 2
    2018-11-11 15:46:43.142228 I | raft: newRaft 8e9e05c52164694d [peers: [], term: 2, commit: 46, applied: 0, lastindex: 46, lastterm: 2]
    2018-11-11 15:46:43.143985 W | auth: simple token is not cryptographically signed
    2018-11-11 15:46:43.145713 I | etcdserver: starting server... [version: 3.3.10, cluster version: to_be_decided]
    2018-11-11 15:46:43.148015 I | etcdserver/membership: added member 8e9e05c52164694d [http://localhost:2380] to cluster cdf818194e3a8c32
    2018-11-11 15:46:43.149041 N | etcdserver/membership: set the initial cluster version to 3.3
    2018-11-11 15:46:43.149478 I | etcdserver/api: enabled capabilities for version 3.3
    2018-11-11 15:46:45.043137 I | raft: 8e9e05c52164694d is starting a new election at term 2
    2018-11-11 15:46:45.043461 I | raft: 8e9e05c52164694d became candidate at term 3
    2018-11-11 15:46:45.043495 I | raft: 8e9e05c52164694d received MsgVoteResp from 8e9e05c52164694d at term 3
    2018-11-11 15:46:45.043519 I | raft: 8e9e05c52164694d became leader at term 3
    2018-11-11 15:46:45.043535 I | raft: raft.node: 8e9e05c52164694d elected leader 8e9e05c52164694d at term 3
    2018-11-11 15:46:45.044348 I | etcdserver: published {Name:default ClientURLs:[http://localhost:2379]} to cluster cdf818194e3a8c32
    2018-11-11 15:46:45.044593 E | etcdmain: forgot to set Type=notify in systemd service file?
    2018-11-11 15:46:45.044737 I | embed: ready to serve client requests
    2018-11-11 15:46:45.045232 N | embed: serving insecure client requests on 127.0.0.1:2379, this is strongly discouraged!

以下是几个比较重要的信息：

    2018-11-11 15:46:43.138055 I | etcdserver: name = default
    name表示节点名称，默认为default。

    2018-11-11 15:46:43.138328 I | etcdserver: data dir = default.etcd
    data-dir 保存日志和快照的目录，默认为当前工作目录default.etcd/目录下。

    2018-11-11 15:46:43.148015 I | etcdserver/membership: added member 8e9e05c52164694d [http://localhost:2380] to cluster cdf818194e3a8c32
    在http://localhost:2380和集群中其他节点通信。

    2018-11-11 15:46:43.139839 I | etcdserver: advertise client URLs = http://localhost:2379
    在http://localhost:2379提供HTTP API服务，供客户端交互。

    2018-11-11 15:46:43.139011 I | etcdserver: heartbeat = 100ms
    heartbeat为100ms，该参数的作用是leader多久发送一次心跳到followers，默认值是100ms。

    2018-11-11 15:46:43.139280 I | etcdserver: election = 1000ms
    election为1000ms，该参数的作用是重新投票的超时时间，如果follow在该时间间隔没有收到心跳包，会触发重新投票，默认为1000ms。

    2018-11-11 15:46:43.139545 I | etcdserver: snapshot count = 100000
    snapshot count为10000，该参数的作用是指定有多少事务被提交时，触发截取快照保存到磁盘。
    集群和每个节点都会生成一个uuid。
    启动的时候会运行raft，选举出leader。

    采用这种方式启动的etcd只是一个程序，如果启动etcd的窗口被关闭的话则etcd便会被关闭
    ，所以如果要长期使用的话最好是为etcd开启一个服务，此处便不提供开启服务的方法，如果有需要可以自行百度。

#### 创建 systemd 服务

- 设定 etcd 配置文件
  建立相关目录
        $ mkdir -p /var/lib/etcd/
        $ mkdir -p /opt/etcd/config/

- 创建 etcd 配置文件
        $ cat <<EOF | sudo tee /opt/etcd/config/etcd.conf
        #节点名称
        ETCD_NAME=$(hostname -s)
        #数据存放位置
        ETCD_DATA_DIR=/var/lib/etcd
        EOF
- 创建 systemd 配置文件

        $ cat <<EOF | sudo tee /etc/systemd/system/etcd.service

        [Unit]
        Description=Etcd Server
        Documentation=https://github.com/coreos/etcd
        After=network.target

        [Service]
        User=root
        Type=notify
        EnvironmentFile=-/opt/etcd/config/etcd.conf
        ExecStart=/opt/etcd/etcd
        Restart=on-failure
        RestartSec=10s
        LimitNOFILE=40000

        [Install]
        WantedBy=multi-user.target
        EOF

- 启动 etcd

        $ systemctl daemon-reload && systemctl enable etcd && systemctl start etcd

##八、使用 etcd

### etcdctl 客户端

etcd 厂商为我们提供提供了一个命令行客户端—etcdctl，供用户直接跟 etcd 服务打交道，而无需基于 HTTP API 方式。可以方便我们在对服务进行测试或者手动修改数据库内容。

etcdctl 支持的命令大体上分为数据库操作和非数据库操作两类。

可以使用 ./etcdctl -h 查看 etcdctl 的用法：

    root@ubuntu:/opt/etcd-v3.3.10# ./etcdctl -h

### CURD 数据库操作

注意：

- etcd 的数据库操作围绕对键值和目录的 CRUD 完整生命周期的管理。

- etcd 在键的组织上采用了层次化的空间结构(类似于文件系统中目录的概念)，

- 用户指定的键可以为单独的名字，如:testkey，此时实际上放在根目录/下面

- 也可以为指定目录结构，如/cluster1/node2/testkey，则将创建相应的目录结构。

#### set

指定某个键的值

    etcdctl set /testdir/testkey "Hello world" --ttl '5'
    Hello world

    支持的选项包括：
    -ttl '0' 该键值的超时时间(单位为秒)，不配置(默认为0)则永不超时

    –swap-with-value value 若该键现在的值是value，则进行设置操作

    –swap-with-index '0' 若该键现在的索引值是指定索引，则进行设置操作

### get

获取指定键的值。

    etcdctl get /testdir/testkey
    Hello world

    # 等待5秒后，再执行
    etcdctl get /testdir/testkey
    keyError:  100: Key not found (/key) [8]
    第一个get是5秒内的操作，第二get是5秒后的操作，此刻key的值已经消失了。

    # 当键不存在时，则会报错
    etcdctl get /testdir/testkey2
    Error:  100: Key not found (/testdir/testkey2) [5]

    支持的选项为：
    --sort 对结果进行排序

    --consistent 将请求发给主节点，保证获取内容的一致性。

#### update：

当键存在时，更新值内容

    # 先设置一个5秒的值
    $ etcdctl set /testdir/testkey "Hello world" --ttl '5'

    # 再修改值
    $ etcdctl update /testdir/testkey "Hello"
    Hello

    # 等待10秒，再次执行
    $ etcdctl get /testdir/testkey
    Hello
    可以发现，即使10秒，也可以get到。说明ttl和value同时更新了！ （ttl不重新设置则更新为了0 永不超时）

    当键不存在时，则会报错。例如:
    $ etcdctl update /testdir/testkey2 "Hello"
    Error:  100: Key not found (/testdir/testkey2) [6]

#### rm

删除某个键值。如果给定的键不存在，则创建一个新的键值。

    # 删除
    $ etcdctl rm /testdir/testkey
    PrevNode.Value: Hello

    #当键不存在时，则会报错
    $ etcdctl rm /testdir/testkey
    Error:  100: Key not found (/testdir/testkey) [7]

    支持的选项:
    -dir 如果键是个空目录或者键值对则删除

    –recursive 删除目录和所有子键

    –with-value 检查现有的值是否匹配

    –with-index ‘0’检查现有的index是否匹配

#### mk

如果给定的键不存在，则创建一个新的键值。

    $ etcdctl mk /testdir/testkey "Hello world"
    Hello world

    # 当键存在的时候，执行该命令会报错
    $ etcdctl mk /testdir/testkey "Hello world"
    Error:  105: Key already exists (/testdir/testkey) [8]

#### mkdir

如果给定的键目录不存在，则创建一个新的键目录。

    $ etcdctl mkdir testdir2

    # 当键目录存在的时候，执行该命令会报错
    $ etcdctl mkdir testdir2
    Error:  105: Key already exists (/testdir2) [9]

#### setdir

创建一个键目录。如果目录不存在就创建，如果目录存在更新目录 TTL。

    $ etcdctl setdir testdir3

#### updatedir

更新一个已经存在的目录。

    $ etcdctl updatedir testdir2

#### rmdir

删除一个空目录，或者键值对。

    $ etcdctl setdir dir1
    $ etcdctl rmdir dir1

    # 若目录不空，会报错
    $ etcdctl set /dir/testkey hi
    hi
    $ etcdctl rmdir /dir
    Error:  108: Directory not empty (/dir) [17]

#### ls

列出目录(默认为根目录)下的键或者子目录，默认不显示子目录中内容。

    $ etcdctl ls
    /testdir
    /testdir2
    /dir

    $ etcdctl ls dir
    /dir/testkey

    支持的选项：
    --sort 将输出结果排序

    --recursive 如果目录下有子目录，则递归输出其中的内容

    -p 对于输出为目录，在最后添加/进行区分

### 非数据库操作

- backup

  备份 etcd 的数据。

        $ etcdctl backup --data-dir /var/lib/etcd  --backup-dir /home/etcd_backup

  支持的选项包括:

        --data-dir  etcd的数据目录
        --backup-dir 备份到指定路径

- watch

  监测一个键值的变化，一旦键值发生更新，就会输出最新的值并退出。

  例如:用户更新 testkey 键值为 Hello watch。

        $ etcdctl get /testdir/testkey
        Hello world
        $ etcdctl set /testdir/testkey "Hello watch"
        Hello watch
        $ etcdctl watch testdir/testkey
        Hello watch

  支持的选项包括:

        --forever  一直监测直到用户按CTRL+C退出
        --after-index '0' 在指定index之前一直监测
        --recursive 返回所有的键值和子键值

- exec-watch

  监测一个键值的变化，一旦键值发生更新，就执行给定命令。

  例如：用户更新 testkey 键值。

        $ etcdctl exec-watch testdir/testkey -- sh -c 'ls'
        config  Documentation  etcd  etcdctl  README-etcdctl.md  README.md  READMEv2-etcdctl.md

  支持的选项包括:

        --after-index '0' 在指定 index 之前一直监测
        --recursive 返回所有的键值和子键值

- member

  通过 list、add、remove 命令列出、添加、删除 etcd 实例到 etcd 集群中。

  查看集群中存在的节点

        $ etcdctl member list
        8e9e05c52164694d: name=dev-master-01 peerURLs=http://localhost:2380 clientURLs=http://localhost:2379 isLeader=true

  删除集群中存在的节点

        $ etcdctl member remove 8e9e05c52164694d
        Removed member 8e9e05c52164694d from cluster

  向集群中新加节点

        $ etcdctl member add etcd3 http://192.168.1.100:2380
        Added member named etcd3 with ID 8e9e05c52164694d to cluster

























