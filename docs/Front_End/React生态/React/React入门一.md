---
title: React基础
order: 1
group:
  title: React框架
  order: 31
---

# React 框架

### 1. React 简介

#### 1.1 历史背景：

**React** 是当时 `facebook` 为了解决如下问题：

- 传统 `UI` 操作关注大量细节 （**JQ** 需要熟悉各种 `API` 才能操纵 `DOM`）
- 应用程序状态分散在各处，难以维护，随着项目不断复杂化，导致改个小需求，`bug` 频发

### 1.2 特性：

> **React** 其实很简单，特性如下：

##### 整体刷新页面：

- 如: `append` 一个消息，`DOM` 上增加一个 `<li>message</li>`
  - 原生做法，需要修改时操作父级 `DOM`，判断子 `DOM` 是否增加，和增加到了那里
  - 使用`React`，只用关心整体状态，之前是 2 条消息 -> 后面是 3 条消息 整体改变状态即可
- **好处**：不用关心 `DOM` 细节

##### 组件概念：

> 组件：将整个 `UI` 拆分成一块块组件，页面由多个组件搭积木，拼合而成

属性 + 状态 -> 得到一个 `View`

<Badge type="success">props</Badge> + <Badge type="error">state</Badge> -> <Badge> View</Badge>

- 状态分为两种：

  - 传入的（通过 `props` 传进来）
  - 内部维护的（内部发生事件，让外部知道变化）

- 组件一般不提供方法，而是某种状态机*（状态是什么，结果就是什么）*
- 可理解为纯函数：输入的是什么，那么输出的结果一定是什么
- 单向数据绑定

- 单一职责原则：
  - 一个组件只干一件事
  - 若组件复杂，则拆分
    - 大组件，一个变化，整体组件都要刷新，若拆分成小组件，则只需小组件内部刷新

##### 单向数据流：

> 传统 `MVC` 是一个 `Controller` 绑定了大量的 `Model`，而且每个 `Model` 还绑定了各种 `View`

<img src="./image/传统MVC.jpg">

这种架构导致特别混乱，维护异常困难，因此 `React` 提出了如下 **Flux 架构：**

<img src="./image/单向数据流.jpg">

**React** 只关注于状态，如图：是 **Flux 架构** ，一种 **设计模式**，但非完整实现

- `View` 上发生了操作
- `->` 产生 `Action`
- `->` 通过 `Dispatcher` 出去
- `->` 由 `Store` 进行处理，改变数据
- 由于 `View` 绑定在 `Store` 上，因此会随之改变数据

**数据状态管理原则**：_（**DRY**）_

- 能计算得到的状态，就不要单独存储
- 组件尽量无状态，所需数据通过 `props` 获取

##### 4 个必须 API：

##### 完善的错误提示：

### 1.3 JSX：

**JSX 表达式**

> `JSX` 的本质，其实不是模板语言，而是语法糖，一个 `JSX` 表达式，就相当于一个 `createElement` 组件

<img src="./image/JSX.jpg">

##### 安装：

```sh
$ npm install -g create-react-app
$ create-react-app my-app
$ cd my-app
$ npm start
```

####

    文件目录结构
        node_modules    --这里面包含了react项目中会用到的一些组件，install的时候下载下来的
        public/index.html   --包含了项目中的启动页面，react比较适合单页面项目应用开发，所以暂时只包含一个index.html，react工程的入口页面
        src/index.js    --包含了一些我们自己使用的js文件，css文件，img文件等等。不要管什么app.js，你就看到index.js即可，系统默认将index.html
                          对准了index.js，index.js也就是我们的入口js，他和index.html所对应。

        这样不好理解，因此可以变换为
        /public
            - index.html
        /src
            -css
            -img
            -js
            index.jx
        注：可以删除或重命名其他文件。

    参考：
        http://www.ruanyifeng.com/blog/2016/09/react-technology-stack.html
        https://doc.react-china.org/docs/state-and-lifecycle.html

个生命周期）

    0.注意 componentWillUnmount() 组件被卸载和销毁之前立即调用 此方法中执行任何必要的清理，例如使计时器无效、取消网络请求或清除在组件
    1.componentWillReceiveProps() 当组件传入的 props 发生变化时调用，但父组件进行render 此生命周期仍然调用
    2.shouldComponentUpdate() 中执行diff算法。（给定两棵树，找到最少转换步骤）原始O(n^3)，现在O(n) 不遍历整棵树，按层diff，不移动只删，
        若遍历到不同结点则不再后续遍历，直接删除不同结点。
