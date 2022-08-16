---
title: Vue
order: 1
group:
  title: Vue 框架
  order: 21
---

# Vue<Badge type="miku">渐进式框架</Badge>

既可以当成 `小插件` 使用，也可以当做 `全套全家桶前端项目` 来使用的框架

<Alert type="info"><Font type="miku" fsize="m">**Vue** 文档</Font>写的已经 **很可以**了，没必要 **再抄一遍** 文档！</Alert>

[Vue 2](https://v2.cn.vuejs.org/) | [Vue3 中文文档](https://staging-cn.vuejs.org/guide/introduction.html)

---

<Font type="miku" fsize="l">**数据驱动视图**</Font>

逻辑只放在数据的改变上，不推荐模板形式 `{{}}`，用指令（_原生对应_）

- `v-text:` 指定文本内容，对应 **JS** 的 `innerText`

- `v-html:` 用来指定 `DOM` 内容，对应 **JS** 的 `innerHtml`

- `v-for:` 遍历，记得指定 `key`

  ```js
  <component v-for="(item, index) in array" :key="index">{{item}}<component>
  ```

<Font type="miku" fsize="l">**动态绑定**</Font>

- `v-bind：` 动态绑定属性，可简写 `:`
- `v-if/else-if/else:` 控制 显示/隐藏 及其他操作
- `v-show:` 控制 显示/隐藏

- `v-on:` 绑定事件，可简写 `@`

<Font type="miku" fsize="l">**指令修饰符**</Font>

所有 **指令** 都有修饰符，可给指令增加小功能

- `.lazy:` 懒加载，失去光标的时候才进行绑定

  ```js
  <input type="text" v-model.lazy="username" /> {{ username }}
  ```

- `.number:` 转数字

  ```js
  <input type="text" v-model.lazy.number="phone" /> {{ phone }}
  ```

- `.trim:` 去空格

  ```js
  <input type="text" v-model.lazy.trim="mail" /> {{ mail }} <pre>{{ mail }}<pre>
  ```
