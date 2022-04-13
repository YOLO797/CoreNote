---
title: 双向链表
order: 6
---

## 什么是双向链表

之前写的链表是单向的，只能从一个节点寻找到它的下一个节点，而双向链表则可以让一个节点找到它的上一个节点和下一个节点。

## 双向链表

### 构建 Node 类

```js
class Node {
  constructor(element) {
    this.element = element;
    this.last = null;
    this.next = null;
  }
}
```

相比于单向链表的节点，我们添加一个属性：`last` ，用来指向它的上一个节点。

### 构建双向链表类

```js
class DoubleLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
}
```

在链表类的实例属性中，我们添加一个属性：`tail` ，表示双向链表的最后一个节点。

### 添加

好了，开始写添加一个节点到链表的最末端：

```js
addEnd(ele){
  const node = new Node(ele)
  let current = null

  if(this.head === null){
    this.head = node
  }
  else if(this.tail === null ){
    this.tail = node
    this.tail.last = this.head
    this.head.next = this.tail
  }
  else{
    current = this.tail
    node.last = current
    current.next = node
    this.tail = node
  }
  this.length++
  return
}
```

和单向链表不同的是，双向链表往最后面添加的时候是直接使用 `this.tail` 进行操作，不需要像单项列表那样一个一个找，知道找到最后一个。

### 插入

接着写插入：

```js
insert(ele, position){
  if(position>=0 && position<this.length){
    const node = new Node(ele)
    let current = this.head, previous = null, index = 0
    if(position === 0){
      this.head = node
      node.next = current
      current.last = node
    }
    else if(position === this.length - 1){
      current = this.tail
      node.last = current
      current.next = node
      this.tail = node
    }
    else{
      while(index++ < position){
        previous = current
        current = current.next
      }
      previous.next = node
      node.last = previous
      node.next = current
      current.last = node
    }
    this.length++
    return true
  }
  return false
}
```

跟单项列表一样，只是在插入的过程中多了一个 last 的指向操作。

### 根据位置删除

接着是根据位置参数进行删除：

```js
removeAt(position){
  if(position >= 0 && position < this.length){
    let current = this.head, previous = null, index = 0
    if(position === 0) {
      this.head = current.next
      this.head.last = null
    }
    else if(position === this.length - 1){
      this.tail = this.tail.last
      this.tail.next = null
    }
    else{
      while(index++ < position){
        previous = current
        current = current.next
      }
      previous.next = current
      current.last = previous
    }
    this.length--
    return true
  }
  return false
}
```

### 整合

其他的操作都跟单向链表一样了，整理一下上面的代码：

```js
class DoubleLinkedList{ 　　constructor() { 　　　　this.head = null 　　　　this.tail = null 　　　　this.length = 0 　　}
　　addEnd(ele){
  　　const node = new Node(ele)
  　　let current = null

　　  if(this.head === null){
   　　 this.head = node
　　  }
　　  else if(this.tail === null ){
　　    this.tail = node
   　　 this.tail.last = this.head
　　    this.head.next = this.tail
　　  }
　　  else{
   　　 current = this.tail
　　    node.last = current
   　　 current.next = node
　　    this.tail = node
　　  }
　　  this.length++
　　  return
　　}
　　insert(ele, position){
  　　if(position>=0 && position<this.length){
   　　 const node = new Node(ele)
 　　   let current = this.head, previous = null, index = 0
　　    if(position === 0){
　　      this.head = node
　　      node.next = current
　　      current.last = node
　　    }
　　    else if(position === this.length - 1){
　　      current = this.tail
　　      node.last = current
　　      current.next = node
　　      this.tail = node
　　    }
　　    else{
 　　     while(index++ < position){
　　        previous = current
  　　      current = current.next
　　      }
   　　   previous.next = node
  　　    node.last = previous
   　　   node.next = current
   　　   current.last = node
  　　  }
  　　  this.length++
 　　   return true
　　  }
 　　 return false
　　}
　　removeAt(position){
 　　 if(position >= 0 && position < this.length){
 　　   let current = this.head, previous = null, index = 0
 　　   if(position === 0) {
 　　     this.head = current.next
　　      this.head.last = null
　　    }
　　    else if(position === this.length - 1){
　　      this.tail = this.tail.last
　　      this.tail.next = null
　　    }
　　    else{
　　      while(index++ < position){
 　　       previous = current
 　　       current = current.next
   　　   }
 　　     previous.next = current
   　　   current.last = previous
   　　 }
   　　 this.length--
  　　  return true
　　  }
　　  return false
　　}
}
```

再将单向链表的其他操作方法添加进去，一个完整的双向链表类也诞生啦。
