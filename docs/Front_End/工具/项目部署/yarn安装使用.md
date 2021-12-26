---
title: yarn安装与使用
order: 2
---

# Yarn

## 一、安装 yarn

### 1.CentOS 环境下安装 yarn

node 安装后默认自带随版本的 npm 包管理器，使用 npm 安装 yarn

    npm install -g yarn

    查看输出命令行显示的yarn安装位置，通常显示为：
    /usr/local/nodejs/bin/yarn -> /usr/local/nodejs/lib/node_modules/yarn/bin/yarn.js

    ln -s /usr/local/nodejs/bin/yarn /usr/local/bin/

### 2.Windows 环境下安装 yarn

    npm i -g yarn

##### 解决 yarn 安装包后，语法错误问题（dumi）

通常出现在 windows 上更改了 node 的全局安装目录，后续又使用 npm 安装的 yarn

首先查看 yarn 命令的目录：

    yarn global bin
    // D:\Node\node_global\bin 表示node全局在该目录下

[注]: 其他文章说将获取到的路径配置到环境变量 Path 上。但没有解决问题

如上注解方案，他们的 npm 的全局安装位置是默认装的 C 盘目录，但我改了 npm 的全局安装位置。
查看 yarn 的全局安装位置：

    yarn global dir
    // C:\Users\Fuuka\AppData\Local\Yarn\Data\global 查询结果是 C盘的用户目录下，有问题，因此要改

yarn 的全局安装位置与 bin 的位置并不一致，所以我们来修改 yarn 的全局安装位置试试，将其修改为与 npm 一致

    $ yarn config set global-folder "D:/Node/yarn_global"
        yarn config v1.22.4
        success Set "global-folder" to "D:/Node/yarn_global".
        Done in 0.10s.

    $ yarn config set cache-folder "D:/Node/yarn_cache"
        yarn config v1.22.4
        success Set "cache-folder" to "D:/Node/yarn_cache".
        Done in 0.10s.

再次安装 dumi 试试，应该成功！
