---
title: Quasar
order: 1
group:
  title: Quasar应用
  order: 25
---

# Quasar

[Quasar](https://quasar.dev/)|[中文文档](http://www.quasarchs.com/)

### 安装

[Quasar CLI](https://quasar.dev/start/quasar-cli)

```shell
$ yarn global add @quasar/cli
$ yarn create quasar

# or:

$ npm i -g @quasar/cli
$ npm init quasar
```

**注意：**

- **node v14+** 适配 **Vite**

- 目前别使用 **pnpm**，支持不好容易安装失败

- **Windows**环境 安装 `node-sass` 失败，提示 `not found python2` ，执行以下命令获取 `build` 工具

  ```shell
  $ npm install --global --production windows-build-tools
  ```
