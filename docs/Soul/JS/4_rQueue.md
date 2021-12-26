---
title: 循环队列
order: 4
---

## 什么是循环队列

**为充分利用向量空间，克服"假溢出"现象的方法是：将向量空间想象为一个首尾相接的圆环，并称这种向量为循环向量。存储在其中的队列称为循环队列。**

## 循环队列

循环队列相比普通队列，修改的地方也就在于查询某个位置的参数时的不同。

### 获取真实位置

```js
getIndex(index){
  return index % this.items.length
}
```

### 获取真实数据

```js
find(index){
  return !this.isEmpty ? this.items[this.getIndex(index)] : null
}
```
