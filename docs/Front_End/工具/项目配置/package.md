---
title: package.json
order: 1

group:
  title: 项目配置
  order: 41
---

# Package.json

## 简述

- 生成 package.json
  > npm init
- package.json 属性说明
        > name - 包名
        > version - 版本号
        > description - 描述
        > homepage - 包的官网url
        > author - 作者姓名
        > contributors - 其他贡献者
        > dependencies - 依赖包列表。如果依赖包没有安装，npm会自动将依赖包安装到 node_module 目录下
        > devDependencies - 运行时依赖包列表
        > script - 脚本，使用命令
            如: "lint": "eslint --ext .js,.ts,.vue ./"  使用 npm run lint 执行
        > repository - 代码存放地方的类型，可以是git
        > main - main 字段指定了程序的主入口文件， require('moduleName')就会加载这个文件。这个字段的默认值是模块根目录下的index.js
        > keywords - 关键字 如: ufs vue quasar
