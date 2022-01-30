---
title: css
order: 1
group:
  title: CSS
  order: 3
---

## CSS：

> **Tip**
>
> - CSS 指层叠样式表 (Cascading Style Sheets)
> - 样式定义 **如何显示** HTML 元素
> - 样式通常存储在 **样式表** 中
> - 把样式添加到 HTML 4.0 中，是为了 **解决内容与表现分离的问题**
> - **外部样式表** 可以极大提高工作效率
> - 外部样式表通常存储在 **CSS 文件** 中
> - 多个样式定义可 **层叠** 为一个

### 链接

- [CSS（层叠样式表）- MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS)

- [CSS 教程 - 菜鸟教程](https://www.runoob.com/css/css-tutorial.html)

- [CSS 教程 - w3cschool](https://www.w3cschool.cn/css/)

- [CSS3 教程 - 菜鸟教程](https://www.runoob.com/css3/css3-tutorial.html)

- [CSS3 教程 - w3cschool](https://www.w3cschool.cn/css3/)

# CSS3 常用

### 1. 单位

##### 1.1 vw、vh、vmin、vmax 区别

**vw**、 **vh**、 **vmin**、 **vmax** 是一种视窗单位，也是相对单位。它相对的不是父节点或者页面的根节点。而是由视窗（ **Viewport**）大小来决定的

`Viewport：` 用户网页的可视区域，按 F12 || 修改屏幕分辨率 都会对应改动到可视区域

`vw：` 视窗宽度百分比

`vh：` 视窗高度百分比

`vmin：` 当前 `vw` 和 `vh` 中比较小的一个值

`vmax：` 当前 `vw` 和 `vh` 中比较大的一个值

> **Tips：**
>
> `vw` / `vh` 和 `%` 区别在于 `%` 是相对于父元素大小设定的，v 系则是会随视窗变化而变化
>
> `vmin` / `vmax` ： 常用于移动端设置字体大小时，横屏和竖屏状态下保持一致而使用
