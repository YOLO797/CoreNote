---
title: node/npm安装与使用
order: 1
group:
  title: 项目部署
  order: 41
---

# 前端安装问题汇总：

## 一、Node

### 1.CentOS 安装 node + npm

#### 安装 node

推荐源码安装：

- 1.从官网下下载最新的 nodejs，https://nodejs.org/en/download/

  ```sh
  注意：下载的是Linux Binaries (x64) 二进制
  ```

- 2.通过 ftp 工具上传到 linux 服务，解压安装包

      ```sh

  tar -xvf node-v10.16.0-linux-x64.tar.xz

  ````

  3、移动并改名文件夹（不改名也行）

  ```sh
  mv node-vxxx-linux-64/ /usr/local/nodejs
  ````

  4、让 npm 和 node 命令全局生效

  ```sh
  ln -s /usr/local/nodejs/bin/npm /usr/local/bin/
  ln -s /usr/local/nodejs/bin/node /usr/local/bin/
  ```

[注]: 后续安装yarn等其他的配置环境变量，都可以软连接到/usr/loca/bin下

#### 安装 yarn

node 安装后默认自带随版本的 npm 包管理器，使用 npm 安装 yarn

```sh
npm install -g yarn

查看输出命令行显示的yarn安装位置，通常显示为：
/usr/local/nodejs/bin/yarn -> /usr/local/nodejs/lib/node_modules/yarn/bin/yarn.js

ln -s /usr/local/nodejs/bin/yarn /usr/local/bin/
```

## 二、npm

NodeJs 的默认包管理器，用于安装和发布软件

### 1、npm 使用:

- 镜像源
  搭建环境设置淘宝镜像
  npm config set registry https://registry.npm.taobao.org --global // 设置当前地址（默认地址）
  npm config set disturl https://registry.npm.taobao.org --global
  查看镜像的配置结果
  npm config get registry
  npm config get disturl
  使用 nrm 工具切换/切换回淘宝源
  npx nrm use taobao/npm
  使用淘宝定制的 cnmp 命令行工具代替默认的 npm
  npm install -g cnpm --registry=https://registry.npm.taobao.org
- 基本使用：
  npm -v 查看版本
  npm install xxx 安装
  -g 全局安装
  -save 在 package.json 文件的 dependencise 字典中写入依赖项
  -save-dev 在 package.json 文件的 devDependencise 字典中写入依赖项
  npm -g install npm@5.9.1 (@后跟版本号) 可以安装、更新指定版本
  npm list -g 查看全局安装包列表
  npm list vue 查看某个模块版本号
  npm update -g packageName 更新全局包
  npm uninstall --save packageName 卸载包并再 package.json 中删除
  [注]:
  - dependencise 运行时依赖，发布后，即生产环境下需要用的模块
  - devDependencise 开发时依赖，开发时用到的模块，发布不用，比如项目中的 gulp、压缩 css、js 的模块，项目发布部署时不用

### 2、注意事项

- 1.当 npm install 卡住:（如安装 core-js）

  若提示权限不够，operation not permitted 请尝试此命令删除缓存

  > npm cache verify

### 3、包的导入:

以导入 jq 为例:

- 1.以前原始的导入方式是原生导入
  <script src="./node_modules/jquery/dist/jquery.min.js"/>
- 2.使用 npm 则可以
  const $ = require("jquery") // npm 安装 可直接从 node_modules 中自动找到 jquery

        const foo = rquire("./func.js") // 导入js文件下的函数 后缀可不写

        const foo = rquire("./func")
