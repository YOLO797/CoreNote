---
title: Typescript-练习题
order: 5
---

## 青铜

### 0. 泛型 in React, 实现 Antd Button 类型提示的组件

```typescript
// 1. 函数式
const MyButton = () => {}
// 2. class
class MyButton extends React.Component {
}

// 期望值
const btn = <Button type="primary">
// -----------------------^^^^^^^---
// 这里出提示 primary | default | link
```

答案：

```typescript
type MyButtonType = {
  type: 'primary' | 'default' | 'link';
};
const MyButton: React.FC<MyButtonType> = () => {};
class MyButton extends React.Component<MyButtonType> {}
```

### 1. 写出 TreeNode 的类型

```typescript
type TreeNode = /** 补全 */
const tree: TreeNode[] = [
  {
    key: 1,
    value: 1,
    title: '标题1',
    children: [
      {
        key: 11,
        value: 11,
        title: '标题11',
        children: [
          {
            key: 111,
            value: 111,
            title: '标题111',
          }
        ]
      }
    ],
  },
  {
    key: 2,
    value: 2,
    title: '标题2',
  },
]
```

答案：

```typescript
type TreeNode = {
  key: number;
  value: number;
  title: string;
  children: TreeNode[];
};
```

### 2. 将 Object key 值转换为联合类型

```typescript
const obj = {
  a: 1,
  b: 2,
  c: 3
}
type Keys = /** 补全 **/
// 期望值
Keys === 'a' | 'b' | 'c'
```

答案：

```typescript
type Keys = keyof type obj
```

### 3. 先将必填属性转换为非必填属性, 再把非必填转为必填

```typescript
const obj = {
  a: 1,
  b: 2,
  c: 3
};
type TObj = typeof obj;
type ParticalTObj = /** 补全 **/
// 期望值
// ParticalTObj = { a?: number, b?: number, c?: number }

type RequiredParticalTObj = /** 补全 **/
// 期望值
// RequiredParticalTObj = { a: number, b: number, c: number }
```

答案：

```typescript
// 第一种方式
type ParticalTObj = { [P in keyof TObj]?: TObj[P] };
type RequiredParticalTObj = { [P in keyof TObj]-?: TObj[P] };

// 第二种方式，使用内置类型
type ParticalTObj = Partial<TObj>;
type RequiredParticalTObj = Required<TObj>;
```

## 白银

### 0. echo 函数泛型

```typescript
const echo = (x) => x; // 显式补充
// 期望值
typeof echo('x'); // string
typeof echo(1); // number
// 实际上, 在非any严格模式下, 直接这么写就是可以成立的
// 这也是 ts 智能推断的一个体现
// 考察点在如何显示的写出对应的类型
```

答案：

```typescript
const echo = <T extends any>(x: T) => x;
```

### 1. 形参泛型

```typescript
const fun = <T extends Object>(x: T, y: string /** 限制为 x 的 key值 */) => {
  return x[y];
};
// 期望值, 一阶段, 入参类型提示
fun({ a: '', b: 2 }, '这里能提示出来 a|b');
// 期望值, 二阶段, 返回值类型根据 key 值确定
typeof fun({ a: '', b: 2 }, 'a'); // string
typeof fun({ a: '', b: 2 }, 'b'); // number
```

答案：

```typescript
const fun = <T extends Object, K extends keyof T>(x: T, y: K) => {
  return x[y];
};
```

### 2. class 泛型写法

```typescript
class Data {
  // T 是泛型
  data: T[];
}

// 期望值
const d = new Data<string>();
// 泛型的应用&ts只能推断的一个体现, 在 forEach 中
d.data.forEach((item) => {
  typeof item; // string
});
```

答案：

```typescript
class Data<T> {
  data: T[];
}
```

## 黄金

### 0. 获取 数组中 item 的类型

```typescript
type PickArrayItems<T> = /** 补全 **/

// 效果
const arr = [1, 2, 3];

type X = PickArrayItems<typeof arr>
// 期望值
// X === number
```

答案：

```typescript
type PickArrayItems<T extends Array<any>> = T extends Array<infer J>
  ? J
  : never;
```

### 1. 获取 Promise.then 的类型

```typescript
type PickPromise<T> = /** 补全 **/

// 效果
const getP = () => Promise.resolve('i am type string');

type X = PickPromise<typeof getP>
// 期望值
// X === string;
```

答案：

```typescript
type PickPromise<T extends () => Promise<any>> = T extends () => Promise<
  infer J
>
  ? J
  : never;
```

### 2. 获取 函数式组件的 Props 类型

```typescript
type PickProps<T> = // 填充
const Button = (props: {a: string, b: number}) => {
  return <div></div>
}

// 期望值
type TProps = PickProps<typeof Button>; // { a: string, b: number }
```

答案：

```typescript
type PickProps<T extends any> = T extends (props: infer JSXP) => JSX.Element
  ? JSXP
  : never;
```

### 3. 获取 class 组件的 Props 类型

```typescript
type PickProps<T> = // 填充
class Button extends React.Component<{a: string, b: number}> {}
// 期望值
type TProps = PickProps<typeof Button>; // { a: string, b: number }
```

答案：

```typescript
type PickProps<T extends any> = T extends React.ClassType<
  infer CLASSP,
  infer N1,
  infer N2
>
  ? CLASSP
  : never;
```
