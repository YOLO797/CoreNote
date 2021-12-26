---
title: theme开发基础
order: 3
---

# 老实人写主题 <span style="color: blue">——> 官方魔改主题篇</span>

开发 dumi 主题非常容易

<Alert type="info">
<span style="font-weight: 800">老实人吐槽</span>：
可不兴乱说，容易个屁，上来它官方文档就整个了 <span style="color: blue">Tree</span> 组件, 
你要是从基础篇直接抄文档，绝壁一脸懵逼，会有疑问：`这个Tree标签是那来的`？那是antd集成进来的
</Alert>

## 1.引入 UI 库作为补丁：

所以写主题，先从官方引入的 `ant design` 库 和 `补丁` 说起：

- 安装 antd

  ```bush
  npm install antd --save
  ```

- 安装 babel-plugin-import

  ```bush
  npm install babel-plugin-import -save
  ```

- 配置文件写入以下:
  ```js
  // 找到 .umirc.ts 文件或创建 ./config/config.js 配置文件 （项目默认是走 .umirc.ts）写入以下配置项
  export default defineConfig({
      ...
      extraBabelPlugins: [
          [
          'import',
          {
              libraryName: 'antd',
              libraryDirectory: 'es',
              style: 'css',
          },
          ],
      ],
      ...
  });
  ```
- 然后见如下[主题开发](/components/theme#2主题开发：)部分

---

## 2.主题开发：

为了应对不同的场景，dumi 提供了两种主题开发方式：

1. 在 dumi 项目根目录创建 `.dumi/theme` 文件夹，通常用于项目中的特殊自定义，<span style="color: blue">官方 Tree 组件用的就是这个方式</span>
2. 创建 `@group/dumi-theme-` 或 `dumi-theme-` 开头的 npm 包 ，通常用于研发完整的主题包，便于共享给其他项目使用

这两种方式之间并无隔阂，这意味着我们初期可以先走第一种方式调试主题包，待主题包稳定后单独发一个 npm 包即可。

### 目录结构

先来看一下标准的 dumi 主题包结构：

<Tree title=".dumi/theme（本地主题）或 dumi-theme-[name]/src（npm 主题包）">
  <ul>
    <li>
      builtins
      <small>内置组件文件夹，dumi 会寻找<strong>一级目录</strong>下的 <code>j|tsx</code> 进行挂载，该文件夹下的组件可直接在 md 中使用</small>
    </li>
    <li>
      components
      <small>[非约定] 主题包自身为了可维护性抽取出来的组件，文件夹名称随开发者自定义</small>
    </li>
    <li>
      style
      <small>[非约定] 主题包的样式表</small>
    </li>
    <li>
      layout.tsx
      <small>自定义的 layout 组件，props.children 即每个 md 的内容，开发者可自行控制导航、侧边栏及内容渲染</small>
    </li>
    <li>
      layouts
      <small>自定义的 layouts 目录，在需要自定义多个 layout 时使用</small>
      <ul>
        <li>
          index.tsx
          <small>等同于 src/layout.tsx，两种方式二选一，layout.tsx 优先级更高</small>
        </li>
        <li>
          demo.tsx
          <small>自定义组件 demo 单独路由（~demos/:uuid）的 layout</small>
        </li>
      </ul>
    </li>
  </ul>
</Tree>

### Tree 组件

<Alert type="info">
<span style="font-weight: 800">老实人备注</span>：
上文和之前markdown中的这个目录，就是按照如下方式构建的
</Alert>

1. 先创建 `.dumi/theme/builtins` 文件夹<span style="color: blue">（builtins 是官方默认的可在 md 使用的补丁）</span>

2. 添加 Tree.tsx/Tree.less 这两个文件

   <span style="color: blue">如下示例即可看源码，照抄就完事了</span>：
   <code src="../../../.dumi/theme/builtins/index.tsx"> </code>

## 3.增量自定义

目录结构看起来并不简单？其实上述所有内容都可以增量自定义，如果某个必要文件该主题包没有提供，则会兜底到 dumi 的默认主题，会进行兜底的文件如下：

1. `builtins/Previewer.tsx` - 渲染 demo 包裹器
2. `builtins/SourceCode.tsx` - 渲染代码块并高亮
3. `builtins/Alert.tsx` - 渲染提示框
4. `builtins/Badge.tsx` - 渲染标签
5. `layout.tsx` - 默认的全局 layout

## 4.自定义正文区域

如果只希望控制正文区域的渲染，可以选择包裹默认主题的 `layout`、控制 `layout` 的 `children` 来实现。例如，给正文区域增加一个反馈按钮：

```tsx | pure
// .dumi/theme/layout.tsx(本地主题) 或 src/layout.tsx(主题包)
import React from 'react';
import Layout from 'dumi-theme-default/src/layout';

export default ({ children, ...props }) => (
  <Layout {...props}>
    <>
      <button>反馈</button>
      {children}
    </>
  </Layout>
);
```

## 5.开发、调试及使用

所谓的主题开发，本质上还是写 React 组件，但为了降低写组件的成本，dumi 提供了一套主题 API、开放了许多 dumi 内置的能力和数据，可以帮我们快速完成主题的开发，详见 [主题 - 主题 API](/zh-CN/theme/api)。

主题开发的过程中需要不断调试。对于本地主题而言，dumi 是完全自动检测的，只要存在 `.dumi/theme` 文件夹，dumi 就会在构建时进行挂载；对于独立的主题 npm 包而言，需要将其写入 `devDependencies`，并且将该 npm 包 link 到项目下，dumi 将会自动挂载该主题，例如：

```json
{
  "dependencies": {
    "dumi-theme-default": "0.0.0"
  }
}
```

- 本地主题：使用和调试是类似的
- npm 包：用户只需要执行 `npm install dumi-theme-[name] -D` 即可完成主题包的安装，启动 dumi 时主题将会被自动挂载

## 6.主题 API

为了便于自定义主题，dumi 提供了一套主题 API，我们可以从 `dumi/theme` 中 import 出以下内容。

### context

可获取到 dumi 的配置项、当前路由的 meta 信息、国际化语言选择项等等，context 的详细定义可 <a target="_blank" href="https://github.com/umijs/dumi/blob/master/packages/preset-dumi/src/theme/context.ts#L8">查看源代码</a>

### Link

包装后的 umi `Link`，可渲染外链，自动加上外部链接图标。

### NavLink

包装后的 umi `NavLink`，可渲染外链，自动加上外部链接图标。

### AnchorLink

包装后的 umi `NavLink`，用于带锚点的链接，且可高亮。

### useCodeSandbox

- **参数：**
  - opts：`Object`。主题 `Previewer` 组件接收到的 props
  - api：`String`。CodeSandbox 创建 demo 时调用的 API 地址，默认值为`https://codesandbox.io/api/v1/sandboxes/define`
- **返回：** `Function`。在 CodeSandbox.io 打开 demo 的执行函数

根据 `Previewer` 的 props 生成一个函数，执行后可在 [codesandbox.io](https://codesandbox.io) 打开该 demo，例如：

```jsx | pure
// builtins/Previewer.tsx
import React from 'react';
import { useCodeSandbox } from 'dumi/theme';

export default (props) => {
  const openCSB = useCodeSandbox(props);

  return <button onClick={openCSB}>点我会在 CodeSandbox.io 上打开 demo</button>;
};
```

### useCopy

- **参数：** 无
- **返回：**
  - copyCode：`Function`。拷贝执行函数，执行时传入的文本会被拷贝到剪贴板
  - copyStatus：`'ready' | 'copied'`。默认值为 `ready`，在执行拷贝后会变成 `copied`，2s 后再变回 `ready`，便于开发者控制复制成功的提示信息

提供复制函数及复制的状态，便于实现源代码复制和状态展示，例如：

```jsx | pure
// builtins/Previewer.tsx
import React from 'react';
import { useCopy } from 'dumi/theme';

export default (props) => {
  const [copyCode, copyStatus] = useCopy();

  return <button onClick={() => copyCode('Hello')}>点我会复制文字</button>;
};
```

### useSearch

- **参数：** `String`。当前输入框的关键字
- **返回：**
  - `Function`。如果用户开启 algolia，则返回 algolia 的绑定函数，将输入框的 CSS 选择器传入即可，后续筛选、呈现工作全部交给 algolia
  - `Array`。如果用户未开启 algolia，则返回基于关键字的内置搜索结果，目前只能搜索标题

根据配置自动提供 algolia 的绑定函数或者根据关键字返回内置搜索的检索结果，具体用法可参考 dumi 内置主题的 [SearchBar 组件](https://github.com/umijs/dumi/blob/master/packages/theme-default/src/components/SearchBar.tsx#L9)。

### useLocaleProps

- **参数：**
  - locale：`String`。当前 locale 值
  - props：`Object`。需要过滤、转换的 props
- **返回：** `Object`。过滤、转换之后的 props

根据 locale 自动过滤、转换 props，便于实现国际化 FrontMatter 的定义，比如 `title.zh-CN` 在中文语言下会被转换为 `title`，具体示例可参考 dumi 内置主题的 [Previewer 组件](https://github.com/umijs/dumi/blob/master/packages/theme-default/src/builtins/Previewer.tsx#L72)。

### useDemoUrl

- **参数：** `String`。主题 `Previewer` 组件接收到的 `identifier` 参数，demo 的唯一标识符
- **返回：** `String`。demo 单独打开的页面地址

获取单独打开 demo 的页面地址，例如 `useDemoUrl(props.identifier)` 会返回类似 `http://example.com/~demos/demo-id` 的 URL。

### useApiData

- **参数：** `String`。主题 `API` 组件接收到的 `identifier` 参数，API 的唯一标识符
- **返回：** `Array`。Props 属性列表

获取指定组件的 API 元数据，可参考 dumi 默认主题的 [API 组件实现](https://github.com/umijs/dumi/blob/master/packages/theme-default/src/builtins/API.tsx)。

### useTSPlaygroundUrl

- **参数：**
  - locale：`String`。当前的语言选项
  - code：`String`。要在 TypeScript Playground 中转换的 TSX 代码
- **返回：** `String`。前往 TypeScript Playground 的 url

获取当前 TypeScript 官网 Playground 的链接，用于将 TSX 代码提交到 Playground 中展示 JSX 代码。

### usePrefersColor

- **参数：** 无
- **返回：**
  - color: `'light' | 'dark' | 'auto'`。当前的 color 值
  - setColor: `(color: 'light' | 'dark' | 'auto') => void`。设置当前 color 的函数，设置为 `auto` 时意味着跟随操作系统的偏好设置

当我们需要为主题增加暗黑/明亮模式的切换能力时，需要用到该 API。

对于开发者而言：

- 可以通过 `[data-prefers-color=dark]` 的属性选择器，在主题 Less 中增量编写暗黑模式的样式，例如

```less
.navbar {
  /* 明亮样式 */
}
[data-prefers-color='dark'] .navbar {
  /* 暗黑样式 */
}

// 或者
.navbar {
  /* 明亮样式 */
  [data-prefers-color='dark'] & {
    /* 暗黑样式 */
  }
}
```

- 可以通过该 hook，可以拿到当前色彩偏好的值以及切换函数，以便为用户提供开关来切换暗黑/明亮模式，例如：

```tsx | pure
import React from 'react';
import { usePrefersColor } from 'dumi/theme';

export default (props) => {
  const [color, setColor] = usePrefersColor();

  return (
    <>
      <button onClick={() => setColor('auto')}>启用自动主题色</button>
      当前主题色配置为：{color}
    </>
  );
};
```

更多信息可参考 [#543](https://github.com/umijs/dumi/pull/543)。
