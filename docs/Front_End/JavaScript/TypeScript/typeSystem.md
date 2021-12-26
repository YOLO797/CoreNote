---
title: Typescript-类型系统
order: 2
---

## 基本注解

如前文中所举例，在类型注解中使用`let foo: Foo`这种语法。在类型声明空间中可用的任何内容都可以用作类型注解
如下例，使用了变量、函数参数以及函数返回值的类型注解

```typescript
const num: number = 123;
function fn(num: number): number {
  return num;
}
```

## 原始类型

js 中的原始类型也同样适用于 ts 的类型系统，比如：`string`、`number`、`boolean`等也可以作为类型注解

```typescript
let num: number;
let str: string;
let boo: boolean;

num = 123;
num = 1.23;
num = '123'; // Error

str = '123';
str = 123; // Error

boo = true;
boo = false;
boo = 'false'; // Error
```

## 数组

ts 为数组提供了专用的类型语法，使用后缀`[]`便可以根据需要补充有效的类型注解（如：`number[]`）。

```typescript
let numArr: number[];
numArr = [1, 2, 3];

numArr[0] = 5;
numArr[1] = 6;
numArr[2] = '7'; // Error
numArr = false; // Error
numArr = [1, 2, '3']; // Error
```

## 接口

接口是 ts 的核心知识之一，它能够合并众多类型至一个类型声明

```typescript
interface Name {
  a: string;
  b: number;
}
let name: Name;
name = {
  a: '1',
  b: 2,
};
name = {
  b: 1,
}; // Error: "a is missing"
name = {
  a: 1,
  b: 2,
}; // Error: "a is the wrong type"
```

在这里我们把类型注解`a: string`和`b: number`合并到一个新的类型注解``Name`中，这样可以强制对每一个成员进行类型检查。

## 内联类型注解

与创建一个接口不同，内敛注解语法可以注解任何内容

```typescript
let name: {
  a: string;
  b: number;
};
name = {
  a: '1',
  b: 2,
};
name = {
  b: 1,
}; // Error: "a is missing"
name = {
  a: 1,
  b: 2,
}; // Error: "a is the wrong type"
```

内敛类型能为你快速的提供一个类型注解，省去为类型取名的麻烦。然而在多次需要使用相同的内联注解时，可以考虑将其重构成为一个接口。

## 特殊类型

除了被提到的一些原始类型，在 ts 中还存在一些特殊类型，比如`any`、`null`、`undefined`以及`void`。

### any

`any`类型在 ts 类型系统中占有特殊的地位，它会将 ts 的类型检查关闭，在 ts 中 any 可以兼容所有的类型，因此所有类型都能赋值给它，它也可以被赋值给任何类型

```typescript
let power: any;

// 赋值任意类型
power = '123';
power = 123;

// 它也可以兼容任何类型
let num: number;
power = num;
num = power;
```

### null 和 undefined

在类型系统中，js 中的 null 和 undefined 字面量和其他被标注了`any`类型的变量一样，能被赋值给任意类型的变量

```typescript
let num: number;
let str: string;

num = null;
str = undefined;
```

### void

使用`:void`标识一个函数没有返回值

```typescript
function fn(num: number): void {
  console.log(num);
}
```

## 泛型

在计算机科学中，很多算法和数据结构并不依赖于对象的实际类型。但是仍然需要对每个变量提供强制约束。
比如：在一个函数中，它接受一个列表，并且返回这个列表的反向排序，这里的约束是指传入至函数的参数与函数的返回值

```typescript
function revers<T>(items: T[]): T[] {
  const res = [];
  for (let i = items.length - 1; i >= 0; i--) {
    res.push(items[i]);
  }
  return res;
}
const sample = [1, 2, 3];
let reversed = reverse(sample);

console.log(reversed); // 3, 2, 1

reversed[0] = '1'; // Error
reversed = ['1', '2']; // Error

reversed[0] = 1; // Ok
reversed = [1, 2]; // Ok
```

在上面的例子中，函数`reverse`接受一个类型为`T`的数组`(items: T[])`，返回值为类型 T 的一个数组，函数`reverse`的返回值类型与它接受的参数的类型一样。当传入`const sample = [1, 2, 3]`的时候，ts 能推断出来`reverse`为`number[]`类型，从而能给你类型安全。同理，传入一个类型为`string[]`类型的数组时，ts 也会推断`reverse`为`string[]`类型。

## 联合类型

在 js 中，可能会遇到希望一个值为多种类型之一，ts 的联合类型就解决了这个问题

```typescript
function fn(r: number | string) {
  let line = '';
  if (typeof r === 'number') line = r.toString();
  else line = r.trim();
}
```

## 交叉类型

在 js 中，`extends`是一种非常常见的模式，在这种模式中，可以从两个对象中创建一个新对象，新对象拥有着两个对象所有的功能。交叉类型可以安全的使用这个模式

```typescript
function extend<T extends object, U extends object>(
  first: T,
  second: U,
): T & U {
  const res = <T & U>{};
  for (let id in first) (<T>res)[id] = first[id];
  for (let id in second) (<U>res)[id] = second[id];
  return res;
}
const x = extend({ a: 1 }, { b: 's' });

// 现在 x 拥有了 a 和 b 属性
const a = x.a;
const b = x.b;
```

## 元组类型

js 不支持元组，但是 ts 支持，可以使用`:[type1, type2]`的形式为元组添加类型注解

```typescript
let arr: [string, number];
arr = ['1', 2]; // Ok
arr = [1, '2']; // Error
```

## 字面量类型

字面量就是提供的一个准确变量，比如

```typescript
let foo: 'Hello';
type Type = 'North' | 'East' | 'South' | 'West';
```

## 类型别名

ts 提供了为类型注解设置别名的便捷语法，可以使用`type SomeType = OtherType`来创建别名

```typescript
type StrOrNum = string | number;
let sample: StrOrNum;
sample = 123;
sample = '123';
sample = true; // Error
```

与接口不同，可以为任意的类型注解提供类型别名

```typescript
type Text = string | { text: string };
type NumArr = [number, number];
type Callback = (data: string) => void;
```

**type 不能使用`implement`和`extends`**
