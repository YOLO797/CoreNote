---
title: etcd v3
order: 2
---

# ETCD V3 版本

## 一、区别

##### 1.兼容性：

etcd2 和 etcd3 是不兼容的，两者的 api 参数也不一样，详细请查看 etcdctl -h

##### 2.写入：

可以使用 api2 和 api3 写入 etcd3 数据，但是需要注意，使用不同的 api 版本写入数据需要使用相应的 api 版本读取数据

##### 3.列目录：

etcd3 没有 ls 使用 get 替代

- api 2 使用方法

        ETCDCTL_API=2 etcdctl ls /

- api 3 使用方法

        ETCDCTL_API=3 etcdctl get /


例如：

- 查询所有 key 或 value :

        $ export ETCDCTL_API=3
        $ export ETCD_ENDPOINTS="https://172.16.120.31:2379,https://172.16.120.32:2379,https://172.16.120.33:2379"
        $ etcdctl --endpoints=${ETCD_ENDPOINTS} get / --prefix --keys-only
        $ etcdctl --endpoints=${ETCD_ENDPOINTS} get / --prefix --print-value-only |jq [.]

- 使用证书查询：

        $ export ETCDCTL_API=3
        $ etcdctl --endpoints=${ETCD_ENDPOINTS} --cacert=/etc/kubernetes/ssl/ca.pem --cert=/etc/kubernetes/ssl/admin.pem --key=/etc/kubernetes/ssl/admin-key.pem --prefix --keys-only=true get /

##### 4.修改键值对:

- api v2 版本：

        $ etcdctl set test hello

- api v3 版本：

        $ etcdctl put test hello


参考：https://github.com/coreos/etcd/issues/6904
