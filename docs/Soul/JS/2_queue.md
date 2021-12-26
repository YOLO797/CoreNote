---
title: 队列
order: 2
---

## 什么是队列

**队列是一种特殊的线性表，特殊之处在于它只允许在表的前端（front）进行删除操作，而在表的后端（rear）进行插入操作，和栈一样，队列是一种操作受限制的线性表。进行插入操作的端称为队尾，进行删除操作的端称为队头。**

顾名思义，队列就跟我们平时的排队进景区一样，先来的人排在前面，后面来的人排在后面，而且前面的人也是最先离开队列进入景区的 。

## 队列

### 创建队列类

开始写代码，先创建一个队列类：

```js
class Queue {
  constructor() {
    this.items = [];
  }
}
```

跟栈一样，我们也有一个数组进行限制操作来模拟队列。

### 入队

首先肯定是添加一个元素进入队列，直接将元素添加在数组的最后边：

```js
enqueue(node) {
  this.items.push(node)
}
```

### 出队

然后是出队列，也就是删除数组的第一个元素：]

```js
dequeue() {
  this.items.shift()
}
```

### 查找队首

获取下一个要出队列的元素：

```js
get front(){
  return this.items[0]
}
```

### 获取长度

获取整个队列的长度：

```js
get size(){
  return this.items.length
}
```

### 判空

获取队列是否为空：

```js
get isEmpty(){
  return this.items.length === 0
}
```

### 清空

清空整个队列：

```js
clear(){
  this.items = []
}
```

### 打印

```js
print(){
  console.log(this.items.toString())
}
```

### 整合

将上面的所有方法整理一下：

```js
class Queue {
  constructor() {
    this.items = [];
  }
  // 添加
  enqueue(node) {
    this.items.push(node);
  }
  // 出队列
  dequeue() {
    this.items.shift();
  }
  // 取首位
  get front() {
    return this.items[0];
  }
  // 取长度
  get size() {
    return this.items.length;
  }
  // 是否为空
  get isEmpty() {
    return this.items.length === 0;
  }
  // 清空
  clear() {
    this.items = [];
  }
  // 打印队列内容
  print() {
    console.log(this.items.toString());
  }
}
```

一个完整的队列类就做好了。
