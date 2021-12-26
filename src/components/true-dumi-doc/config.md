---
title: 配置项&frontMatter
order: 4
---

# 配置项

在项目根目录创建 `.umirc.ts` 或 `config/config.ts` 文件，都可对 dumi 进行配置：

```ts
// 配置文件
export default {
  // 具体配置项
};
```

目前 dumi 支持以下配置项。

## 基础配置

### algolia

- 类型: `Object`
- 默认值：`null`
- 详细：

配置 Algolia 的 [DocSearch](https://docsearch.algolia.com/) 服务，通常你会需要启用 sitemap.xml 的自动生成，以便顺利接入 Algolia，参考 [配置项 - sitemap](#sitemap)。

示例：

```js
{
  algolia: {
    apiKey: 'yourapikey',
    indexName: 'dumi',
  }
}
```

### description

- 类型：`String`
- 默认值：`null`
- 详细：

配置文档的介绍，会显示在侧边栏菜单标题的下方，仅 `doc` 模式下可用。

### logo

- 类型：`String`
- 默认值：Umi 的 LOGO
- 详细：

配置文档的 LOGO。

> 如果是使用本地图片，比如：`/public/images/xxx.png`，那么配置 `/images/xx.png` 引入即可。

### locales

- 类型：`Array<[String, String]>`
- 默认值：`[['en-US', 'English'], ['zh-CN', '中文']]`
- 详细：

该配置为二维数组，第一项配置会作为站点默认的 locale。

每一项配置是一个长度为 2 的数组，数组的第一个值代表该 locale 的 name，会用于拼接路由前缀和检测文件名属于什么 locale，第二个值代表该 locale 的 label，会用作语言切换时的选项显示。

默认 locale 的文件名后缀是可选的，比如，在默认配置下，`index.md` 和 `index.en-US.md` 等价。

### mode

- 类型：`doc | site`
- 默认值：`doc`
- 详细：

用于设定文档的展现模式，默认为文档模式，配置为 `site` 时可无缝切换为站点模式。如果希望对导航菜单项展示的文本和顺序，可参考 frontmatter 配置中的 `nav` 配置项。

两种模式的效果如下，文档模式：

![](https://gw.alipayobjects.com/zos/bmw-prod/86ddc125-75e0-49e0-920b-f9497e806cf1/k7iyfr0t_w2600_h1754.png)

站点模式：

![](https://gw.alipayobjects.com/zos/bmw-prod/7ce6770d-df19-48fa-853e-64cbbf41b762/k7iyfarw_w2600_h1754.png)

### menus

- 类型：`Object`
- 默认值：`自动生成的菜单`
- 详细：

该配置项用于自定义侧边菜单的展示，目前仅 `site` 模式下可用，分多语言模式和单语言模式，使用方式：

```ts
// config/config.ts 或 .umirc.ts
export default {
  menus: {
    // 需要自定义侧边菜单的路径，没有配置的路径还是会使用自动生成的配置
    '/guide': [
      {
        title: '菜单项',
        path: '菜单路由（可选）',
        children: [
          // 菜单子项（可选）
          'guide/index.md', // 对应的 Markdown 文件，路径是相对于 resolve.includes 目录识别的
        ],
      },
    ],
    // 如果该路径有其他语言，需在前面加上语言前缀，需与 locales 配置中的路径一致
    '/zh-CN/guide': [
      // 省略，配置同上
    ],
  },
};
```

### navs

- 类型：`Object | Array`
- 默认值：`自动生成的导航`
- 详细：

该配置项用于自定义导航栏的展示，仅 `site` 模式下可用，分多语言模式和单语言模式，使用方式：

```ts
// config/config.ts 或 .umirc.ts
export default {
  // 单语言配置方式如下
  navs: [
    null, // null 值代表保留约定式生成的导航，只做增量配置
    {
      title: 'GitHub',
      path: 'https://github.com/umijs/dumi',
    },
    {
      title: '我有二级导航',
      path: '链接是可选的',
      // 可通过如下形式嵌套二级导航菜单，目前暂不支持更多层级嵌套：
      children: [
        { title: '第一项', path: 'https://d.umijs.org' },
        { title: '第二项', path: '/guide' },
      ],
    },
  ],

  // 多语言配置方式如下
  navs: {
    // 多语言 key 值需与 locales 配置中的 key 一致
    'en-US': [
      null, // null 值代表保留约定式生成的导航，只做增量配置
      {
        title: 'GitHub',
        path: 'https://github.com/umijs/dumi',
      },
    ],
    'zh-CN': [
      null, // null 值代表保留约定式生成的导航，只做增量配置
      {
        title: 'GitHub',
        path: 'https://github.com/umijs/dumi',
      },
    ],
  },
};
```

### resolve

`resolve` 是一个 `Object` 类型，用于配置 dumi 的解析行为，包含如下配置：

#### includes

- 类型：`Array<String>`
- 默认值：`['docs', 'src']` or `['docs', 'packages/pkg/src']`
- 详细：

配置 dumi 嗅探的文档目录，dumi 会尝试在配置的目录中递归寻找 markdown 文件，默认值为 `docs` 目录、`src` 目录（普通项目），如果环境为 lerna 项目，则 `src` 目录变为 `packages/pkg/src` 目录，通常不需要配置，除非自动嗅探出现了『误伤』。

#### previewLangs

- 类型：`Array<String>`
- 默认值：`['jsx', 'tsx']`
- 详细：

配置 dumi 默认会转换为 ReactComponent 组件渲染的代码块，如果不希望做任何转换，例如类似 Umi 官网的纯站点，那么将该项设置为空数组即可。

#### passivePreview

- 类型：`Boolean`
- 默认值：`false`
- 详细：

代码块被动渲染模式，当为 true 时，仅将属于 `resolve.previewLangs` 且具有 `preview` 修饰符的代码块渲染为 ReactComponent 代码块。一般用于仅希望渲染 `resolve.previewLangs` 中的少部分代码块，而不是全部。

### sitemap

- Type: `{ hostname: string, excludes?: string[] }`
- Default: `null`

启用 `sitemap.xml` 自动生成特性。`hostname` 配置项用来指定 URL 的域名前缀，`excludes` 配置项用来忽略某些不需要包含在 sitemap 中的路由。

### title

- 类型：`String`
- 默认值：`{package.name}`
- 详细：

配置文档的名称，导航栏或侧边栏上。

### themeConfig

- 类型：`Object`
- 默认值：`{}`
- 详细：

用于配置当前使用的主题包，具体配置项取决于主题包提供哪些配置，可访问 [主题列表](/zh-CN/theme) 查看目前可用的主题。

## [更多配置](https://d.umijs.org/zh-CN/config#%E6%9B%B4%E5%A4%9A%E9%85%8D%E7%BD%AE)

<!-- 以下是 Umi 配置项，由 scripts/sync-from-umi.js 从 Umi 仓库同步及过滤 -->

<!-- <embed src="../.upstream/config.md"></embed> -->

# FrontMatter

FrontMatter 是指**文件最顶部**对正文进行配置的部分，在 dumi 中，FrontMatter 均以 YAML 语法进行编写；除了 Markdown 文件，dumi 也支持在 demo 中配置用于 demo 展示的 FrontMatter，来看两个范例：

在 Markdown 文件中编写 FrontMatter：

<pre lang="md">---
title: 标题内容
---
</pre>

在 demo 中编写 FrontMatter：

<pre lang="js">
/**
 * title: 标题内容
 */
</pre>

无论是代码块的形式还是外部 demo，均支持 FrontMatter，外部 demo 不仅支持在源代码中进行配置，也可以给 `code` 标签添加属性进行配置，比如：

```html
<code src="/path/to/demo.tsx" title="这样也可以配置 demo 标题"></code>
```

## Markdown 配置项

### title

- 类型：`String`
- 默认值：正文第一个标题
- 详细：

用于配置该页面的标题，将会被用作该页面标题的子标题以及左侧菜单。

### sidemenu

- 类型：`Boolean`
- 默认值：`true`
- 详细：

控制侧边栏菜单的显示或隐藏。

### toc

- 类型：`false | 'content' | 'menu'`
- 默认值：`'content'`
- 详细：

控制锚点目录的显示或位置，值为 `false` 时不展示，值为 `content` 时展示在内容区域的右侧（Affix Menu），值为 `menu` 时会将**当前路由的锚点目录**展示在左侧菜单中。

### order

- 类型：`Number`
- 默认值：`null`
- 详细：

控制该文档的显示顺序，数值越小排序越靠前。

### legacy

- 类型：`String`
- 默认值：`null`
- 详细：

指定该文档的旧路径（从根路径开始指定），避免从其他文档迁移到 dumi 后原路径访问 `404`。

### group

- 类型：`Object`
- 默认值：`null`
- 详细：

该配置用于对当前页面进行分组，这样可以在侧边栏菜单进行分组显示，我们可以通过下方三项 FrontMatter 配置项显示地对 `group` 进行配置，也可以基于 dumi 的文件夹嵌套来自动生成 group，例如：

```
.
└── src/
    ├── components/
        ├── index.md
        ├── a.md
        ├── b.md
```

dumi 会自动为 `index.md`、`a.md`、`b.md` 指定 `group.title` 为 `Components`、`group.path` 为 `/components`。并且我们可以通过 FrontMatter 对生成的默认配置进行**选择性复写**，比如：

```yaml
---
group:
  title: 组件
---
```

则最终生成的 `group.path` 还是 `/components`，但 `group.title` 则变成了 `组件`。

#### group.title

- 类型：`String`
- 详细：

用于配置侧边栏菜单中该组别的菜单项名称，如果未配置则会默认读取 `group.path` 并转换为 `title`，例如将 `/components` 转换为 `Components`。

#### group.path

- 类型：`String`
- 详细：

**必选**，配置该组别的路由前缀，当 `location.pathname` 匹配到该前缀时，菜单组会进行 active 标记。

#### group.order

- 类型：`Number`
- 默认值：`null`
- 详细：

控制该文档组的显示顺序，数值越小排序越靠前。

### nav

- 类型：`Object`
- 默认值：`null`
- 详细：

**仅 site 模式下可用**，该配置用于手动指定当前文档所处的导航菜单，默认根据第一级路由路径自动生成，子配置项与 `group` 一致。

#### nav.title

略，与 `group.title` 一致。

#### nav.path

略，与 `group.path` 一致。

#### nav.order

略，与 `group.order` 一致。

### hero

- 类型：`Object`
- 默认值：`null`
- 详细：

在 site 模式下可用，配置 hero 后，该页面将会以首页形式呈现。

#### hero.image

- 类型：`String`
- 默认值：`null`
- 详细：

配置首页首屏区域的标题配图。

#### hero.title

- 类型：`String`
- 默认值：`null`
- 详细：

配置首页首屏区域的大标题。

#### hero.desc

- 类型：`String`
- 默认值：`null`
- 详细：

配置首页首屏区域的简介文字。

#### hero.actions

- 类型：`Array`
- 默认值：`null`
- 详细：

配置首页首屏区域的操作按钮，第一个按钮会作为主按钮展示，配置格式如下：

```yaml
hero:
  actions:
    - text: Getting Started
      link: /getting-started
```

### features

- 类型：`Object`
- 默认值：`null`
- 详细：

在 site 模式下可用，配置后该页面将会以首页形式呈现，用于每行 3 个的形式展示组件库的特性，配置格式如下：

```yaml
features:
  - icon: 图标的 URL 地址，建议切图尺寸为 144 * 144（可选）
    title: 性能强大
    link: 可为标题配置超链接
    desc: 可以配置 `markdown` 文本
```

### footer

- 类型：`Markdown`
- 默认值：`null`
- 详细：

配置当前页面的 footer 区域，建议首页做配置即可，目前暂不支持统一对所有页面进行配置。

### translateHelp

- 类型：`Boolean | String`
- 默认值：`false`
- 详细：

是否在该页面顶部展示『帮助翻译』的提示框。当设置 `String` 类型时，会自定义提示语内容。

### hide <Badge>1.1.0+</Badge>

- 类型：`Boolean`
- 默认值：`false`
- 详细：

如果你暂时不希望在生产环境的站点中展示某些文档，可以打开这个配置临时隐藏它，该配置不会影响开发环境的渲染。

## demo 配置项

### title

- 类型：`String`
- 默认值：`null`
- 详细：

用于配置该外部 Demo 的标题，配置后会在 Demo 预览器中显示。

### desc

- 类型：`Markdown`
- 默认值：`null`
- 详细：

用于配置该外部 Demo 的简介，配置后会在 Demo 预览器中显示，支持 Markdown 语法。

### compact

- 类型：`Boolean`
- 默认值：`false`
- 详细：

用于去除 demo 渲染容器的内边距。

### background

- 类型：`CSSPropertyValue`
- 默认值：`null`
- 详细：

用于设置 demo 渲染容器的背景色。

### inline

- 类型：`Boolean`
- 默认值：`false`
- 详细：

用于指示该 demo 为自由 demo，将会直接在文档中嵌入渲染，不会被 demo 容器包裹，用户也无法查看源代码。

### transform

- 类型：`Boolean`
- 默认值：`false`
- 详细：

用于控制 demo 的包裹容器是否设置 `transform` 的 CSS 值以控制 `position: fixed;` 的元素相对于 demo 容器定位。

### defaultShowCode

- 类型：`Boolean`
- 默认值：`false`
- 详细：

用于控制当前 demo 的包裹容器是否默认展开源代码显示。

### debug <Badge>1.1.0+</Badge>

- 类型：`Boolean`
- 默认值：`false`
- 详细：

标记当前 demo 为调试 demo，这意味着在生产模式下该 demo 是不可见的；另外，调试 demo 在开发环境下也会展示一个 `DEV ONLY` 的标记，以便开发者将其和其他 demo 区分开来。

### hideActions

- 类型：`Array<'CSB' | 'EXTERNAL'>`
- 默认值：`[]`
- 详细：

用于控制 Demo 预览器部分功能按钮的隐藏，配置值含义如下：

- CSB: 隐藏『在 codesandbox.io 中打开』的按钮
- EXTERNAL: 隐藏『在新窗口打开』的按钮

通过 code 标签的属性配置：

```html
<!-- 注意，单引号为必备，要确保值为有效 JSON 字符串 -->
<code hideActions='["CSB"]' />
```

通过 frontmatter 配置：

```ts
/**
 * hideActions: ["CSB"]
 * hideActions:
 *   - CSB
 */

// 以上两种方式均可识别
```

### iframe <Badge>1.1.0+</Badge>

- 类型：`Boolean | Number`
- 默认值：`false`
- 详细：

使用 iframe 模式渲染当前 demo，对于渲染 layout 型的 demo 非常有用，当我们传递数值时可以控制 iframe 的高度，访问 [iframe 模式](/zh-CN/guide/basic#iframe-模式) 了解更多。

### demoUrl <Badge>1.1.1+</Badge>

- 类型：`String`
- 默认值：dumi 自动生成的 demo 独立访问链接
- 详细：

用于指定该 demo 的访问链接，通常在 dumi 默认渲染的 demo 无法满足展示需要时使用，例如需要呈现 ReactNative 的渲染结果。

在默认主题时，仅在 `iframe` 呈现模式下才会生效；在移动端研发主题中，会作为右侧手机预览框中的 demo 渲染链接。
