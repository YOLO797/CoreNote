---
title: 优先队列
order: 3
---

## 什么是优先队列

正常队列只能满足正常需求，比如人家是 vip 大会员呢，人家肯定不能跟一群普通人一起去排队吧，不能从最后面插入，这样 vip 特权将没有任何意义，所以就出来一个优先队列，接下来学习一下。

## 优先队列

**在优先队列中，元素被赋予优先级。当访问元素时，具有最高优先级的元素最先删除。优先队列具有最高级先出的行为特征。**

### 创建类

```js
class PriorityQueue {
  constructor() {
    this.items = [];
  }
}
```

### 插入

优先队列的特点就是优先，所以我们在入队列的时候需要多添加一个参数：`优先级`。优先队列相比于普通队列的唯一的不同就在于入队列的时候有一个优先级的判断，其他操作都跟普通队列操作相同。

```js
enqueue(node, priority){
  priority = priority || 99999999999
  const queueNode = { node, priority }
  if (this.isEmpty) { // 这里的判断是否为空还是使用普通队列的方法就ok
    this.items.push(queueNode)
  }
  else{
    // 在队列中找到要插入的位置，优先级数越小，优先级越高
    const preIndex = this.items.findIndex(item => queueNode.priority < item.priority)
    if(preIndex>-1){
      this.items.splice(preIndex, 0, queueNode)
    }
    else{  // preIndex为-1的时候说明没有找到比添加的新节点的优先级低的，直接插入最后面
      this.items.push(queueNode)
    }
  }
}
```

然后再将普通队列的其他方法拿过来直接用，一个优先队列类就完成了。
