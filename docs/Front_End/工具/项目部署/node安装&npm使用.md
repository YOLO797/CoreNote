---
title: node/npm安装与使用
order: 1
group:
  title: 项目部署
  order: 41
---

# 前端部署说明

### 1. CentOS 下安装

#### 1.1 安装 node

推荐源码安装：

1. 从官网下下载最新的 [nodejs](https://nodejs.org/en/download/)

   - **注意**：下载的是 `Linux Binaries (x64)` 二进制

2. 通过 **ftp** 工具上传到 `linux` 服务，解压安装包

   ```shell
   tar -xvf node-v10.16.0-linux-x64.tar.xz
   ```

3. 移动并改名文件夹（_不改名也行_）

   ```shell
   mv node-vxxx-linux-64/ /usr/local/nodejs
   ```

4. 让 `npm` 和 `node` 命令全局生效

   ```shell
   ln -s /usr/local/nodejs/bin/npm /usr/local/bin/
   ln -s /usr/local/nodejs/bin/node /usr/local/bin/
   ```

> **注意：** 后续安装 `yarn` 等其他的配置环境变量，都可以软连接到 `/usr/loca/bin` 下

#### 1.2 安装 yarn

`node` 安装后默认自带随版本的 `npm` 包管理器，使用 `npm` 安装 `yarn`

```shell
npm install -g yarn

# 查看输出命令行显示的yarn安装位置，通常显示为：
/usr/local/nodejs/bin/yarn -> /usr/local/nodejs/lib/node_modules/yarn/bin/yarn.js

ln -s /usr/local/nodejs/bin/yarn /usr/local/bin/
```

### 2. npm

**npm** 是 `nodejs` 的默认包管理器，用于安装和发布软件

#### 2.1 npm 换源:

- 设置全局淘宝镜像地址

  ```shell
  npm config set registry https://registry.npm.taobao.org --global
  npm config set disturl https://registry.npm.taobao.org --global
  ```

- 查看镜像的配置结果

  ```shell
  npm config get registry
  npm config get disturl
  ```

- 使用 `nrm` 工具切换/切换回淘宝源

  ```shell
  $ npx nrm use taobao源 / npm源
  ```

- 使用淘宝 `cnmp` 替代 `npm`

  ```shell
  npm install -g cnpm --registry=https://registry.npm.taobao.org
  ```

#### 2.2 基本使用

- 查看版本

  ```shell
  npm -v
  ```

- 安装依赖包

  ```shell
  npm install packageName

  # -g 全局安装
  # -save 在 package.json 文件的 dependencise 字典中写入依赖项
  # -save-dev 在 package.json 文件的 devDependencise 字典中写入依赖项

  npm -g install npm@5.9.1 # (@后跟版本号) 可以安装、更新指定版本
  ```

- 查看依赖包

  ```shell
  npm list -g

  npm list vue	# 查看某个模块版本号
  ```

- 更新依赖包

  ```shell
  $ npm update -g packageName # 全局更新依赖包
  ```

- 卸载依赖包

  ```shell
  $ npm uninstall --save packageName # 卸载依赖包，并在 package.json 中删除
  ```

**注意:**

- 当 `npm install` 卡住:（如安装 `core-js`）

  若提示权限不够 `operation not permitted` 请尝试 如下命令删除缓存：

  ```shell
  $ npm cache verify
  ```
