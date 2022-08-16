---
title: Service
order: 3
---

## Service 的功能

umi 的微内核最最最核心的就是这个 Service 类，其他都是基于其进行的相关的拓展与融合。

## 文件目录

|    文件名    |               作用               |          备注           |
| :----------: | :------------------------------: | :---------------------: |
|  Service.ts  | 提供整个核心服务类，用于导出服务 |        核心配置         |
| getPaths.ts  |    获取文件绝对路径的核心方法    |        文件路径         |
| PluginAPI.ts |      插件的注册及接入核心类      |        插件注册         |
|   types.ts   |              固定值              | ts 定义的一些接口和类型 |
|   enums.ts   |              固定值              |          枚举           |

## Service.ts

Service.ts 文件中主要定义一个 `Servive` 类，来看一下这个类的主要内容，首先看一下这个类的基础属性和方法定义：

```ts
class Service extends EventEmitter {
  cwd: string; // 当前路径
  pkg: IPackage; // 当前项目的 package.json
  skipPluginIds: Set<string> = new Set<string>(); // 跳过的插件
  stage: ServiceStage = ServiceStage.uninitialized; // Service 运行阶段
  // 注册命令
  commands: {
    [name: string]: ICommand | string;
  } = {};
  // 解析完的插件
  plugins: {
    [id: string]: IPlugin;
  } = {};
  // 插件的方法
  pluginMethods: {
    [name: string]: Function;
  } = {};
  // 来自arguments、config、process.env和package.json的初始预设和插件
  initialPresets: IPreset[];
  initialPlugins: IPlugin[];
  // 用于注册的预设和插件
  _extraPresets: IPreset[] = [];
  _extraPlugins: IPlugin[] = [];

  userConfig: IConfig; // 纯用户配置，就是 .umirc 或 config/config 里的内容，没有经过 defaultConfig 以及插件的任何处理。
  configInstance: Config;
  config: IConfig | null = null; // 用户配置
  babelRegister: BabelRegister; // babel寄存器
  // hooks函数处理
  hooksByPluginId: {
    [id: string]: IHook[];
  } = {};
  hooks: {
    [key: string]: IHook[];
  } = {};
  // 相关路径
  paths: {
    cwd?: string; // 当前路径
    absNodeModulesPath?: string; // node_modules 目录绝对路径
    absSrcPath?: string; // src 目录绝对路径
    absPagesPath?: string; // pages 目录绝对路径
    absOutputPath?: string; // 输出路径，默认是 ./dist
    absTmpPath?: string; // .umi临时目录绝对路径
  } = {};
  // process.env.NODE_ENV
  env: string | undefined;
  // 为 api.applyPlugins() 提供 type 参数的类型
  ApplyPluginsType = ApplyPluginsType;
  // 插件的启用方式
  EnableBy = EnableBy;
  // 为 api.describe() 提供 config.onChange 的类型
  ConfigChangeType = ConfigChangeType;
  // stage 的枚举类型
  ServiceStage = ServiceStage;
  // 命令行参数
  args: any;

  constructor(opts: IServiceOpts) {}

  // 设置生命周期（service的运行阶段）
  setStage(stage: ServiceStage) {}

  // 解析package.json的文件
  resolvePackage() {}

  // 加载环境
  loadEnv() {}

  // 真正的初始化方法
  async init() {}

  // 初始化插件
  async initPresetsAndPlugins() {}

  // 获取一个插件的api
  getPluginAPI(opts: any) {}

  // 执行一个api
  async applyAPI(opts: { apply: Function; api: PluginAPI }) {}

  // 初始化预设
  async initPreset(preset: IPreset) {}

  // 初始化插件
  async initPlugin(plugin: IPlugin) {}

  // 判断用户是否开启该插件
  getPluginOptsWithKey(key: string) {}

  // 注册插件
  registerPlugin(plugin: IPlugin) {}

  // 判断插件是否需要使用
  isPluginEnable(pluginId: string) {}

  // 判断是否有插件
  hasPlugins(pluginIds: string[]) {}

  // 判断是否有预设
  hasPresets(presetIds: string[]) {}

  // 真正的插件执行函数，基于promise实现
  async applyPlugins(opts: {
    key: string;
    type: ApplyPluginsType;
    initialValue?: any;
    args?: any;
  }) {}

  // 运行方法
  async run({ name, args = {} }: { name: string; args?: any }) {}

  // 运行命令
  async runCommand({ name, args = {} }: { name: string; args?: any }) {}
}
```

上面的基础属性和方法大概瞜一眼是干嘛的，接下来逐个来分析方法的实现。

### EventEmitter

node 环境 `events` 模块提供的对象: `events.EventEmitter` ，其核心就是事件触发和事件监听器功能的封装。**Service 类就是继承 EventEmitter 的**。

### constructor

```ts
function constructor(opts: IServiceOpts) {
  super();

  this.cwd = opts.cwd || process.cwd();
  // 仓库根目录，antd pro构建的时候需要一个新的空文件夹
  this.pkg = opts.pkg || this.resolvePackage();
  this.env = opts.env || process.env.NODE_ENV;

  // 做一个当前路径不存在的断言
  assert(existsSync(this.cwd), `cwd ${this.cwd} does not exist.`);

  // 在配置解析之前注册babel
  this.babelRegister = new BabelRegister();

  // 加载环境变量
  this.loadEnv();

  // 获取用户配置
  const configFiles = opts.configFiles;
  this.configInstance = new Config({
    cwd: this.cwd,
    service: this,
    localConfig: this.env === 'development',
    configFiles:
      Array.isArray(configFiles) && !!configFiles[0] ? configFiles : undefined,
  });
  // 从.umirc.ts中获取内容
  this.userConfig = this.configInstance.getUserConfig();

  // 获取导出的配置
  this.paths = getPaths({
    cwd: this.cwd,
    config: this.userConfig!,
    env: this.env,
  });

  // 初始化插件
  const baseOpts = {
    pkg: this.pkg,
    cwd: this.cwd,
  };
  // 初始化预设
  this.initialPresets = resolvePresets({
    ...baseOpts,
    presets: opts.presets || [],
    userConfigPresets: this.userConfig.presets || [],
  });
  // 初始化插件
  this.initialPlugins = resolvePlugins({
    ...baseOpts,
    plugins: opts.plugins || [],
    userConfigPlugins: this.userConfig.plugins || [],
  });
  // 初始化配置及插件放入babel注册中
  this.babelRegister.setOnlyMap({
    key: 'initialPlugins',
    value: lodash.uniq([
      ...this.initialPresets.map(({ path }) => path),
      ...this.initialPlugins.map(({ path }) => path),
    ]),
  });
}
```

`construtor`是 `Service` 类的初始化，将 `.umirc.ts` 和 `config/config.ts` 文件引入做了基础配置，将 所有的 `preset` 和 `plugin` 引入初始化存入在一个队列中供后续操作。  
可能影响阅读的几个方法功能如下：
|方法名|功能|
|:----:|:----:|
|existsSync|判断一个文件是否存在|
|BabelRegister|获取 babel 寄存器用以之后 babel 解析|
|resolvePresets|遍历查找所有的 preset|
|resolvePlugins|遍历查找所有的 plugin|

### setStage

`setStage` 是用来记录当前 Service 的运行状态的，在整个生命周期中，每次状态修改都会触发，用以在开发过程中随时查询当前的状态。

```ts
function setStage(stage: ServiceStage) {
  this.stage = stage;
}
```

就很简单的一个赋值，没什么可以研究的。

### resolvePackage

`resolvePackage` 方法是用来解析 package.json 的。

```ts
function resolvePackage() {
  try {
    return require(join(this.cwd, 'package.json'));
  } catch (e) {
    return {};
  }
}
```

### loadEnv

`loadEnv` 方法是用来加载环境变量的。

```ts
loadEnv() {
  const basePath = join(this.cwd, '.env');
  const localPath = `${basePath}.local`;
  loadDotEnv(localPath);
  loadDotEnv(basePath);
}
```

上面代码中的 `basePath` 是根目录下的 `.env` 文件，`localPath` 是根目录下的 `.env.local` 文件，`loadDotEnv` 方法是将这两个文件进行一个判断是否存在，如果存在就把里面的配置*写入* `process`中。

### getPluginAPI

`getPluginAPI` 方法是获取一个 `plugin` 的所有 api。

```ts
function getPluginAPI(opts: any) {
  const pluginAPI = new PluginAPI(opts);
  // 注册内置方法
  [
    'onPluginReady',
    'modifyPaths',
    'onStart',
    'modifyDefaultConfig',
    'modifyConfig',
  ].forEach((name) => {
    pluginAPI.registerMethod({ name, exitsError: false });
  });
  return new Proxy(pluginAPI, {
    get: (target, prop: string) => {
      // 由于 pluginMethods 需要在 register 阶段可用
      // 必须通过 proxy 的方式动态获取最新，以实现边注册边使用的效果
      if (this.pluginMethods[prop]) return this.pluginMethods[prop];
      if (
        [
          'applyPlugins',
          'ApplyPluginsType',
          'EnableBy',
          'ConfigChangeType',
          'babelRegister',
          'stage',
          'ServiceStage',
          'paths',
          'cwd',
          'pkg',
          'userConfig',
          'config',
          'env',
          'args',
          'hasPlugins',
          'hasPresets',
        ].includes(prop)
      ) {
        return typeof this[prop] === 'function'
          ? this[prop].bind(this)
          : this[prop];
      }
      return target[prop];
    },
  });
}
```

`PluginAPI` 是一个类，提供了很多 api，其中 `pluginAPI.registerMethod` 就是用来注册内置方法的，接受三个参数：`name`、`exitsError`、`fn`，其中 `exitsError` 和 `fn` 为可选，其中 `name` 是作为插件方法的一个*id*使用，`fn`是作为回调 hook 使用，如果没有传入`fn`则会生成默认的 hook 方法，`exitsError`是如果 `Service` 实例的 `pluginMethods` 中已经有了 `name` 对应的 hook 方法并且 `exitsError` 值为 `true` 的时候 _throw_ 一个 _ERROR_ 出来。

`getPluginAPI` 返回的是一个使用 `Proxy` 代理过的对象，因为 `pluginMethods` 需要在 `register` 阶段使用，必须通过 `proxy` 的方式动态获取，这样子在 `get` 的时候就能根据当前状态返回相应的值，就能实现边注册边使用的效果。

`Proxy` 代理的对象在获取一个值的时候，会做一次验证，共有三种状态：

- 如果当前 `pluginMethods` 有我所需求的 `key` 对应的值，则直接返回该 `hook` 方法。
- 如果我获取的 `key` 存在上面那个长长的数组中，那么根据 `Service实例` 的对应属性的类型返回相应的值。
- 如果上述条件都没有满足，直接返回 `pluginAPI`。

### registerPlugin

`registerPlugin` 方法是注册一个插件的功能。

```ts
registerPlugin(plugin: IPlugin) {
  if (this.plugins[plugin.id]) {
    const name = plugin.isPreset ? 'preset' : 'plugin';
    throw new Error(`\
${name} ${plugin.id} is already registered by ${this.plugins[plugin.id].path}, \
${name} from ${plugin.path} register failed.`);
  }
  this.plugins[plugin.id] = plugin;
}
代码很简单，先做一个判断，之后插入到 `this.plugins` 中，这个判断其实也没太大必要，因为在初始化 `pluginAPI` 的时候，其 `describe` 方法已经判断过一次了。
```

### initPreset

`initPreset` 方法是用来初始化预设的。

```ts
async function initPreset(preset: IPreset) {
  const { id, key, apply } = preset;
  preset.isPreset = true;
  const api = this.getPluginAPI({ id, key, service: this });
  // 在apply之前注册组件
  this.registerPlugin(preset);
  // 获取插件返回值
  const { presets, plugins, ...defaultConfigs } = await this.applyAPI({
    api,
    apply,
  });
  // 注册额外的预设和插件
  if (presets) {
    assert(
      Array.isArray(presets),
      `presets returned from preset ${id} must be Array.`,
    );
    // 插到最前面，下个 while 循环优先执行
    this._extraPresets.splice(
      0,
      0,
      ...presets.map((path: string) => {
        return pathToObj({
          type: PluginType.preset,
          path,
          cwd: this.cwd,
        });
      }),
    );
  }

  // 深度优先 将所有的额外预设处理完
  const extraPresets = lodash.clone(this._extraPresets);
  this._extraPresets = [];
  while (extraPresets.length) await this.initPreset(extraPresets.shift()!);

  // 将所有额外插件插入到 this._extraPlugins 下一步进行插件注册
  if (plugins) {
    assert(
      Array.isArray(plugins),
      `plugins returned from preset ${id} must be Array.`,
    );
    this._extraPlugins.push(
      ...plugins.map((path: string) => {
        return pathToObj({
          type: PluginType.plugin,
          path,
          cwd: this.cwd,
        });
      }),
    );
  }
}
```

上面的代码看起来比较混乱，其实逻辑很简单，一步一步来看：

1. `preset.isPreset = true` 设置这个插件是 `preset` 类型。
2. `this.getPluginAPI({ id, key, service: this })` 获取当前插件的所有 api。
3. `this.registerPlugin(preset)` 注册插件，在运行插件 api 之前。
4. `this.applyAPI({ api, apply })` 运行插件 api，并且返回该插件集内部所有插件，包括`presets`、`plugins`、`...defaultConfigs`，其中 `defaultConfigs` 目前没有使用，估计是作者预留的 todo。
5. 接下来判断是否有返回的 `presets`，如果有就插入到 `this._extraPresets` 中。
6. 然后做一个循环，将 `this._extraPresets` 中的所有 `preset` 都在进行一次 `initPresets` 操作，将所有的 `preset` 都注册一遍。
7. 最后判断时候有返回的 `plugins`，如果有，就将它们插入到 `this._extraPlugins` 中，以供后续操作。

### applyAPI

`applyAPI` 方法是执行一个 api 返回其返回值，_api 就是`getPluginAPI`方法返回的实例_。

```ts
async function applyAPI(opts: { apply: Function; api: PluginAPI }) {
  let ret = opts.apply()(opts.api);
  if (isPromise(ret)) {
    ret = await ret;
  }
  return ret || {};
}
```

上面很简单，就是执行了 `plugin` 的 `apply` 方法之后返回的方法传入 `plugin` 的 `api`，根据是否是 _Promise_ 类型返回一个值。

**这里已经将 api 执行了，返回值根据需要选择是否使用**

### initPlugin

`initPlugin` 方法是初始化一个插件 _（非`preset`类型的）_。

```ts
async function initPlugin(plugin: IPlugin) {
  const { id, key, apply } = plugin;
  const api = this.getPluginAPI({ id, key, service: this });
  this.registerPlugin(plugin);
  await this.applyAPI({ api, apply });
}
```

整个流程很简单，就是获取 `api` 实例，然后注册插件，最后将 `api` 在插件的 `apply` 方法中执行插入到插件中。

### initPresetsAndPlugins

`initPresetsAndPlugins` 方法是初始化所有插件。

```ts
async function initPresetsAndPlugins() {
  this.setStage(ServiceStage.initPresets);
  this._extraPlugins = [];
  while (this.initialPresets.length) {
    await this.initPreset(this.initialPresets.shift()!);
  }

  this.setStage(ServiceStage.initPlugins);
  this._extraPlugins.push(...this.initialPlugins);
  while (this._extraPlugins.length) {
    await this.initPlugin(this._extraPlugins.shift()!);
  }
}
```

代码很简单，整个流程如下：

1. 首先设置 `Service状态` 为*初始化插件集*。
2. 将 `this._extraPlugins` 清空，以便初始化 `preset` 的时候将暴露出来的 `plugins` 插入。
3. 遍历 `this.initialPresets` 初始化 `preset`。
4. 设置 `Service状态` 为*初始化插件*。
5. 遍历 `this._extraPlugins` 初始化所有 `plugin`。

### getPluginOptsWithKey

`getPluginOptsWithKey` 方法是用来判断一个插件在用户设置里面的启用状态 _（在 `umirc.ts` 或者 `config/config.ts` 里面设置为 false 的则不启用）_。

```ts
function getPluginOptsWithKey(key: string) {
  return getUserConfigWithKey({
    key,
    userConfig: this.userConfig,
  });
}
```

`getUserConfigWithKey` 方法是判断在用户设置里面 `key` 的值是否为 true。

### isPluginEnable

`isPluginEnable` 判断一个插件是否需要启用。

```ts
function isPluginEnable(pluginId: string) {
  // api.skipPlugins() 的插件（不需要注册的插件）
  if (this.skipPluginIds.has(pluginId)) return false;
  const { key, enableBy } = this.plugins[pluginId];
  // 手动设置为 false
  if (this.userConfig[key] === false) return false;
  // 配置开启
  if (enableBy === this.EnableBy.config && !(key in this.userConfig))
    return false;
  // 函数自定义开启
  if (typeof enableBy === 'function') return enableBy();
  // 注册开启
  return true;
}
```

### hasPlugins

`hasPlugins` 用来判断是否有这个插件 _（非 preset）_。

```ts
function hasPlugins(pluginIds: string[]) {
  return pluginIds.every((pluginId) => {
    const plugin = this.plugins[pluginId];
    return plugin && !plugin.isPreset && this.isPluginEnable(pluginId);
  });
}
```

### hasPresets

`hasPresets` 用来判断是否有这个插件集 _（非 plugin）_。

```ts
hasPresets(presetIds: string[]) {
  return presetIds.every((presetId) => {
    const preset = this.plugins[presetId];
    return preset && preset.isPreset && this.isPluginEnable(presetId);
  });
}
```

### applyPlugins

`applyPlugins` 是插件执行方法，基于 Promise 实现。

```ts
async function applyPlugins(opts: {
  key: string;
  type: ApplyPluginsType;
  initialValue?: any;
  args?: any;
}) {
  const hooks = this.hooks[opts.key] || [];
  switch (opts.type) {
    case ApplyPluginsType.add:
      if ('initialValue' in opts)
        assert(
          Array.isArray(opts.initialValue),
          `applyPlugins failed, opts.initialValue must be Array if opts.type is add.`,
        );
      const tAdd = new AsyncSeriesWaterfallHook(['memo']);
      for (const hook of hooks) {
        if (!this.isPluginEnable(hook.pluginId!)) continue;
        tAdd.tapPromise(
          {
            name: hook.pluginId!,
            stage: hook.stage || 0,
            // @ts-ignore
            before: hook.before,
          },
          async (memo: any[]) => {
            const items = await hook.fn(opts.args);
            return memo.concat(items);
          },
        );
      }
      return await tAdd.promise(opts.initialValue || []);
    case ApplyPluginsType.modify:
      const tModify = new AsyncSeriesWaterfallHook(['memo']);
      for (const hook of hooks) {
        if (!this.isPluginEnable(hook.pluginId!)) {
          continue;
        }
        tModify.tapPromise(
          {
            name: hook.pluginId!,
            stage: hook.stage || 0,
            // @ts-ignore
            before: hook.before,
          },
          async (memo: any) => {
            return await hook.fn(memo, opts.args);
          },
        );
      }
      return await tModify.promise(opts.initialValue);
    case ApplyPluginsType.event:
      const tEvent = new AsyncSeriesWaterfallHook(['_']);
      for (const hook of hooks) {
        if (!this.isPluginEnable(hook.pluginId!)) {
          continue;
        }
        tEvent.tapPromise(
          {
            name: hook.pluginId!,
            stage: hook.stage || 0,
            // @ts-ignore
            before: hook.before,
          },
          async () => {
            await hook.fn(opts.args);
          },
        );
      }
      return await tEvent.promise();
    default:
      throw new Error(
        `applyPlugin failed, type is not defined or is not matched, got ${opts.type}.`,
      );
  }
}
```

根据 `key` 去获取相应的 `hook` 并执行。

### init

`init` 方法是真正的初始化整个 `Service` 的方法。

```ts
async function init() {
  this.setStage(ServiceStage.init);
  // 初始化插件
  await this.initPresetsAndPlugins();
  // 设置状态为初始
  this.setStage(ServiceStage.initHooks);
  // 注册了plugin要执行的钩子方法
  Object.keys(this.hooksByPluginId).forEach((id) => {
    const hooks = this.hooksByPluginId[id];
    hooks.forEach((hook) => {
      const { key } = hook;
      hook.pluginId = id;
      this.hooks[key] = (this.hooks[key] || []).concat(hook);
    });
  });
  // 状态：插件已注册
  this.setStage(ServiceStage.pluginReady);
  // 执行插件
  await this.applyPlugins({
    key: 'onPluginReady',
    type: ApplyPluginsType.event,
  });
  // 状态：获取配置信息
  this.setStage(ServiceStage.getConfig);
  // 拿到对应插件的默认配置信息
  const defaultConfig = await this.applyPlugins({
    key: 'modifyDefaultConfig',
    type: this.ApplyPluginsType.modify,
    initialValue: await this.configInstance.getDefaultConfig(),
  });
  // 将实例中的配置信息对应修改的配置信息
  this.config = await this.applyPlugins({
    key: 'modifyConfig',
    type: this.ApplyPluginsType.modify,
    initialValue: this.configInstance.getConfig({
      defaultConfig,
    }) as any,
  });

  // 状态：合并路径
  this.setStage(ServiceStage.getPaths);

  if (this.config!.outputPath) {
    this.paths.absOutputPath = join(this.cwd, this.config!.outputPath);
  }
  // 修改路径对象
  const paths = (await this.applyPlugins({
    key: 'modifyPaths',
    type: ApplyPluginsType.modify,
    initialValue: this.paths,
  })) as object;
  Object.keys(paths).forEach((key) => {
    this.paths[key] = paths[key];
  });
}
```

将用户配置以及插件修改的配置一起处理完成。

### runCommand

`runCommand` 是运行命令方法。

```ts
async function runCommand({ name, args = {} }: { name: string; args?: any }) {
  assert(this.stage >= ServiceStage.init, `service is not initialized.`);
  args._ = args._ || [];
  if (args._[0] === name) args._.shift();
  const command =
    typeof this.commands[name] === 'string'
      ? this.commands[this.commands[name] as string]
      : this.commands[name];
  assert(command, `run command failed, command ${name} does not exists.`);
  const { fn } = command as ICommand;
  return fn({ args });
}
```

根据 `name` 查找已经注册的命令进行执行。

### run

`run` 是整个 `Service` 的启动方法，Service 优先执行 `run`。

```ts
async function run({ name, args = {} }: { name: string; args?: any }) {
  args._ = args._ || [];
  if (args._[0] === name) args._.shift();
  this.args = args;
  await this.init();
  // 状态：运行
  this.setStage(ServiceStage.run);
  await this.applyPlugins({
    key: 'onStart',
    type: ApplyPluginsType.event,
    args: {
      name,
      args,
    },
  });
  return this.runCommand({ name, args });
}
```

### 总结

整个 `Service` 类的代码就是这样子，然后整体运行顺序是：

```ts
// 1
const service = new Service();
// 2
service.run();
// 3
service.init();
// 4
service.initPlugins();
/*
  在这一步又有很多其他步骤
*/
// 4.1
service.initPresets();
// 4.2
service.initPlugins();
// 4.3
service.Hooks();
// 4.4
pluginReady;
// 4.5
service.getConfig();
// 4.6
service.getPaths();
// 4.7
service.initPlugins();
// 5
service.runCommand();
```

## getPaths.ts

整个 `getPaths.ts` 文件下只有三个方法定义，分别是：

- _isDirectoryAndExist_: 用来判断一个路径是否存在，且路径文件是否是一个目录。
- _normalizeWithWinPath_: 对所有路径进行遍历统一处理，处理成兼容 windows 的路径。
- _getServicePaths_: 默认导出的方法，是获取所有需要使用的路径的方法。
  分别来看看三个方法的代码：

### isDirectoryAndExist

```ts
function isDirectoryAndExist(path: string) {
  return existsSync(path) && statSync(path).isDirectory();
}
```

`existsSync` 和 `statSync` 都是 `node` 的 `fs` 模块的方法，分别是用来*判断路径文件是否存在*和*路径文件是否是一个目录*。

### normalizeWithWinPath

```ts
function normalizeWithWinPath<T extends Record<any, string>>(obj: T) {
  return lodash.mapValues(obj, (value) => winPath(value));
}
```

`winPath` 是 umi 自定义的方法，是对一个绝对路径进行 windows 兼容处理。

### getServicePaths

```ts
function getServicePaths({
  cwd,
  config,
  env,
}: {
  cwd: string;
  config: any;
  env?: string;
}): IServicePaths {
  let absSrcPath = cwd;
  if (isDirectoryAndExist(join(cwd, 'src'))) {
    absSrcPath = join(cwd, 'src');
  }
  const absPagesPath = config.singular
    ? join(absSrcPath, 'page')
    : join(absSrcPath, 'pages');

  const tmpDir = ['.umi', env !== 'development' && env]
    .filter(Boolean)
    .join('-');
  return normalizeWithWinPath({
    cwd,
    absNodeModulesPath: join(cwd, 'node_modules'),
    absOutputPath: join(cwd, config.outputPath || './dist'),
    absSrcPath,
    absPagesPath,
    absTmpPath: join(absSrcPath, tmpDir),
  });
}
```

代码很简单，按步骤分析：

1. 设置 `absSrcPath` 的值为 `cwd`，也就是根目录，如果根目录有 `src` 文件夹则将 `absSrcPath` 的值改为 `src` 文件夹的绝对路径。
2. 设置 `absPagesPath` 的值为根目录下的 `page` 或者 `pages` 文件夹的绝对路径。
3. 设置 `tmpDir` 是 `.umi` 临时文件夹的名称。
4. 导出所有需要供外部使用的路径。

## PluginAPI.ts

`PluginAPI.ts` 是提供*插件的注册及接入核心类*的文件，前文 `Service` 类中在注册插件的时候使用 `const pluginAPI = new PluginAPI(opts)` 这行代码注册了一个插件，整个`PluginAPI` 类就是枚举了一个插件的所有 api。

### 基本属性

`PluginAPI` 类的基础属性和方法比较简单，先看看基础属性以及其基本作用：
|属性名称|作用|
|:----:|:----:|
|id|需要实例化插件的 id|
|key|需要实例化插件的 key|
|service|上文中 `Service` 类的实例|
|Html|todo: 暂时不知道干嘛的|
|utils|umi 提供的一些对外 api|
|logger|主要做打印的一个对象|

属性就这些，然后就是所有方法的学习：

### describe

`describe` 方法是将一个需要注册的组件的属性绑定在 `PluginAPI` 实例的属性上以供后续操作。

```ts
function describe({ id, key, config, enableBy }) {
  const { plugins } = this.service;
  if (id && this.id !== id) {
    // 判断当前插件是否已经注册
    if (plugins[id]) {
      const name = plugins[id].isPreset ? 'preset' : 'plugin';
      throw new Error(
        `api.describe() failed, ${name} ${id} is already registered by ${plugins[id].path}.`,
      );
    }
    plugins[id] = plugins[this.id];
    plugins[id].id = id;
    delete plugins[this.id];
    this.id = id;
  }
  if (key && this.key !== key) {
    this.key = key;
    plugins[this.id].key = key;
  }
  if (config) plugins[this.id].config = config;
  plugins[this.id].enableBy = enableBy || EnableBy.register;
}
```

代码很简单，就是判断当前绑定的 `id` 和 `key` 是否是传入的插件，如果不是，就将传入插件的 `id` 和 `key` 复制给 `this`。

### register

注册插件的方法。

```ts
function register(hook: IHook) {
  assert(
    hook.key && typeof hook.key === 'string',
    `api.register() failed, hook.key must supplied and should be string, but got ${hook.key}.`,
  );
  assert(
    hook.fn && typeof hook.fn === 'function',
    `api.register() failed, hook.fn must supplied and should be function, but got ${hook.fn}.`,
  );
  this.service.hooksByPluginId[this.id] = (
    this.service.hooksByPluginId[this.id] || []
  ).concat(hook);
}
```

真实代码就一行，前面两个 `assert` 是用来验证当前传入的 `hook` 的 _`key` 是否是 `string`类型_ 和 _`fn` 是否是 `function` 类型_ ，之后将该 `hook` 插入到 `Service` 实例的 `hooksByPluginId` 中供 `umi` 初始化的时候使用。

### registerCommand

注册插件命令的方法。

```ts
function registerCommand(command: ICommand) {
  const { name, alias } = command;
  assert(
    !this.service.commands[name],
    `api.registerCommand() failed, the command ${name} is exists.`,
  );
  this.service.commands[name] = command;
  if (alias) {
    this.service.commands[alias] = name;
  }
}
```

将需要使用的命令 `command` 根据其自身属性 `name` 和 `alias` 进行插入到 `Service` 实例的 `commands` 中供 `umi` 使用。

### registerPresets

注册预设（也就是插件集）。

```ts
function registerPresets(presets: (IPreset | string)[]) {
  assert(
    this.service.stage === ServiceStage.initPresets,
    `api.registerPresets() failed, it should only used in presets.`,
  );
  assert(
    Array.isArray(presets),
    `api.registerPresets() failed, presets must be Array.`,
  );
  const extraPresets = presets.map((preset) => {
    return isValidPlugin(preset as any)
      ? (preset as IPreset)
      : pathToObj({
          type: PluginType.preset,
          path: preset as string,
          cwd: this.service.cwd,
        });
  });
  // 插到最前面，下个 while 循环优先执行
  this.service._extraPresets.splice(0, 0, ...extraPresets);
}
```

首先两个断言分别是检验当前 `Service` 运行阶段是否是 `initPresets` 以及 `presets` 是否是一个 `Array` 类型，之后对 `presets` 进行遍历操作，判断每一个 `preset` 是否有效，如果有效就返回，否则返回一个全新的空插件。之后将处理完的全新的 `extraPresets` 插入到 `Service` 实例的 `_extraPresets` 供 `umi` 初始化使用。

### registerPlugins

注册插件的方法。

```ts
function registerPlugins(plugins: (IPlugin | string)[]) {
  assert(
    this.service.stage === ServiceStage.initPresets ||
      this.service.stage === ServiceStage.initPlugins,
    `api.registerPlugins() failed, it should only be used in registering stage.`,
  );
  assert(
    Array.isArray(plugins),
    `api.registerPlugins() failed, plugins must be Array.`,
  );
  const extraPlugins = plugins.map((plugin) => {
    return isValidPlugin(plugin as any)
      ? (plugin as IPreset)
      : pathToObj({
          type: PluginType.plugin,
          path: plugin as string,
          cwd: this.service.cwd,
        });
  });
  if (this.service.stage === ServiceStage.initPresets) {
    this.service._extraPlugins.push(...extraPlugins);
  } else {
    this.service._extraPlugins.splice(0, 0, ...extraPlugins);
  }
}
```

整个过程和 `registerPresets` 逻辑一样，两个断言处理类型和运行阶段，之后根据运行阶段，将当前插件插入到 `_extraPlugins` 中。需要注意的是，如果当前阶段在 `initPresets` ，那就插入到最后，否则插入到最前面。

### registerMethod

注册方法的方法。

```ts
function registerMethod({ name, fn, exitsError = true }) {
  if (this.service.pluginMethods[name]) {
    if (exitsError)
      throw new Error(
        `api.registerMethod() failed, method ${name} is already exist.`,
      );
    else return;
  }
  this.service.pluginMethods[name] =
    fn ||
    function (fn: Function) {
      const hook = {
        key: name,
        ...(utils.lodash.isPlainObject(fn) ? fn : { fn }),
      };
      this.register(hook);
    };
}
```

首先判断当前 `Service` 实例是否已经注册了这个方法，如果没有将判断 `fn` 是否有值，有值直接插入，否则生成一个新的 `function` 插入。

> 注意： 这里新插入的匿名函数 `function` 不可以使用箭头函数，因为使用箭头函数 `this` 就会指向到当前 `PluginAPI` 实例中，而 umi 需要的是在遍历 `pluginMethods` 过程中 `this` 指向到使用它的 `PluginAPI` 中。

### skipPlugins

跳过插件，不执行的插件。

```ts
function skipPlugins(pluginIds: string[]) {
  pluginIds.forEach((pluginId) => {
    this.service.skipPluginIds.add(pluginId);
  });
}
```

就是将不需要执行的插件插入到 `Service` 实例的 `skipPluginIds` 中。

## 总结

整个 `Service` 的代码就这些，这边主要是 `node` 侧的代码，是在启动 `umi` 的时候去执行的操作，将所有的约定的配置和设置的插件处理完供项目代码使用。
