---
title: Typescript-内置类型
order: 4
---

## Partial<T>

将类型 T 的所有属性标记为可选属性

```typescript
interface Man {
  name: string;
  age: number;
}
type NewMan = Partial<Man>;
const man: NewMan = {
  name: 'ycz',
}; // Ok
```

## Required<T>

将类型 T 的所有属性标记为必选属性

```typescript
interface Man {
  name?: string;
  age?: number;
}
type NewMan = Required<Man>;
const man: NewMan = {
  name: 'ycz',
}; // Error
```

## Readonly<T>

将类型 T 的所有属性标记为 readonly，不可修改

```typescript
type Readony<T> = {
  readonly [P in keyof T]: T[P];
};
```

## Pick<T, K>

从 T 中过滤出属性 K

```typescript
interface AccountInfo {
  name: string;
  email: string;
  age: number;
  vip?: 0 | 1; // 1 是vip ，0 是非vip
}

type CoreInfo = Pick<AccountInfo, 'name' | 'email'>;
/* 
{ 
  name: string
  email: stirng
}
*/
```

## Record<K, T>

标记对象的 key value 类型

```typescript
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

使用场景:

```typescript
// 定义 学号(key)-账号信息(value) 的对象
const accountMap: Record<number, AccountInfo> = {
  10001: {
    name: 'xx',
    email: 'xxxxx',
    // ...
  },
};
const user: Record<'name' | 'email', string> = {
  name: '',
  email: '',
};
// 复杂点的类型推断
function mapObject<K extends string | number, T, U>(
  obj: Record<K, T>,
  f: (x: T) => U,
): Record<K, U>;

const names = { foo: 'hello', bar: 'world', baz: 'bye' };
// 此处推断 K, T 值为 string , U 为 number
const lengths = mapObject(names, (s) => s.length); // { foo: number, bar: number, baz: number }
```
