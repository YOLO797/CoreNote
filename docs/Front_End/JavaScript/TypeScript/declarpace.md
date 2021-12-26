---
title: Typescript-声明空间
order: 1

group:
  title: Typescript
  order: 13
---

## 类型声明空间

类型声明空间包含用来当做类型注解的内容，并且可以将其作为类型注解使用

```typescript
class Foo {}
interface Bar {}
type Bas = {};

let foo: Foo;
let bar: Bar;
let bas: Bas;
```

**注意：`interface`定义的值不可以作为变量使用，因为其没有定义在变量声明空间中**

```typescript
interface Bar {}
const bar = Bar; // Error: "cannot find name 'Bar'"
```

## 变量命名空间

变量命名空间包含可用作变量的内容

```typescript
class Foo {}
const foo = foo;
const otherFoo = 123;
```

**`interface`定义的值不可以作为变量使用，同理，`var`声明的变量也只能在变量声明空间使用，不能作为类型注解**

```typescript
const foo = 123;
let bar: foo; // Error: "cannot finr name 'foo'"
```
