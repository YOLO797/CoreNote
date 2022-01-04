---
title: PostgreSQL基础
order: 1
group:
  title: PostgreSQL
  order: 12
---

# PostgreSQL:

## 一、PostgreSQL 数据库：

### 1.CentOS7 环境：

https://cloud.tencent.com/developer/article/1434616

#### 安装:

    [root@VM-0-2-centos ~]# yum -y install postgresql-server

    [root@VM-0-2-centos ~]# postgresql-setup initdb
    Initializing database ... OK

    # 设置postgresql可被远程连接登录
    [root@vm-06 ~]# vim /var/lib/pgsql/data/postgresql.conf

    # 第59行取消注释，更改为：（vim 在VI的命令模式下显示所有行数 :set nu）
    listen_addresses = '*'

    # 第396行，添加
    log_line_prefix = '%t %u %d '

    [root@vm-06 ~]# systemctl start postgresql

    [root@vm-06 ~]# systemctl enable postgresql
    # 如果配置文件里面设置了开机启动，systemctl enable命令相当于激活开机启动。

#### 防火设置：（暂未设置）

    [root@vm-06 ~]# firewall-cmd --add-service=postgresql --permanent
    success

    [root@vm-06 ~]# firewall-cmd --reload
    success

#### 设置 PostgreSQL 管理员用户的密码并添加一个用户并添加一个测试数据库。

    [root@VM-0-2-centos]# su - postgres
    -bash-4.2$ psql -c "alter user postgres with password 'wunasaigao821'"
    ALTER ROLE
    -bash-4.2$ createuser devops    # 貌似这里设置的用户，要和linux用户一一对应，因此可以createuser 一个 root用户
    -bash-4.2$ createdb testdb -O devops
    -bash-4.2$ exit
    logout

[注]：postgres 为默认的 superroot 身份

#### 以刚刚添加的用户身份登录，并将 DataBase 作为测试操作。

    [root@VM-0-2-centos backend]# su - root
    Last login: Fri Sep 18 09:35:57 CST 2020 from 183.15.178.99 on pts/0
    [root@VM-0-2-centos ~]# psql -l
                                     List of databases
       Name    |  Owner   | Encoding |  Collate   |   Ctype    |   Access privileges
    -----------+----------+----------+------------+------------+-----------------------
     postgres  | postgres | UTF8     | en_US.utf8 | en_US.utf8 |
     template0 | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
               |          |          |            |            | postgres=CTc/postgres
     template1 | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
               |          |          |            |            | postgres=CTc/postgres
     testdb    | devops   | UTF8     | en_US.utf8 | en_US.utf8 |
    (4 rows)

    [root@VM-0-2-centos ~]#  psql testdb
    psql (9.2.24)
    Type "help" for help.
    testdb=> alter user root with password 'wunasaigao821';
    ALTER ROLE
    testdb=> create table test (no int,name text );
    CREATE TABLE
    testdb=> insert into test (no,name) values (1,'root');
    INSERT 0 1
    testdb=> select * from test;
     no | name
    ----+------
      1 | root
    (1 row)

    testdb=> drop table test;
    DROP TABLE
    testdb=> \q
    [root@VM-0-2-centos ~]# dropdb testdb
