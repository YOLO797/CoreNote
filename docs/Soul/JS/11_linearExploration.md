---
title: 线性探查
order: 11
---

## 什么是线性探查

因为分离链接虽然解决了冲突问题，但是查找起来很麻烦，所以我们使用另外一种方式来解决：**线性探查**。

线性探查就比较粗暴了，**当想向表中某个位置加人一个新元素的时候，如果索引为 index 的位置已经被占据了，就尝试 index+1 的位置。如果 index+1 的位置也被占据了，就尝试 index+2 的位置，以此类推。**

## 线性探查

### 插入

我们直接改写插入方法：

```js
put(key,value){
  const position = HashTable.loseloseHashCode(key)
  if (this.table[position] === undefined) this.table[position] = { key, value }
  else {
    let index = ++position
    while (this.table[index] !== undefined) index++
    this.table[index] = { key, value }
  }
}
```

### 获取

```js
get(key) {
  const position = HashTable.loseloseHashCode(key)
  const getElementValue = index => {
    if (this.table[index] === undefined) return undefined
    if (Object.is(this.table[index].key, key)) return this.table[index].value
    else return getElementValue(index + 1)
  }
  return getElementValue(position)
}
```

### 移除

```js
remove(key) {
  const position = HashTable.loseloseHashCode(key)
  const removeElementValue = index => {
    if (this.table[key] === undefined) return false
    if (Object.is(this.table[index].key, key)) {
      this.table[index] = undefined
      return true
    }
    else
      return this.removeElementValue(index + 1)
  }
  return removeElementValue(position)
}
```

### 整合

```js
class HashTable {
  constructor() {
    this.table = [];
  }
  static loseloseHashCode(key) {
    let hash = 0;
    for (let codePoint of key) {
      hash += codePoint.charCodeAt();
    }
    return hash % 37;
  }
  // 修改和增加元素
  put(key, value) {
    const position = HashTable.loseloseHashCode(key);
    if (this.table[position] === undefined)
      this.table[position] = { key, value };
    else {
      let index = ++position;
      while (this.table[index] !== undefined) index++;
      this.table[index] = { key, value };
    }
  }

  get(key) {
    const position = HashTable.loseloseHashCode(key);
    const getElementValue = (index) => {
      if (this.table[index] === undefined) return undefined;
      if (Object.is(this.table[index].key, key)) return this.table[index].value;
      else return getElementValue(index + 1);
    };
    return getElementValue(position);
  }

  remove(key) {
    const position = HashTable.loseloseHashCode(key);
    const removeElementValue = (index) => {
      if (this.table[key] === undefined) return false;
      if (Object.is(this.table[index].key, key)) {
        this.table[index] = undefined;
        return true;
      } else return this.removeElementValue(index + 1);
    };
    return removeElementValue(position);
  }
}
```

其实线性探查是最简单粗暴的，就你占我位置了，那我去下一个位置，总能找到一个没有被占用的，但是这个方法在数值过多的情况下回就突显缺点：慢，因为如果有上亿的数据，最坏的可能是插入一次需要查找一亿次，这就很浪费时间，所以大佬们就会去寻找更简单的散列函数来处理存入的位置，例如 djb2 、sdbm 等等。

最后介绍一下 djb2 散列函数：

```js
static djb2HashCode(key) {
  let hash = 5381
  for (let codePoint of key) {
    hash = hash * 33 + codePoint.charCodeAt()
  }
  return hash % 1013
}
```

djb2 函数比 “lose lose” 函数的冲突少的多，能更有效的节约处理冲突的时间。
