---
title: 集合
order: 7
---

## 什么是集合

**集合是由一组无序且唯一（不能重复）的项组成的。**

## 集合

在 ES6 中，js 已经内置了 Set 类型的实现，但是出于学习目的，还是自己写一下吧。

### 初始化类

```js
class Set {
  constructor() {
    this.items = {};
  }
}
```

### 判断是否已存在

因为集合中的所有项不能有重复的，所以首先写一个判断有无重复的方法：

```js
has(value){
  return this.items.hasOwnProperty(value)
}
```

### 添加

```js
add(value){
  if(!this.has(value)){
    this.items[value] = value
    return true
  }
  return false
}
```

### 删除

```js
remove(value){
  if(this.has(value)){
    delete this.items[value]
    return true
  }
  return false
}
```

### 长度

获取集合的长度：

```js
get size(){
  return Object.keys(this.items).length
}
```

### 取值

获取集合的值

```js
get values(){
  return Object.keys(this.items)
}
```

初中数学中我们就学习了集合，两个集合之间会产生并集，交集和差集，还有判断一个集合是否是另外一个集合的子集，来写一下这四个方法。

### 并集

```js
union(otherSet){
  const unionSet = new Set()
  this.values().forEach(v => unionSet.add(v))
  otherSet.values().forEach(v => unionSet.add(v))
  return unionSet
}
```

### 交集

```js
intersection(otherSet){
  const intersectionSet = new Set()
  this.values().forEach(v => {
    if(otherSet.has(v)){
      intersection.add(v)
    }
  })
  return intersectionSet
}
```

### 差集

```js
difference(otherSet){
  const differenceSet = new Set()
  this.values().forEach(v => {
    if(!otherSet.has(v)) differenceSet.add(v)
  })
  return differenceSet
}
```

### 判断是否为子集

```js
subset(otherSet) {
  if (this.size > otherSet.size) {
    return false
  } else {
    return !this.values.some(v => !otherSet.has(v))
  }
}
```

### 整合

```js
class Set {
  constructor() {
    this.items = {};
  }
  has(value) {
    return this.items.hasOwnProperty(value);
  }
  add(value) {
    if (!this.has(value)) {
      this.items[value] = value;
      return true;
    }
    return false;
  }
  remove(value) {
    if (this.has(value)) {
      delete this.items[value];
      return true;
    }
    return false;
  }
  get size() {
    return Object.keys(this.items).length;
  }
  get values() {
    return Object.keys(this.items);
  }
  // 并集
  union(otherSet) {
    const unionSet = new Set();
    this.values.forEach((v) => unionSet.add(v));
    otherSet.values.forEach((v) => unionSet.add(v));
    return unionSet;
  }
  // 交集
  intersection(otherSet) {
    const intersectionSet = new Set();
    this.values.forEach((v) => {
      if (otherSet.has(v)) {
        intersectionSet.add(v);
      }
    });
    return intersectionSet;
  }
  // 差集
  difference(otherSet) {
    const differenceSet = new Set();
    this.values.forEach((v) => {
      if (!otherSet.has(v)) {
        differenceSet.add(v);
      }
    });
    return differenceSet;
  }
  // 子集（判断是否是otherSet的子集）
  subset(otherSet) {
    if (this.size > otherSet.size) {
      return false;
    } else {
      return !this.values.some((v) => !otherSet.has(v));
    }
  }
}
```

好了，一个完整的集合类完成了。

其实这个类写的是内容缺的不少，比如在创建一个 Set 实例的时候不能直接传参，那么我们改一改 constructor 方法：

```js
constructor(...params){
  this.items = {}
  if(params.length === 1 && params[0] instanceof Array){
     params[0].map(v => this.add(v))
  }
  else{
    params.map(v => {
      this.add(v)
    })
  }
}
```
