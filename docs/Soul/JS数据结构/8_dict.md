---
title: 字典
order: 8
---

## 什么是字典

**字典（dictionary）是一些元素的集合。每个元素有一个称作 key 的域，不同元素的 key 各不相同。有关字典的操作有：插入具有给定关键字值的元素、在字典中寻找具有给定关键字值的元素、删除具有给定关键字值的元素。**

## 字典

字典在 js 的实现就是 Object，没有什么太大的区别，正常使用几乎一致，就写一点来模拟一下。

### 创建类

创建一个字典类：

```js
class Dictionary {
  constructor() {
    this.items = {};
  }
}
```

### 写入

```js
set(key,value){
  this.items[key] = value
}
```

### 获取

```js
get(key){
  return this.items[key]
}
```

### 删除

```js
remove(key){
  delete this.items[key]
}
```

### 获取所有 key 值

```js
get keys(){
  return Object.keys(this.items)
}
```

### 获取所有 value 值

```js
get values(){
  return Object.values(this.items)
}
```

### 整合

```js
class Dictionary {
  constructor() {
    this.items = {};
  }
  set(key, value) {
    this.items[key] = value;
  }
  get(key) {
    return this.items[key];
  }
  remove(key) {
    delete this.items[key];
  }
  get keys() {
    return Object.keys(this.items);
  }
  get values() {
    /**
     * ES7: return Object.values(this.items)
     */
    return Object.keys(this.items).reduce((arr, current, index) => {
      arr.push(this.items[current]);
      return arr;
    }, []);
  }
}
```

好了，一个字典类完成了。
