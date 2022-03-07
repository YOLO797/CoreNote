---
title: pip
order: 6
---

# 包管理器 - pip

## 1. 使用流程

### 1.1 换源

##### PYPI 国内源路径

- 阿里云 http://mirrors.aliyun.com/pypi/simple/
- 豆瓣(douban) http://pypi.douban.com/simple/
- 清华大学 https://pypi.tuna.tsinghua.edu.cn/simple/
- 中国科学技术大学 http://pypi.mirrors.ustc.edu.cn/simple/

通常有 **两种** 换源方式：

1. **临时换源**：

   > 临时换源只需要在 `pip` 安装包时，加上一个 `-i` 参数后接源的 `url` 即可：

   ```sh
   # 下载python中的Django包，这里使用的是豆瓣源
   $ pip install django -i http://pypi.douban.com/simple
   ```

   显然不是一个一劳永逸的方法，下少量包的场景适用

2. **永久换源**：

   ##### Linux

   1. 在根目录下创建/修改 `～/.pip/pip.conf` **pip** 配置文件；

   2. 进入文件新增/修改内容；

      ```ini
      [global]
      index-url=http://pypi.douban.com/simple
      [install]
      trusted-host=pypi.douban.com
      ```

   3. 保存文件并退出；

   ##### Windows

   在如：`C:\Users\Fuuka\AppData\Roaming\pip` 这种路径下：

   ```
   %HOMEPATH%\pip\pip.ini
   ```

   中修改配置，然后保存退出

   **命令**：

   ```sh
   # 清华源
   pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

   # 阿里源
   pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/

   # 腾讯源
   pip config set global.index-url http://mirrors.cloud.tencent.com/pypi/simple

   # 豆瓣源
   pip config set global.index-url http://pypi.douban.com/simple/

   # 换回默认源
   pip config unset global.index-url
   ```

### 下载 wheel

- windows:
  ```bash
  $ pip download -d D:\Program\ grpcio grpc-tools protobuf
  ```
- linux:

  ```shell
  $ pip3 download -d ./ grpcio grpc-tools protobuf
  ```

- 线上 download

  ```sh
  # 如： 手动输入如下网址：
  # https://pypi.tuna.tsinghua.edu.cn/simple/grpcio/
  # https://pypi.tuna.tsinghua.edu.cn/simple/grpcio-tools/
  ```
