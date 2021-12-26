---
title: 组件示例之 Button 按钮
---

## 按钮组件<Badge>之组件文档</Badge>

### 按钮类型

按钮分为五种类型`type`，默认是`default`。

`default` | `primary` | `info` | `warning` | `danger`

```jsx
/**
 * transform: true
 * background: '#f6f7f9'
 * compact: false
 * title: 按钮组件
 * desc: 封装了个超级简单的btn组件，支持如上5种不同样式的类型
 */
import React from 'react';
import Button from './button';

const demo_style = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
};
export default () => (
  <div style={demo_style}>
    <Button className="default">默认按钮</Button>
    <Button className="primary">主按钮</Button>
    <Button className="info">提示按钮</Button>
    <Button className="warning">告警按钮</Button>
    <Button className="danger">危险按钮</Button>
  </div>
);
```
