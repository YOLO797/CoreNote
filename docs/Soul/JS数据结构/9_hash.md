---
title: 散列
order: 9
---

## 什么是散列

**把任意长度的输入通过散列算法变换成固定长度的输出，该输出就是散列值。**

散列算法的作用是尽可能快地在数据结构中找到一个值，其也是字典类的一种散列表现方式。上面的字典类中如果需要找到一个值（get 方法）是需要对字典进行遍历查找，而散列是对每一个值有一个特定的数字进行存储，当需要查找某个值的时候直接去找其对应的数字就行了。

## 散列

第一个散列类我们使用最常用的“lose lose”散列函数，其是将参数中所有字母的 ASCII 码进行相加。先来创建一个散列类：

### 创建类

```js
class HashTable {
  constructor() {
    this.table = [];
  }
}
```

### 存储算法

依据“lose lose”散列函数来给每个需要存储的参数编写一个求存储数值的方法：

```js
static loseloseHashCode(key){
  let hash = 0
  for (let codePoint of key) {
    hash += codePoint.charCodeAt()
  }
  return hash % 37
}
```

### 写入

```js
put(key, value) {
  const position = HashTable.loseloseHashCode(key)this.table[position] = value
}
```

### 取值

```js
get(key) {
  return this.table[HashTable.loseloseHashCode(key)]
}
```

### 删除

```js
remove(key) {
  this.table[HashTable.loseloseHashCode(key)] = undefined
}
```

### 整合

```js
class HashTable {
  constructor() {
    this.table = []
  }
  static loseloseHashCode(key) {
    let hash = 0
    for (let codePoint of key) {
      hash += codePoint.charCodeAt()
    }
    return hash % 37
  }
  // 修改和增加元素
  put(key, value) {
    const position = HashTable.loseloseHashCode(key)this.table[position] = value
  }

  get(key) {
    return this.table[HashTable.loseloseHashCode(key)]
  }

  remove(key) {
    this.table[HashTable.loseloseHashCode(key)] = undefined
  }
}
```

大功告成，这样子就完成了一个 HashTable 类。在 HashTable 类中，我们移除一个字段不需要删除这个位置，只需要用 undefined 来占位就行，因为每一个数值对应一个位置，如果删除了这个位置，后面的所有数值都会前进一个位置，就会影响整个排列。
