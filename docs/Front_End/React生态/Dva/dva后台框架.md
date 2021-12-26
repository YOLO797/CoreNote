---
title: DvaJS-基础篇
order: 1

group:
  title: DvaJS
  order: 32
---

# DvaJS

<Alert type="info">`React` and `redux` based, lightweight and elm-style framework.</Alert>

- [DvaJS](https://dvajs.com/)
- [github](https://github.com/dvajs/dva/blob/master/README_zh-CN.md)

零、特性
易学易用，仅有 6 个 api，对 redux 用户尤其友好，配合 umi 使用后更是降低为 0 API
elm 概念，通过 reducers, effects 和 subscriptions 组织 model
插件机制，比如 dva-loading 可以自动处理 loading 状态，不用一遍遍地写 showLoading 和 hideLoading
支持 HMR，基于 babel-plugin-dva-hmr 实现 components、routes 和 models 的 HMR

一、初始化
安装 dva-cli 用于初始化项目：
npm install dva-cli -g
dva -v

    创建新应用：
       dva new dva-quickstart
       这会创建 dva-quickstart 目录，包含项目初始化目录和文件，并提供开发服务器、构建脚本、数据 mock 服务、代理服务器等功能。

       --目录结构:
           mock 存放用于 mock 数据的文件；
           public 一般用于存放静态文件，打包时会被直接复制到输出目录(./dist)；
           src 文件夹用于存放项目源代码；
               asserts 用于存放静态资源，打包时会经过 webpack 处理；
               components 用于存放 React 组件，一般是该项目公用的  无状态组件；
               models 用于存放模型文件
               routes 用于存放需要 connect model 的路由组件；
               services 用于存放服务文件，一般是网络请求等；
               utils 工具类库
               router.js 路由文件
               index.js 项目的入口文件
               index.css 一般是共用的样式

           .editorconfig 编辑器配置文件
           .eslintrc ESLint配置文件
           .gitignore Git忽略文件
           .roadhogrc.mock.js Mock配置文件
           .webpackrc 自定义的webpack配置文件，JSON格式，如果需要 JS 格式，可修改为 .webpackrc.js

       Antd Admin：基于 antd 和 dva 的后台管理应用
       ├── /dist/           # 项目输出目录
       ├── /src/            # 项目源码目录
       │ ├── /public/       # 公共文件，编译时copy至dist目录
       │ ├── /components/   # UI组件及UI相关方法
       │ │ ├── skin.less    # 全局样式
       │ │ └── vars.less    # 全局样式变量
       │ ├── /routes/       # 路由组件
       │ │ └── app.js       # 路由入口
       │ ├── /models/       # 数据模型
       │ ├── /services/     # 数据接口
       │ ├── /themes/       # 项目样式
       │ ├── /mock/         # 数据mock
       │ ├── /utils/        # 工具函数
       │ │ ├── config.js    # 项目常规配置
       │ │ ├── menu.js      # 菜单及面包屑配置
       │ │ ├── config.js    # 项目常规配置
       │ │ ├── request.js   # 异步请求函数
       │ │ └── theme.js     # 项目需要在js中使用到样式变量
       │ ├── route.js       # 路由配置
       │ ├── index.js       # 入口文件
       │ └── index.html
       ├── package.json     # 项目信息
       ├── .eslintrc        # Eslint配置
       └── .roadhogrc.js    # roadhog配置

    启动开发服务器：
        cd dva-quickstart
        npm start

    使用 antd：
        npm install antd babel-plugin-import --save

    编辑 .webpackrc，使 babel-plugin-import 插件生效
        {
        +  "extraBabelPlugins": [
        +    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
        +  ]
        }

二、什么是 DVA
dva 是基于现有应用架构 (redux + react-router + redux-saga 等)的一层轻量封装，没有引入任何新概念，全部代码不到 100 行。
dva 是 framework，不是 library。很明确地告诉你每个部件应该怎么写。
除了 react 和 react-dom 是 peerDependencies 以外，dva 封装了所有其他依赖。

    dva = React-Router + Redux + Redux-saga 将这三个 React 工具库包装在一起，简化了 API，让开发 React 应用更加方便和快捷。

三、基本操作 1.定义路由：
新建 route component routes/文件名.js，内容如下：
import React from 'react';
<这里为定义的组件/>
export default 组件名;

        添加路由信息到路由表，编辑 router.js
            + import Products from './routes/文件名';
            ...
            + <Route path="/路由" exact component={组件名} />

    2.编写 UI Component：
        多个页面中复用一套UI元素则在 dva 里你可以把这部分抽成 component 。
        新建 components/ProductList.js 文件
            import React from 'react';
            import PropTypes from 'prop-types';
            import { Table, Popconfirm, Button } from 'antd';

            <这里为抽象出来的UI复用组件/>

            ProductList.propTypes = {

            };
            export default ProductList;

    3.定义 Model：
        完成 UI 后，现在开始处理数据和逻辑。    dva 通过 model 的概念把一个领域的模型管理起来，包含同步更新 state 的 reducers，
        处理异步逻辑的 effects，订阅数据源的 subscriptions 。

        新建 model models/products.js ：
            export default {
              namespace: 'products',
              state: [],
              reducers: {
                'delete'(state, { payload: id }) {
                  return state.filter(item => item.id !== id);
                },
              },
            };
        这个 model 里：
            namespace 表示在全局 state 上的 key
            state 是初始值，在这里是空数组
            reducers 等同于 redux 里的 reducer，接收 action，同步更新 state

        然后别忘记在 index.js 里载入他：
            // 3. Model
            + app.model(require('./models/products').default);

    4.connect 起来：
        已经单独完成了 model 和 component，那么他们如何串联起来呢?
        dva 提供了 connect 方法。如果你熟悉 redux，这个 connect 就是 react-redux 的 connect 。

        编辑 routes/Products.js，替换为以下内容：
            import React from 'react';
            import { connect } from 'dva';
            import ProductList from '../components/ProductList';

            const Products = ({ dispatch, products }) => {
                function handleDelete(id) {
                    dispatch();
                }
                return(
                    <ProductList onDelete={handleDelete} products={products} />
                );
            }//这里就是把routes层和model层进行了一个关联，他route中的动作能够向model层发出

            export default connect(({ products }) => ({
              products,
            }))(Products);

            说白了，就是把model层的数据通过mapStateToProps封装，传入到被绑定的组件中当参数。组件可直接根据spacename获取。

        最后，我们还需要一些初始数据让这个应用 run 起来。编辑 index.js：
            - const app = dva();
            + const app = dva({
            +   initialState: {
            +     products: [
            +       { name: 'dva', id: 1 },
            +       { name: 'antd', id: 2 },
            +     ],
            +   },
            + });
        刷新浏览器，应该能看到DVA框架的实现效果

四、Dva 概念： 0.https://github.com/dvajs/dva-docs/tree/master/v1/zh-cn/tutorial 仔细 1.数据流向：见图 Dva 数据流向
数据的改变发生通常是通过用户交互行为或者浏览器行为（如路由跳转等）触发的，当此类行为会改变数据的时候可以通过 dispatch 发起
一个 action，如果是同步行为会直接通过 Reducers 改变 State ，如果是异步行为（副作用）会先触发 Effects 然后流向 Reducers
最终改变 State，所以在 dva 中，数据流向非常清晰简明，并且思路基本跟开源社区保持一致

    2.Models层：
        谈起Model层首先要知道Redux
        Redux要点：
            应用中所有的 state 都以一个对象树的形式储存在一个单一的 store 中。 惟一改变 state 的办法是触发 action，一个描述
            发生什么的对象。 为了描述 action 如何改变 state 树，你需要编写 reducers。 -- 就是这样！

        state：
            type State = any
            State 表示 Model 的状态数据，通常表现为一个 javascript 对象（任何值）。

            操作的时候每次都要当作不可变数据（immutable data）来对待，保证每次都是全新对象，没有引用关系，这样才能保证 State 的
            独立性，便于测试和追踪变化。

        Action：
            type AsyncAction = any
            Action 是一个普通 javascript 对象，它是改变 State 的唯一途径。

            论是从 UI 事件、网络回调，还是 WebSocket 等数据源所获得的数据，最终都会通过 dispatch 函数调用一个 action，从而
            改变对应的数据。

            action 必须带有 type 属性指明具体的行为，其它字段可以自定义，如果要发起一个 action 需要使用 dispatch 函数；需要注
            意的是 dispatch 是在组件 connect Models以后，通过 props 传入的。
                dispatch({
                  type: 'add',
                });

        dispatch 函数：
            type dispatch = (a: Action) => Action
            dispatching function 是一个用于触发 action 的函数，action 是改变 State 的唯一途径，但是它只描述了一个行为，而
            dipatch 可以看作是触发这个行为的方式，而 Reducer 则是描述如何改变数据的。

            在 dva 中，connect Model 的组件通过 props 可以访问到 dispatch，可以调用 Model 中的 Reducer 或者 Effects
                dispatch({
                  type: 'user/add', // 如果在 model 外调用，需要添加 namespace
                  payload: {}, // 需要传递的信息
                });

        Reducer：
            type Reducer<S, A> = (state: S, action: A) => S
            Reducer（也称为 reducing function）函数接受两个参数：之前已经累积运算的结果和当前要被累积的值，返回的是一个新的
            累积结果。该函数把一个集合归并成一个单值。

            Reducer 的概念来自于是函数式编程，很多语言中都有 reduce API。如在 javascript 中：
                [{x:1},{y:2},{z:3}].reduce(function(prev, next){
                    return Object.assign(prev, next);
                })
                //return {x:1, y:2, z:3}

            这里面主要使用的是纯函数，纯函数是这样一种函数，即相同的输入，永远会得到相同的输出
            通常Reducers下的函数接收两个参数(state, action) Reducer 函数是 action 的订阅者。

            那么它是如何把数据变更传播到整个应用程序中呢？ -- 使用订阅者来监听状态的变更情况。

        Effect：
            Effect 被称为副作用，在我们的应用中，最常见的就是异步操作。它来自于函数编程的概念，之所以叫副作用是因为它使得我们的
            函数变得不纯，同样的输入不一定获得同样的输出。

            dva 为了控制副作用的操作，底层引入了redux-sagas做异步流程控制，由于采用了generator的相关概念，所以将异步转成同步写法，
            从而将effects转为纯函数。（简单来说，把各种逻辑放到这里面写）

        Subscription：
            Subscriptions 是一种从 源 获取数据的方法，它来自于 elm。说白了就是监听路由

            Subscription 语义是订阅，用于订阅一个数据源，然后根据条件 dispatch 需要的 action。数据源可以是当前的时间、服务器的
            websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等。
                import key from 'keymaster';
                app.model({
                  namespace: 'count',
                  subscriptions: {
                    keyEvent(dispatch) {
                      key('⌘+up, ctrl+up', () => { dispatch({type:'add'}) });
                    },
                  }
                });

            history：浏览器的一个属性，记录了当前路由的一些信息。如pathname, query, search state等属性，当我们要跳转路由的时候，
                将指定location对象里面的pathname即可 即：routerRedux.push(loaction) => push({ pathname: '/', ...})
                pathname：即url地址
                query: 则是获取url中的相关键值对

            注意：每个model层中的这个监听的都是全局路由。初始化查询加对应路由的判断。（不要再监听中写计时器）


    3.Router层：
        这里的路由通常指的是前端路由，由于我们的应用现在通常是单页应用，所以需要前端代码来控制路由逻辑。

        通过浏览器提供的 History API 可以监听浏览器url的变化，从而控制路由相关操作。
        dva 实例提供了 router 方法来控制路由，使用的是react-router。
            import { Router, Route } from 'dva/router';
            app.router(({history}) =>
              <Router history={history}>
                <Route path="/" component={HomePage} />
              </Router>
            );

    4.Route Components：
        一般来说，我们的组件有两种设计：
            <1>Container Component             一般指的是具有监听数据行为的组件
            <2>Presentational Component        展示形组件，不会关联订阅 model 上的数据，所需数据通过 props 传递到组件内部

        在 dva 中我们通常将其<1>约束为 Route Components，因为在 dva 中我们通常以页面维度来设计 Container Components。
        所以在 dva 中，通常需要 connect Model的组件都是 Route Components，组织在/routes/目录下，而/components/目录下则是纯组件

五、dva 快速入门
1.dva 应用的最简结构
import dva from 'dva';
const App = () => <div>Hello dva</div>;

        // 创建应用
        const app = dva();
        // 注册视图
        app.router(() => <App />);
        // 启动应用
        app.start('#root');

        其简化版数据流向图：
            view -- 通过dispatch -> 发起Action -> 改变State -- 通过connect ->绑定到View

    2.核心概念
        State：一个对象，保存整个应用状态
        View：React 组件构成的视图层
        Action：一个对象，描述事件
        connect 方法：一个函数，绑定 State 到 View
        dispatch 方法：一个函数，发送 Action 到 State

    3.State 和 View
        State 是储存数据的地方，收到 Action 以后，会更新数据。
        View 就是 React 组件构成的 UI 层（Component），从 State 取数据后，渲染成 HTML 代码。只要 State 有变化，View 会自动更新。

    4.Action
        Action 是用来描述 UI 层事件的一个对象。

        {
          type: 'click-submit-button',
          payload: this.form.data
        }

    5.connect 方法
        connect 是一个函数，绑定 State 到 View。

        import { connect } from 'dva';

        function mapStateToProps(state) {
          return { todos: state.todos };
        }
        connect(mapStateToProps)(App);//这里APP就是router.js中路由得到的组件，也就是本文件中的Component

        connect 方法返回的也是一个 React 组件，通常称为容器组件。因为它是原始 UI 组件的容器，即在外面包了一层 State。
        connect 方法传入的第一个参数是 mapStateToProps 函数，mapStateToProps 函数会返回一个对象，用于建立 State 到 Props 的映射关系。

    6.dispatch 方法
        dispatch 是一个函数方法，用来将 Action 发送给 State。

        dispatch({
          type: 'click-submit-button',
          payload: this.form.data
        })

        dispatch 方法从哪里来？被 connect 的 Component 会自动在 props 中拥有 dispatch 方法。

    7.路由routes中的js文件做了那些事
        每一个路由下都有一个model，这个model掌管这个路由的所有状态（action、state、reducer、sagas），组件想改变状态
            dispatch type名字就行了。

        <1>:使 router.js 中的路由 能够对routes 下的组件进行加载。

        <2>:自身封装一层新组件（Route Components）,同时return后应该会引用UI Component中的复用组件（纯组件）

        <3>:引用的UI组件若有触发事件则 把 Action（描述 UI 层事件的一个对象）通过 dispatch（将 Action 发送给 State）
            传入model层，通过reducers 来接收 action，同步更新 state

        <4>:绑定（connect）了每个路由对应的model和（Route Components）路由组件

四-五、总结：按照 dva 架构再过一遍流程
每个路由下都有个 model 层
router.js ————通过系列映射—————> models/xx.js

    在model层定义好这个路由的initialstate、reducers、sagas、subscriptions（下文state即是初始化state）
        model/xx.js
            -export default
                -namespace
                -state
                -reducers
                -effects
                -sagas
                -subscriptions

    然后connect组件（见7）
        routes/xx.js ————通过connect()———— 把组件和model进行连接
            connect(mapStateToProps)(Products)

            定义路由组件（Route Components）
                dispatch{Action}    传入model层，接收 action，同步更新 state
                return 调用纯组件

            建立 State 到 Props 的映射关系 function mapStateToProps({model的命名空间})   ？？待确认

            connect(映射关系)(路由组件)

    此时Route Components为父组件，其return时 调用的纯组件为子组件（子组件绑定了父组件的方法）
        Route Components
            事件函数：dispatch {里面就是Action}
            return(
                <UI Component 事件={事件函数} reducer={绑定model的数据}/>  ？？此处确定是model的namespace
            )

    当用户在页面上通过子组件触发事件时，子组件触发事件并 回调 给父组件，执行子组件绑定的父组件方法
        https://zhuanlan.zhihu.com/p/30034488
        用户 —————— 通过页面UI —————— 点击button -->  触发 子组件<UI Component />的事件  <———  父组件传入的
        子组件的 render: (text, record) => 是什么
        子组件通过record.id之类的作为参数  ————>  传入并调用父组件中的方法 将Action 发送到 State

    当在组件里发起action时，dva会帮你自动调用sagas/reducers。
        dispatch{
            type:model事件        ————用户点击触发————  model层调用reducers 接收 action，同步更新 state
            payload: 改动数据                                           |
        }                                                              |
                                                                       |
        -reducers                                        <—————————————
            -触发的操作(state,{ payload: id })       ———— 方法(全局状态、执行动作)action包含index、payload、type等
                -return state.filter

        每次把payload 传给reducers，此时还尚未在原来的state中更新，所有的数据上的操作都是在reducers下完成，因此传入之后
        把原来的state更新，并返回更新后的state，此时全局状态才会改变

    注意：dispatch 是异步的， 因此在Route Component 的dispatch函数后获取的数据依旧不是更新后的（如同React的setState后面打印state）

    以上：     发起同步action时，type写成'(namespace)/(reducer)' dva就帮你调用对应名字的reducer直接更新state。
              当发起异步action，type就写成'(namespace)/(saga)',dva就帮你调用对应名字的saga异步更新state

    之后页面就会进行重新渲染

    D.VA 使组件的关系扁平化,没有什么父子、兄弟关系，这样组件就具有很高的可重用性。所有需要在组件里通信的数据都要放在state中，
        然后connect组件，只拿到组件关心的数据，

六、dva 应用的最简结构（带 model)
// 创建应用
const app = dva();

        // 注册 Model
        app.model({
          namespace: 'count',
          state: 0,
          reducers: {
            add(state) { return state + 1 },
          },
          effects: {
            *addAfter1Second(action, { call, put }) {
              yield call(delay, 1000);
              yield put({ type: 'add' });
            },
          },
        });

        // 注册视图
        app.router(() => <ConnectedApp />);

        // 启动应用
        app.start('#root');

    1.app.model：
        dva 提供 app.model 这个对象，所有的应用逻辑都定义在它上面。

    2.Model 对象的属性:
        namespace: 当前 Model 的名称。整个应用的 State，由多个小的 Model 的 State 以 namespace 为 key 合成

        state: 该 Model 当前的状态。数据保存在这里，直接决定了视图层的输出

        reducer: Action 处理器，处理同步动作，用来算出最新的 State

        effects：Action 处理器，处理异步动作

    3.Reducer:处理数据
        Reducer 是 Action 处理器，用来处理同步操作，可以看做是 state 的计算器。它的作用是根据 Action，从上一个 State 算出当前 State。
        例：
            function add(state) { return state + 1; }

            // 往 [] 里添加一个新 todo
            function addTodo(state, action) { return [...state, action.payload]; }

            // 往 { todos: [], loading: true } 里添加一个新 todo，并标记 loading 为 false
            function addTodo(state, action) {
              return {
                ...state,
                todos: state.todos.concat(action.payload),
                loading: false
              };
            }

    4.Effect：接收数据
        Action 处理器，处理异步动作，基于 Redux-saga 实现。Effect 指的是副作用。根据函数式编程，计算以外的操作都属于 Effect，
        典型的就是 I/O 操作、数据库读写。
        例：
            function *addAfter1Second(action, { put, call }) {
              yield call(delay, 1000);
              yield put({ type: 'add' });
            }

        注：处理异步操作和业务逻辑部分，它不直接修改state，由action触发，可以触发action和服务器进行交互，可以获取全局state数据

    5.subscriptions：监听数据


    6.Generator 函数：
        Effect 是一个 Generator 函数，内部使用 yield 关键字，标识每一步的操作（不管是异步或同步）。

    6.call 和 put
        dva 提供多个 effect 函数内部的处理函数，比较常用的是 call 和 put。还有 select take

        -- put：用来发起一条action，类似于 dispatch
            触发action    yield put({ type: 'todos/add', payload: 'Learn Dva' });

        -- call：以异步的方式调用函数
            调用异步逻辑  const result = yield call(fetch, '/todos');

        -- select： 从state中获取相关的数据
            从state获取   const todos = yield select(state => state.todos);
        -- take： 获取发送的数据

    当我们使用put发送一条action的时候 与之对于的reducers就会接收到这个消息 然后在里面返回state等数据

    reducers中尽量只做state的数据返回 而不要在这里写相关的逻辑
        reducers:{
            showLoginLoading(state){
                return {
                    loginLoading: true,
                }
            }
        }

    7.路由跳转
        对于路由跳转的部分 我们使用这样来实现

        import { routerRedux } from 'dva/router'
        // 内部跳转
        yield put(routerRedux.push('/main')) # 跳转到main

        使用query-string库可以将对象转化为url参数：
        effects: {
            *routerJump({}, { call, put }) {
              yield put( routerRedux.push({     # 这里push里面的参数是location（参见上文history）
                pathname: '/',
                search: queryString.stringify({
                  from: 'product',
                  to: 'home'
                })
              }) ); // 路由跳转：效果 http://localhost:8000/?from=product&to=home 没用懂，慎用，直接用上下的就好。
            }
          },

        // 外部跳转
        dispatch(routerRedux.push({ pathname: '/etutor_class/update_authority', query: { userID: list[index].userID } }));
