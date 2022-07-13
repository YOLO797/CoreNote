# Hook

[Hook](https://zh-hans.reactjs.org/docs/hooks-intro.html) 是 `React 16.8` 的新增特性，它可以让你在不编写 `class` 的情况下使用 `state` 以及其他的 `React` 特性

## 1. Hook 简介

### 1.1 Hook 使用规则

[规则](https://zh-hans.reactjs.org/docs/hooks-rules.html)

- 只能在 `React 函数组件` 中调用，可在 [自定义 Hook]() 中调用其他 `Hook`
- 不能在循环、条件、或嵌套函数中调用 `Hook`
  - 即只能在一个函数组件中最外层调用
  -

## 2. Hook 基础使用

### 2.1 useState

```ts
const [state, setState] = useState(initialState);

setState(newState);
```

- `initialState：` 首次渲染使用的值，当初始值较为复杂时，可传函数形式
- `state：` 初始变量
- `setState：` 后续修改变量，即 `state` 的方法

<Alert type="info">和 `class 组件` 不同，若更新的数据 **与上次相同**，则 `React` 将自动跳过子组件的渲染，及 `effect` 的执行</Alert>

### 2.2 useContext

> 仅需在顶层组件注入（创建上下文），就可在任意一级的子组件中，获取顶层组件注入的上下文。而无需通过中间组件 `props` 的形式，一级级地往下传参

接收一个 `context` 对象，并返回该 `context` 的当前值，实现跨级组件之间的数据通信

```ts
const MyContext = React.createContext(value);
const value = useContext(MyContext);
```

- `React.createContext：` 创建上下文
- `useContext()：` 任意子组件中获取上下文

示例如下：

```ts
const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  },
};

// 创建上下文
const ThemeContext = React.createContext(themes.light);

// 父组件
function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// 中间组件
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

// 子组件
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```

### 2.3 useEffect
