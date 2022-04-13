---
title: 分离链接
order: 10
---

## 什么是分离链接

上一节写了 THashTable 类，它有一个问题就是，如果存储 “ab” 和 “ba” 这两个值呢，得到的 key 值是相同的，这样子第二个存储的值会将第一个覆盖，这肯定不是我们想要的，所以就有了解决这个冲突的办法。

首先看解决这个冲突的第一个办法：**分离链接**。

分离链接是将同一个位置的不同值根据写入顺序形成一个单向链表，这样就不会发生冲突了。

## 分离链接

### 初始化类

```js
constructor() {
  this.table = []
}
```

### 写入

```js
put(key,value){
  const position = HashTable.loseloseHashCode(key)
  if (this.table[position] === undefined) {
    this.table[position] = new LinkedList()
  }
  this.table[position].append({ key, value })
}
```

### 取值

```js
get(key) {
  const position = HashTable.loseloseHashCode(key)
  if (this.table[position] === undefined) return undefined
  const getElementValue = node => {
    if (!node && !node.element) return undefined
    if (Object.is(node.element.key, key)) {
      return node.element.value
    } else {
      return getElementValue(node.next)
    }
  }
  return getElementValue(this.table[position].head)
}
```

### 删除

```js
remove(key) {
  const position = HashTable.loseloseHashCode(key)
  if (this.table[position] === undefined) return undefined

  const getElementValue = node => {
    if (!node && !node.element) return false
    if (Object.is(node.element.key, key)) {
      this.table[position].remove(node.element)
      if (this.table[position].isEmpty) {
        this.table[position] = undefined
      }
      return true
    } else {
      return getElementValue(node.next)
    }
  }

  return getElementValue(this.table[position].head)
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
    if (this.table[position] === undefined) {
      this.table[position] = new LinkedList();
    }
    this.table[position].append({ key, value });
  }

  get(key) {
    const position = HashTable.loseloseHashCode(key);
    if (this.table[position] === undefined) return undefined;
    const getElementValue = (node) => {
      if (!node && !node.element) return undefined;
      if (Object.is(node.element.key, key)) {
        return node.element.value;
      } else {
        return getElementValue(node.next);
      }
    };
    return getElementValue(this.table[position].head);
  }

  remove(key) {
    const position = HashTable.loseloseHashCode(key);
    if (this.table[position] === undefined) return undefined;
    const getElementValue = (node) => {
      if (!node && !node.element) return false;
      if (Object.is(node.element.key, key)) {
        this.table[position].remove(node.element);
        if (this.table[position].isEmpty) {
          this.table[position] = undefined;
        }
        return true;
      } else {
        return getElementValue(node.next);
      }
    };
    return getElementValue(this.table[position].head);
  }
}
```

ok，大功告成！分离链接的核心在于每一个存储数字的位置都是一个单向链表，这样子在找一个值得时候，首先找到其所在的位置，然后从该位置的链表的头部开始查找，相比直接查找位置，这样子效率是慢了，但是确实是解决了冲突问题。
