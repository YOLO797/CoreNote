---
title: 组件构建进阶
order: 2
---

# 老实人写组件 <span style="color: blue">——> 官方魔改进阶篇</span>

## 1.多语言

让文档站点变成多语言这件事，对 dumi 用户来说是开箱即用的。比如我们使用英文编写了 `docs/index.md` 作为站点的首页，现在希望增加站点的中文版本，只需要创建一个带 `zh-CN` locale 后缀的同名 Markdown 文件即可：

<Tree>
  <ul>
    <li>
      docs
      <ul>
        <li>
          index.md
          <small>已有的英文版首页</small>
        </li>
        <li>
          index.zh-CN.md
          <small>新创建的中文版首页</small>
        </li>
      </ul>
    </li>
  </ul>
</Tree>

这样一来，当用户访问 `www.example.com` 时 dumi 会渲染英文版首页，访问 `www.example.com/zh-CN` 时 dumi 会渲染中文版首页，对于其他页面也是一样的，就像你正在浏览的 dumi 的官网一样。

### 默认语言

在 dumi 的默认配置中，`en-US` 是默认语言，`zh-CN` 是第二种语言，如果你需要修改这个配置，比如修改默认语言、或者添加更多语言，请查看 [配置项 - locales](/zh-CN/config#locales) 配置项。

### 翻译缺失

文档的翻译工作通常都是渐进式进行的，势必会存在『文档翻译到一半』的过渡期，为了让这个过渡期更加友好，**dumi 会将默认语言的文档作为未翻译语言的兜底文档**，举个例子：

很显然 `missing.zh-CN.md` 是缺失的，用户在访问 `www.example.com/zh-CN/missing` 时，dumi 会把 `missing.md` 的内容呈现给用户。

## 2.组件 API 自动生成

现在，我们可以通过 JS Doc 注解 + TypeScript 类型定义的方式实现组件 API 的自动生成了！

### 组件源码中的类型和注解

组件 API 自动生成的前提是，确保 dumi 能够通过 TypeScript 类型定义 + 注解推导出 API 的内容，例如 `Hello` 组件的源代码：

```tsx | pure
import React from 'react';

export interface IHelloProps {
  /**
   * 可以这样写属性描述
   * @description       也可以显式加上描述名
   * @description.zh-CN 还支持不同的 locale 后缀来实现多语言描述
   * @default           支持定义默认值
   */
  className?: string; // 支持识别 TypeScript 可选类型为非必选属性
}

const Hello: React.FC<IHelloProps> = () => <>Hello World!</>;

export default Hello;
```

dumi 背后的类型解析工具是 `react-docgen-typescript`，更多类型和注解的用法可参考 [它的文档](https://github.com/styleguidist/react-docgen-typescript#example)。

### 在文档中展示 API

有了能够推导 API 的源代码，我们就可以在 Markdown 中通过 `API` 内置组件来渲染 API 表格：

```md
<!-- 不传递 src 将自动探测当前组件，比如 src/Hello/index.md 将会识别 src/Hello/index.tsx -->

<API></API>

<!-- 传递 src 将显式指明渲染哪个组件的 API -->

<API src="/path/to/your/component.tsx"></API>

<!-- 传递 exports 将显式指明渲染哪些导出，请确保值为合法的 JSON 字符串 -->

<API exports='["default", "Other"]'></API>
```

<span style="color: blue;font-weight: 800">效果大致如下：</span>

在当前目录下建了个 api.tsx 作为示例，并`外部引入`组件

```markdown
<code src="./api.tsx"></code>
```

---

<code src="./api.tsx"></code>

---

<Alert type="info">
markdown中把 code 标签 改为 API 即可显示出根据ts自动生成API的表格,如下所示：
</Alert>

---

```markdown
<API src="./api.tsx"></API>
```

<API src="./api.tsx"></API>

### 自定义 API 表格渲染

和其他内置组件一样，`API` 组件也支持通过 theme API 进行复写，只需要创建 `.dumi/theme/builtins/API.tsx`（本地主题）或者创建一个包含 `API.tsx` 的主题包，结合 `dumi/theme` 暴露的 `useApiData` hook，即可自行控制 API 表格的渲染，可参考 dumi 默认主题的 [API 组件实现](https://github.com/umijs/dumi/blob/master/packages/theme-default/src/builtins/API.tsx)。
