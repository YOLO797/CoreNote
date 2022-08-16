---
title: UmiJS
order: 1

group:
  title: umi
  order: 33
---

# UmiJS

[UmiJS](https://umijs.org/) | [Github](https://github.com/umijs)

## 坎坷的开始

我从开始了解 umi 插件到研究到写的过程写成一本书的话就是《啊？啥？这？》。

首先，我是从看文档开始的，直接看的插件 api，大概扫了一眼，然后就没有然后了，一脸懵逼.png。接着打开 plugin-access 源码对照着 umi 官方文档插件导航看，一步一步看实现和参数，最后再看了一下文档的指南导航才发现偷偷摸摸的藏着 umi 插件的起步。

## plugin-access

plugin-access 插件是做项目路由权限配置的插件，根据项目中的 `src/access.ts` 文件配置进行权限管理，并且提供了**自定义 hook** `useAccess` 已经自定义权限组件 `Access`在代码中使用。

`plugin-access` 在项目中有 `src/access.ts` 并且文件里面有默认导出时启用，否则不启用。

直接翻源码：

### 写入文件

```js
// 获取src绝对路径
const srcDir = api.paths.absSrcPath;
// 获取src/access文件路径
const accessFilePath = api.utils.winPath(join(srcDir!, 'access'));
```

第一步是拼凑出来 src/access 的绝对路径以便接下来检验。接下来看其他代码：

```js
const ACCESS_DIR = 'plugin-access'; // plugin-access 插件创建临时文件的专有文件夹
if (checkIfHasDefaultExporting(accessFilePath)) {
  api.writeTmpFile({
    path: `${ACCESS_DIR}/context.ts`,
    content: getContextContent(),
  });

  api.writeTmpFile({
    path: `${ACCESS_DIR}/AccessProvider.ts`,
    content: getAccessProviderContent(api.utils),
  });

  api.writeTmpFile({
    path: `${ACCESS_DIR}/access.tsx`,
    content: getAccessContent(),
  });

  api.writeTmpFile({
    path: `${ACCESS_DIR}/rootContainer.ts`,
    content: getRootContainerContent(),
  });
}
```

上述代码是写入了四个临时文件，第一步的 `checkIfHasDefaultExporting` 方法是判断 access.ts 文件是否存在并且其中是否默认导出一个函数，如果没有就不执行了。

上面代码是在 `api.onGenerateFiles` 方法回调中使用，因为 `api.writeTmpFile` 方法不能在注册阶段使用，官方建议通常放在 `onGenerateFiles` 中使用，这样能在需要时重新生成临时文件。

写入的四个文件的作用是：
|写入文件|引入文件|作用|
|----|----|----|
|.umi/plugin-access/context.ts|./utils/getContextContent.ts|创建 access 的 context，以便跨组件传递 access 实例|
|.umi/plugin-access/AccessProvider.ts|./utils/getAccessProviderContent.ts|创建 AccessProvider，1. 生成 access 实例; 2. 遍历修改 routes; 3. 传给 context 的 Provider|
|.umi/plugin-access/access.tsx|./utils/getAccessContent.ts|创建 access 的 hook 并且导出，以及导出 Access 组件供代码使用|
|.umi/plugin-access/rootContainer.ts|./utils/getRootContainerContent.ts|生成 rootContainer 运行时配置(将上述的一些操作整合起来操作)|

### 生成 access context 实例

```js
export default function () {
  return `\
import React from 'react';
import accessFactory from '@/access';

export type AccessInstance = ReturnType<typeof accessFactory>;

const AccessContext = React.createContext<AccessInstance>(null!);

export default AccessContext;
`;
}
```

这是创建 access context 实例的文件，写入在 `src/.umi/plugin-access/context.ts` 文件。

### 创建 AccessProvider

```js
import { utils } from 'umi';
import { join } from 'path';

export default function (util) {
  return `\
import React, { useMemo } from 'react';
import { IRoute } from 'umi';
import { useModel } from '../core/umiExports';
import accessFactory from '../../access';
import AccessContext from './context';
import { traverseModifyRoutes } from '${util.winPath(
    join(__dirname, '..', 'utils', 'runtimeUtil'),
  )}';

const AccessProvider = props => {
  if (typeof useModel !== 'function') {
    throw new Error('[plugin-access]: useModel is not a function, @umijs/plugin-initial-state is needed.')
  }

  const { children } = props;
  const { initialState } = useModel('@@initialState');

  const access = useMemo(() => accessFactory(initialState), [initialState]);

  return React.createElement(
    AccessContext.Provider,
    { value: access },
    React.cloneElement(children, {
      ...children.props,
      routes:traverseModifyRoutes(props.routes, access)
    }),
  );
};

export default AccessProvider;
`;
}
```

上述代码是创建 `AccessProvider` ，生成 access 实例，并且通过 `traverseModifyRoutes` 方法对 routes 进行遍历修改，然后将 context 传递给 Provider。

### 创建 useAccess

```js
export default function () {
  return `\
import React, { useContext } from 'react';
import AccessContext from './context';

export const useAccess = () => {
  const access = useContext(AccessContext);
  return access;
};
export const Access = props => {
  const { accessible, fallback, children } = props;

  return <>{accessible ? children : fallback}</>;
};
`;
}
```

这个文件是创建自定义 hook `useAccess` 以及 `Access` 组件。

### 生成 rootContainer

```ts
export default function () {
  return `\
import React from 'react';
import AccessProvider from './AccessProvider';

export function rootContainer(container: React.ReactNode, { routes }) {
  return React.createElement(AccessProvider, { routes }, container);
}
`;
}
```

### 运行时配置

上述代码将需要用到的代码已经写到临时文件里面了，接下来就是需要运行这些文件来进行项目中配置。跟上面一样，也是需要检测文件中 `src/access.ts` 是否存在并且是否有默认导出，如果不是则不运行。

```ts
if (checkIfHasDefaultExporting(accessFilePath)) {
  // 增加 rootContainer 运行时配置
  api.addRuntimePlugin(() =>
    api.utils.winPath(join(umiTmpDir!, ACCESS_DIR, 'rootContainer.ts')),
  );
  // 将useAccess等添加到umi导出
  api.addUmiExports(() => [
    {
      exportAll: true,
      source: `../${ACCESS_DIR}/access`,
    },
  ]);
  // 添加文件改动监听
  api.addTmpGenerateWatcherPaths(() => [
    `${accessFilePath}.ts`,
    `${accessFilePath}.js`,
  ]);
}
```

上述代码在运行时 `plugin-access` 的处理文件。

`addRuntimePlugin` 方法是添加运行时插件，将 `rootContainer` 添加进去运行。

`addUmiExports` 引入了上面创建的 `access.ts` 的文件，将其中导出的 `useAccess` 和 `Access` 组件添加到 umi 导出。

`addTmpGenerateWatcherPaths` 添加了在临时文件重新生成时监听的文件路径，为 `src/access`。
