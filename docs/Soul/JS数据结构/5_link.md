---
title: 链表
order: 5
---

## 什么是链表

**链表是一种物理存储单元上非连续、非顺序的存储结构，数据元素的逻辑顺序是通过链表中的指针链接次序实现的。链表由一系列结点（链表中每一个元素称为结点）组成，结点可以在运行时动态生成。每个结点包括两个部分：一个是存储数据元素的数据域，另一个是存储下一个结点地址的指针域。**  
说通俗一点，就是跟火车一样，每一列车厢都有自己的空间用来坐人，这就是数据域，也有一个铰接去跟下一节车厢进行连接，这就是指针域，用来绑定下一个车厢的。
做链表之前，首先先定义一个节点类：

```js
class Node {
  construtor(ele) {
    this.ele = ele;
    this.next = null;
  }
}
```

这里的 ele 就是设计的数据域，这里的 next 就是设计的指针域，用来指定下一个节点是哪一个。

## 单向链表

单向链表就是最基础的链表，只有一个方向。  
首先来定一个一下基础类：

```js
class LinkedList {
  constructor() {
    this.head = null;
    this.length = 0;
  }
}
```

因为链表是一个有序的数据结构，我们用 head 标示其第一个节点，length 表示链表的长度。

### 添加

第一个要实现的功能肯定是添加元素到链表的最后面：

```js
addEnd(ele){
  const node = new Node(ele)
  let current = null
  if(this.head === null){    // 如果链表为空，直接把需要添加的节点放在head
    this.head = node
  }
  else{
    current = this.head
    while(current.next){    //  在这里寻找链表的最后一个节点
      current = current.next
    }
    current.next = node
  }
  this.length ++
}
```

### 插入

因为链表是链式结构，不像栈一样先进先出的限制，可以在链表中间插入，所以实现一个插入操作

```js
insert(ele, position){
  const node = new Node(ele)
  let current = this.head, previous = null, index = 0

  if(position>=0 && position < this.length){ // 因为插入位置必须小于链表的长度并且不小于0
     if(position === 0){  // 直接插入头部
       node.next = current
       this.head = node
     }
     else{
       while(index++ < position){  // 从0开始找，找到需要插入的位置
         previous = current
         current = current.next
       }
       previous.next = node
       node.next = current
     }
     this.length ++
     return true
  }
  console.log('请输入正确的位置')
  return false
}
```

在链表的插入中，如果要将一个节点插入两个节点（A 和 B）之间，只需要将前面的节点 A 的 next 指向需要添加的节点，并且将需要添加的节点的 next 指向后面的节点 B 就 ok 了。

### 删除

作为数据存储结构，既然有添加那就肯定有删除，实现一个删除方法吧：

```js
removeAt(position){
  if(position>=0 && position< this.length){
    let current = this.head,previous = null, index = 0
    if(position === 0){
      this.head = this.head.next
    }
    else{
      while(index++<position){
        previous = current
        current = current.next
      }
      previous.next = current
    }
    this.length--
    return true
  }
  console.log('请输入正确的位置')
  return false
}
```

删除是怎么删除的呢？需要删除的节点的上一个节点是 A，next 是节点 B，只需要将节点 A 的 next 指向 B 就 ok 了。

### 查询

如果我想根据 ele 查询一个节点位置，那么需要怎么做呢：

```js
findIndex(ele){
  let current = this.head, index = 0
  while(current){
    if(ele === current.ele) return index
    index ++
    current = current.next
  }
  return -1
}
```

### 根据内容删除节点

```js
remove(ele){
  let index = this.findIndex(ele)
  this.removeAt(index)
}
```

### 判断链表是否有数据

```js
get isEmpty(){
  return this.head === null
}
```

### 获取链表长度

```js
get size(){
  return this.length
}
```

### 打印

最后一步就是打印列表数据

```js
print(){
  let current = this.head
  if(this.length === 0){
    console.log('链表为空')
  }
  while(current.next){
    console.log(current.ele)
    current = current.next
  }
}
```

### 整合

将上面所有方法整合起来就是一个完整的链表类了：

```js
class LinkedList {
  constructor() {
    this.head = null;
    this.length = 0;
  }

  // 添加
  addEnd(ele) {
    const node = new Node(ele);
    let current = null;
    if (this.head === null) {
      this.head = node;
      this.length++;
    } else {
      current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
      this.length++;
    }
  }

  // 插入
  insert(ele, position) {
    if (position >= 0 && position < this.length) {
      const node = new Node(ele);
      let current = this.head,
        previous = null,
        index = 0;
      if (position === 0) {
        this.head = node;
        node.next = current;
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }
        previous.next = node;
        node.next = current;
      }
      this.length++;
      return true;
    }
    return false;
  }

  // 根据位置删除
  removeAt(position) {
    if (position > -1 && position < this.length) {
      let current = this.head,
        previous = null,
        index = 0;
      if (position == 0) {
        this.head = current.next;
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }
        previous.next = current.next;
      }
      this.length--;
      return current.ele;
    }
    return null;
  }

  // 根据内容查找位置
  findIndex(ele) {
    let current = this.head,
      index = 0;
    while (current) {
      if (ele === current.ele) {
        return index + 1;
      }
      index++;
      current = current.next;
    }
    return -1;
  }

  // 根据内容删除
  remove(ele) {
    let index = this.findIndex(ele);
    this.removeAt(index);
  }

  // 是否为空
  isEmpty() {
    return this.head === null;
  }

  // 长度
  size() {
    return this.length;
  }

  // 打印链表内容
  print() {
    let current = this.head;
    if (this.length === 0) {
      console.log('链表为空');
    }
    while (current.next) {
      console.log(current.ele);
      current = current.next;
    }
  }
}
```

ok，一个完整的链表类出来了，比起栈，链表稍微复杂了一点，毕竟跟指针有关。c 语言中的指针可以形象的表现出来，在 js 中，指针已经被封装在最底层了，所以我们只能使用一个 next 属性模拟指针。  
**链表相比数组最重要的优点，那就是无需移动链表中的元素，就能轻松地添加和移除元素。因此，当你需要添加和移除很多元素时，最好的选择就是链表，而非数组。**
