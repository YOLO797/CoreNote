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

  属性选择器:
  class="div1 div2"(表示，可以被 div1、div2 两种样式单控制)
  因此[class~="div2"]这样既可控制如上形式（~表示两个选择谁都行）
  而对于[class^="di"]则只看是以 di 开头的。类比正则。$以..结尾。\*无论开头结尾，只要有就行。

  有用的属性：（这里指的是控制文本的属性）
  text-align: center; line-heiget=50px(控制居中,水平加垂直) -- 注：有时不居中是由于脱离文档流后若不设定 width 它并不知道有多长
  letter-space: 5px(letter 是字母的意思，字间距 5 像素)
  word-space:10px 即词间距

  伪类：Pseudo-classes 需掌握
  border-radius 变圆

  外边距和内边距：
  div 设定的 width 包含了两个 border、两个 padding 和 content，而 margin 指的就是 div（body 也是）的外边距。其中若 padding 不为 0 则会扩充 div

        上下塌陷的坑：margin collapse（边界塌陷或者说边界重叠）
            父子div中没有数据导致，详见博客(上下塌陷不仅局限于float，应该说float是上下塌陷的一种，只要div嵌套div中没有数据就会有边界塌陷出现)
            if  父级div中没有 border，padding，inline content，子级div的margin会一直向上找，直到找到某个标签包括border，padding，inline
            content 中的其中一个，然后按此div 进行margin ；
             解决方法：
                1: border:1px solid transparent
                2: padding:1px
                3: over-flow:hidden;

  虽然 float 和 position 的 absolute 都能脱离文档流，但 float 的是部分脱离，而 absolute 则是完全脱离.(尽量用 float 不要用 position，但该用时还要用)
  但为啥 float 的 div 中有文字则不会覆盖，那是因为 float 的设计初衷就是文字环绕图片效果。
  当 float 后的背景颜色浮动不出来是，在其后加一个空标签，样式 clear 进行双清。目的是为了让 outer 标签有内容 -- 一下解释
    <div class="outer">  -- outer里面嵌套了两个菜单,当两个菜单设置浮动后脱离文档流。outer内容为空，此时若在outer中设置样式则无法显示
        <div class="menu1">菜单一</div>
        <div class="menu2">菜单二</div>
        <div class="clear"></div> -- 因此在outer内部在加一个空标签，进行双清，使其独占一行，此时outer中有了数据，便不会边界塌陷，样式显示
    </div>

  不仅如此，在 outer 的样式单设置 overflow: hidden;也可行。/_可以忘记它了_/

  主流是用 after 来清除浮动：（说实话后面加空标签 clear：both 来撑开文档流费劲了）
  after 是在某一个标签内部的下面可以加一个标签，因此通过 css 的方式在设定时加上 这一串
  .clearfix:after{
  content:"ooo"; -- 这个不写则 after 没用了，没标签了
  display:none; -- 若用 display:none 表示隐藏了不占位置
  clear:both; -- 双清
  visibility:hidden; -- 若加上 visibility:hidden;则是隐藏还占位置（只内容隐藏了）
  height:0; -- 再让高度为零，浏览器便不会显示
  }
  因此生产中用这种方式来清除浮动， 1.可复用。（凡是有 clearfix 就后面双清） 2.用于动态加载（知乎、微博底部的点击加载，后面的 div 加载出来若用以前的（后面加个空标签双清）则会后面覆盖撑起一半，因此用 after 动态添加）

  fixed 也是脱离文档流，常用于返回顶部，除此之外，position 中还有 absolute 也是脱离文档流而 relative，static 则是正常文档流和 static 和没有设置一样

  通常都用 float，因为 position 的话会随分辨率大小而显示异常

  display：有 none block inline 三种。display:inline-block 可做列表布局
  活用 inline-block 标签 -- 比如<a>,可以把内联标签变为块级标签

hover 补充： 1.返回顶部：
hover 不是 a 标签特有的，div 中也能利用。可以离用 div:hover 来改变样式单的 display 属性达到返回顶部等特效。
.c1 .c2:hover .c3{}指的是当鼠标放在 c1 下的 c2 上，c2 下的 c3 才生效 2.下拉菜单：（见下拉菜单及布局）
先写个 div，鼠标放上去背景变了是 hover 实现的。那么再这个 div 中嵌套一个小的 div 也可以。使其 position 等于 absolute。但是它是 div 里面的一部分。
那么把它的 bottom 设置为负，因此它便在 div 外面进行显示。当鼠标放上去时让 div 显示出来即可。

抽屉布局：
设计布局时由外到内，层层向里，先搭建外面的 div 在细化内部的 div
去除 a 标签下划线：text-decoration: none;

    重点与补充 -- 见源码注释部分

    本次实仿抽屉页面中仍有不足，尚未解决，以后有空进行改进。

规范：
id 写的时候用 id_name
class 写的时候用 class-name
