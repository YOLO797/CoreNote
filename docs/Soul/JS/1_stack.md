---
title: 栈
order: 1
group:
  title: JS数据结构
  order: 2
---

## 什么是栈

**栈，又称堆栈，是一种运算受限的线性表。其限制是仅允许在表的一端进行插入和删除运算，这一端被称为栈顶，相对地，把另一端称为栈底。向一个栈插入新元素又称作进栈、入栈或压栈，它是把新元素放到栈顶元素的上面，使之成为新的栈顶元素；从一个栈删除元素又称作出栈或退栈，它是把栈顶元素删除掉，使其相邻的元素成为新的栈顶元素。**(来自百度百科)

形象点说，就是拿了一个口径跟硬币一样大的量筒，入栈就是把一个硬币放进去，最先放进去的那个硬币就在量筒的最低端，取不出来，最后放进去的硬币就在量筒的最上端，能取出来。出栈就是把最上面的那个硬币取出来。在这个量筒中只能这么执行，不能出现其他骚操作（比如把量筒砸了），但是你可以通过透明的量筒壁来数一数到底量筒中放入了几个硬币。

## 栈

### 初始化类

首先来定一个 Stack 类：

```js
class Stack {
  items = [];
}
```

我们使用一个 js 中的数组作为载体（量筒），对其进行限制模拟一个栈。

### 入栈

入栈操作，就是往栈中插入一个元素：

```js
add(node){
  this.items.push(node)
}
```

### 出栈

既然有了入栈，那必须得有出栈，根据栈先入后出的特点添加一个 pop 方法：

```js
pop(){
  return this.items.pop()
}
```

### 获取当前最上层元素

如果想知道当前栈里面最后一个插进来的元素，那么就直接返回整个栈最顶层的元素

```js
get peek(){
  return this.items[this.items.length - 1]
}
```

### 判空

判断一个栈是否为空:

```js
get isEmpty(){
  return this.items.length === 0
}
```

### 获取长度

想知道当前栈的长度：

```js
get size(){
  return this.items.length
}
```

### 清空

再如果不需要这个栈里面的数据的话呢，就清除了吧：

```js
clear(){
  this.items.length = 0;
}
```

### 打印

如果想查看整个栈的所有元素，那么就打印出来吧：

```js
print(){
  console.log(this.items.toString())
}
```

### 整合

方法定义完了，最后整合一下吧：

```js
class Stack {
  items = [];

  add(node) {
    this.items.push(node);
  }
  pop() {
    return this.items.pop();
  }
  get peek() {
    return this.items[this.items.length - 1];
  }
  get isEmpty() {
    return this.items.length === 0;
  }
  get size() {
    return this.items.length;
  }
  clear() {
    this.items.length = 0;
  }
  print() {
    console.log(this.items.toString());
  }
}
```
