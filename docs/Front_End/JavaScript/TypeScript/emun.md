---
title: Typescript-枚举
order: 3
---

## 定义

枚举是组织收集有关变量的一种方式，下面是定义一个 ts 枚举类型的方式

```typescript
enum Color {
  Red, // 0
  Blue, // 1
  Black, // 2
}

// 简单的使用枚举类型
let red: Color = Color.Red; // 0

// 类型安全
red = '123'; // Error: string 不能赋值给 Color 类型
```

## 数字类型枚举与数字类型

数字类型枚举允许将数字类型或者其他任何与数字类型兼容的类型赋值给枚举类型的实例

```typescript
enum Color {
  Red, // 0
  Blue, // 1
  Black, // 2
}
let red: Color = Color.Red; // 0
red = 0; // Ok
```

## 改变与数字枚举关联的数组

默认情况下，第一个枚举值是 0，每个后续值一次递增 1，但是可以通过特定的赋值来改变给任何枚举成员关联的数字

```typescript
enum Color {
  Red, // 0
  Blue, // 1
  Black, // 2
}

enum Man {
  Name, // 0
  Age = 2, // 2
  Height, // 3
}
```

## 字符串枚举

在上文中使用了数字枚举类型，实际上枚举类型的值也可以是字符串类型。这样可以更容易被处理和调试，因为它们提供有意义、可调试的字符串

```typescript
enum EvidenceTypeEnum {
  UNKNOWN = '',
  PASSPORT_VISA = 'passport_visa',
  PASSPORT = 'passport',
  SIGHTED_STUDENT_CARD = 'sighted_tertiary_edu_id',
  SIGHTED_KEYPASS_CARD = 'sighted_keypass_card',
  SIGHTED_PROOF_OF_AGE_CARD = 'sighted_proof_of_age_card',
}

const value = someStringFromBackend as EvidenceTypeEnum;

if (value === EvidenceTypeEnum.PASSPORT) {
  console.log('You provided a passport');
  console.log(value); // `passport`
}
```
