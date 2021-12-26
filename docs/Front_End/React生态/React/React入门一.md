---
title: react 入门一
order: 1
group:
  title: React库
  order: 31
---

React 框架:
安装：
npm install -g create-react-app
create-react-app my-app

        cd my-app
        npm start

    文件目录结构
        node_modules    --这里面包含了react项目中会用到的一些组件，install的时候下载下来的
        public/index.html   --包含了项目中的启动页面，react比较适合单页面项目应用开发，所以暂时只包含一个index.html，react工程的入口页面
        src/index.js    --包含了一些我们自己使用的js文件，css文件，img文件等等。不要管什么app.js，你就看到index.js即可，系统默认将index.html
                          对准了index.js，index.js也就是我们的入口js，他和index.html所对应。

        这样不好理解，因此可以变换为
        /public
            - index.html
        /src
            -css
            -img
            -js
            index.jx
        注：可以删除或重命名其他文件。

    参考：
        http://www.ruanyifeng.com/blog/2016/09/react-technology-stack.html
        https://doc.react-china.org/docs/state-and-lifecycle.html

React - 16.4.0
零、介绍
最多、最大、组件化（UI 层）、拼接、能够无缝转接到 ReactNative
Vue 组件：Vue.component()代码、Vue.extends()麻烦、.vue 模板文件 开发最常用
template: 结构
script: 行为 （不能说 script 就是组件，三者合起来才成为组件。因此.vue 后缀的文件用 webpack 编译后才成为组件）
style: 样式
React 组件：有组件化的概念，但是没有像.vue 这样的组件模板文件，React 中一切都是以 js 来表现的。（结构、行为、样式都是 js 来创建的）
ES6 & ES7 (async 和 await)要会用。

    什么是DOM：
        浏览器概念，用 js对象 来表示页面上的元素即为DOM（如getElementById获取到的对象即为DOM）同时提供DOM对象的API
    什么是虚拟DOM：
        框架中的概念，开发框架的程序员，手动 用JS对象 来模拟页面上的DOM元素和DOM之见的欠套关系
    为什么要实现虚拟DOM：
        为了实现页面中，DOM元素的高效更新

一、元素渲染：
index.html 界面中添加的 <div id="root"></div>
此 div 中的所有内容都将由 React DOM 来管理，称之"根" DOM 节点

    用React 开发应用时一般只会定义一个根节点。但如果你是在一个已有的项目当中引入 React 的话，你会需要在不同的部分单独定义 React 根节点。

        const element = <h1>Hello World</h1>;
        ReactDOM.render(
            element,
            document.getElementById('root')
        );
    将React元素渲染到根DOM节点中,需要传递到ReactDOM.render()的方法中，通过找root的id来将其渲染

    ReactDOM会比较元素内容的先后不同，而在渲染过程中只会改变更新的部分。即便每秒都创建一个描述整个UI树的新元素，ReactDOM也只会更新渲染
    文本节点中发生变化的内容

    注意：在大多数的React应用的实际开发中，ReactDOM.render()只会调用一次

二、组件&Props
组件可以将 UI 切分成一些的独立的、可复用的部件，这样你就只需专注于构建每一个单独的部件。

    一、组件：
    1、创建组件：
        理论上，只要是输出 JSX 代码的函数，就是一个 React 组件。但是这种写法只适合那些最简单的组件。更正式、更通用的组件写法，
        要使用 ES6 类（class）的语法。如下：

            import React from 'react';

            class ShoppingList extends React.Component {
                render() {
                    return (        //顶层只能一个标签（根元素）
                        <div>XXX</div>
                    );
                }
            }
            export default ShoppingList;

        上面代码定义了一个 ShoppingList 组件。自定义的组件必须继承React.Component这个基类，然后必须有一个render方法，给出组件的输出。

        使用 React 组件也很简单，引入这个组件以后，就可以直接使用。如下：
            import React from 'React';
            import ShoppingList from './shoppinglist.js';

            <ShoppingList ... />
            ...

    2、参数及状态：
        参数：
            组件内部，所有参数都放到this.props属性上面。通过这种参数机制，React 组件可以接受外部消息。
            this.props对象有一个非常特殊的参数this.props.children，表示当前组件“包裹”的所有内容。

        状态：
            React 规定，组件的内部状态记录在this.state这个对象上面。每次更新通过this.setState()方法。

        props和state的区别：
            props当做接收参数的数据流对象，而state只是更改组件自身内部数据的对象。

    3.受控组件&非受控组件：
        例如，一个组件内部没有state，无法实现通过外部组件来直接修改用户输入的值。对于这种不能直接控制状态的组件，我们称之为非受控组件。

        而这个组件添加了自身的状态，每次输入的值完全通过setState更改value属性来决定，那么此时组件为受控组件。

        受控 与 非受控 两个概念，区别在于这个组件的状态是否可以被外部修改。一个设计得当的组件应该同时支持“受控”与“非受控”两种形式，
        即当开发者不控制组件属性时，组件自己管理状态，而当开发者控制组件属性时，组件该由属性控制。


    1.写法：
        <1>.定义一个组件最简单的方式是使用JavaScript函数：
            function Welcome(props) {
              const a = () => {}
              return <h1>Hello, {props.name}</h1>;
            }
            组件从概念上看就像是函数，它可以接收任意的输入值（称之为"props"），并返回一个需要在页面上展示的React元素。

        <2>.其他方式定义组件
            之前createClass的写法已废弃，现在应该仅有两种写法：把AppTop写在src文件下的js中的top.js里

            const AppTop = () =>(   // const表示只读，和let作用域相同，都存在暂时性死区且不可重复
                <header>
                    <h1>标题栏</h1>
                </header>
            )
            这种箭头函数的写法，不推荐，使用{this.props.word}时会报错

            class AppTop extends React.Component{
                render(){
                    return(
                        <header>
                            <h1>{this.props.name}</h1>
                        </header>
                    )
                }
            }
            ES6 class 来定义一个组件,标准写法，推荐


        D.va中组件推荐写法<1>
            优点：这样写的话 就是一个function 所以react在判断的时候 会直接省略生命周期的部分 从而 可以大大的加快加载速度
            缺点： 你无法使用this,也没有办法使用生命周期，所以 如果你的页面 必须要使用生命周期的话 还是用class吧（如需要初始化）

    2.普通渲染：
        function Welcome(props) {
          return <h1>Hello, {props.name}</h1>;
        }

        const element = <Welcome name="Sara" />;
        ReactDOM.render(
          element,
          document.getElementById('root')
        );

        之前渲染一个元素就是ReactDOM.render(element,doc.GBID("root"))的形式，现在无非是多了一部
         - React元素不只是DOM标签
         - const React元素中 不直接给元素赋值DOM标签，而是进行组件调用，调用用户自定义的组件
         - 将（JSX属性作为单个对象）参数传递给该组件，这个对象称之为"props"。之后把返回后的DOM标签在赋值给元素
         - 之后与渲染元素的形式一致，用这种方式渲染了组件

         注：组件名称必须以大写字母开头。

    3.组合渲染：
        即组件套组件，在组件中调用组件，之后渲染组合后的组件
        function Welcome(props) {
          return <h1>Hello, {props.name}</h1>;
        }

        function App() {
          return (
            <div>
              <Welcome name="Sara" />
              <Welcome name="Cahal" />
              <Welcome name="Edite" />
            </div>
          );
        }

        ReactDOM.render(
          <App />,
          document.getElementById('root')
        );

        与之前的区别在于现在是直接渲染整个整合后的组件把之前的element替换为  <组合组件 /> 即可

        注意：当返回的DOM太多而导致复用性很差的时候，记得要拆分成许多个小组件，之后根据实际情况命名、组合、套娃。能够构建可复用的组件


    4.Props的只读性：
        无论是使用函数或是类来声明一个组件，它决不能修改它自己的props。
        function test(porps1,porps2) {
            porps1.test -=props2
            console.log(a.test)
        }
        类似这种方式不能在内部对porps*进行改动赋值的，这种方式在js中不会报错，react中只适用纯函数（不能改变自身的props）


    5.State & 生命周期
    <State>:
        设置一个计时器：为了使Clock组件真正可重用和封装，要拆成组件
            function Clock(props) {
              return (
                <div>
                  <h1>Hello, world!</h1>
                  <h2>It is {props.date.toLocaleTimeString()}.</h2>
                </div>
              );
            }

            function tick() {
              ReactDOM.render(
                <Clock date={new Date()} />,
                document.getElementById('root')
              );
            }

            setInterval(tick, 1000);
        此时，是通过传参来每秒更新UI，若要自身更新，则需要为组件添加状态
        可理解为属性（但是状态是私有的，完全受控于当前组件）

        将函数组件转化为类组件：
            class Clock extends React.Component {
              render() {
                return (
                  <div>
                    <h1>Hello, world!</h1>
                    <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
                  </div>
                );
              }
            }
            创建一个名称扩展为 React.Component 的ES6 类
            创建一个叫做render()的空方法
            将函数体移动到 render() 方法中
            在 render() 方法中，使用 this.props 替换 props

        使用类就允许我们使用其它特性，例如局部状态、生命周期钩子

        为一个类添加局部状态:
            <h2>It is {this.state.date.toLocaleTimeString()}.</h2>

            在 render() 方法中使用 this.state.date 替代 this.props.date

    <2>生命周期：将生命周期方法添加到类中
        构造函数：在如上的Clock类中 添加一个类构造函数来初始化状态 this.state：
            constructor(props) {
                super(props);
                this.state = {date: new Date()};
              }

        之后从 <Clock /> 元素移除 date 属性 一个类的初始化完成

        挂载：组件第一次加载到DOM中，要进行的动作
            componentDidMount() {

            }

        卸载：每当组件生成的这个DOM被移除，要进行的动作
            componentWillUnmount() {

            }

        这些方法被称作生命周期钩子

        通过挂载建立定时器：** 子组件在父组件之前执行
            componentDidMount() {
                this.timerID = setInterval(
                  //()=>是箭头函数表示调用tick()方法，如果直接写tick()没有作用
                  () => this.tick(),
                  1000
                );
            }
            利用this来保存定时器ID（添加定时器的ID属性，设置了每秒定时器）
            this.props 由React本身设置，但需要存储不用于视觉输出的东西，则可以手动向类中添加其他字段（timerID即是）
            如果你不在 render() 中使用某些东西，它就不应该在State（状态）中。

        通过卸载取消定时器：
            componentWillUnmount() {
                clearInterval(this.timerID);
            }
            实现了每秒钟执行tick方法

        使用 this.setState() 来更新组件局部状态：
            tick() {
                this.setState({
                  date: new Date()
                });
            }

        当props或者state发生变化时执行
            shouldComponentUpdate(){

            }
        在初始化render时不会执行，并且是在render之前，当新的props或者state不需要更新组件时，返回false。-- diff算法

    <2.1>整理逻辑：
        -- 初始化 当 <Clock /> 被传递给 ReactDOM.render() 时，React 调用 Clock 组件的构造函数。
        -- 渲染   然后调用 Clock 组件的 render() 方法，显示屏幕上的渲染内容，更新DOM来匹配Clock渲染输出。
        -- 挂载   React调用挂载，让浏览器生成一个定时器，每秒钟调用一次tick()
        -- 执行   每秒执行tick 使用包含当前时间的对象调用 setState() 来调度UI更新。每次调用setState() ，
                  React 知道状态已经改变，并再次调用 render() 方法来确定屏幕上应当显示什么进行渲染。
                  render() 方法中的 this.state.date，渲染输出将包含更新时间，更新DOM
                  （每次执行完后，都会去回调render进行渲染）
        -- 卸载   一旦组件被移除，调用componentWillUnmount()这个钩子函数 执行卸载，定时器清除

    <2.2>理解State（状态）
        -- 组件的任何UI改变，都可以从State的变化中反映出来
        -- State中的所有状态都是用于反映组件UI的变化，没有任何多余的状态，也不需要通过其他状态计算而来的中间状态

        并不是组件中用到的所有变量都是组件的状态！当存在多个组件共同依赖一个状态时，一般的做法是状态上移，将这个状态放到这几个组件
        的公共父组件中

        State 与 Props 区别:
            State是可变的，是组件内部维护的一组用于反映组件UI变化的状态集合;
            而Props对于使用它的组件来说，是只读的,要想修改Props，只能通过该组件的父组件修改;

            状态上移的场景中，父组件正是通过子组件的Props, 传递给子组件其所需要的状态。

    <2.3>正确使用state注意事项：
        构造函数是唯一能够初始化 this.state 的地方
            1.不要直接修改状态
                this.state.comment = 'Hello';  ，应当使用 setState():

                this.setState({comment: 'Hello'});

            2状态更新可能是异步的
                调用setState，组件的state并不会立即改变。setState只是把要修改的状态放入一个队列中，React会优化真正的执行时机
                并且React会出于性能原因，可能会将多次setState的状态修改合并成一次状态修改（提高性能）。所以不要依赖当前的State，
                计算下个State。

                同样不能依赖当前的Props计算下个状态，因为Props一般也是从父组件的State中获取，依然无法确定在组件状态更新时的值。

                因此不要如下这样写
                this.setState({
                    counter:this.state.counter + this.props.increment,
                })
                this.props 和 this.state 是异步更新的，你不应该依靠它们的值来计算下一个状态

                正确的方法就是通过函数控制
                this.setState(
                    (prevState,props) => ({
                        counter : prevState.counter + props.increment
                    })
                );
                or
                this.setState(function(prevState, props) {
                  return {
                    counter: prevState.counter + props.increment
                  };
                });

                例：
                    对于一个电商类应用，在我们的购物车中，当我们点击一次购买数量按钮，购买的数量就会加1，如果我们连续点击了
                    两次按钮，就会连续调用两次  this.setState({count: this.state.quantity + 1})
                    在React合并多次修改为一次的情况下，相当于等价执行了如下代码：
                        Object.assign(
                          previousState,
                          {count: this.state.quantity + 1},
                          {count: this.state.quantity + 1}
                        )
                    于是乎，后面的操作覆盖掉了前面的操作，最终购买的数量只增加了1个

                    你真的有这样的需求，可以使用另一个接收一个函数作为参数的setState，需要通过回调函数的方式 这个函数有两个参数，
                    第一个是当前最新状态（本次组件状态修改后的状态）的前一个状态preState（本次组件状态修改前的状态），
                    第二个参数是当前最新的属性props。如下所示：
                        this.setState((preState,props)=>({
                            count: preState.count + 1
                        }));
                        或是利用直接函数传参的方式
                        this.setState(function (preState,props) {
                            return{
                                count: preState.count + 2
                            }
                        });

            3. State 的更新是一个浅合并（Shallow Merge）的过程，可以单独更新某个变量而不影响其他变量
                当调用setState修改组件状态时，只需要传入发生改变的State，而不是组件完整的State
                例：一个组件的状态为：
                    this.state = {
                      title : 'React',
                      content : 'React is an wonderful JS library!'
                    }
                    当只需要修改状态title时，只需要将修改后的title传给setState
                    this.state = {title:"React.js"}

                    React会合并新的title到原来的组件状态中，同时保留原有的状态content

            4.State 与 Immutable
                建议吧State当做不可变对象（因为直接修改并不会渲染，State中包含的所有状态都应该是不可变对象）
                那么状态改变时如何创建新状态：分为三种情况
                (1) 状态的类型是不可变类型（数字，字符串，布尔值，null， undefined）
                    因为状态是不可变类型，直接给要修改的状态赋一个新值即可。
                    this.setState({
                      count: 1,
                      title: 'Redux',
                      success: true
                    })  修改count（数字类型）、title（字符串类型）、success（布尔类型）三个状态

                (2) 状态的类型是数组
                    使用数组的concat方法或ES6的数组扩展语法
                    // 方法一：将state先赋值给另外的变量，然后使用concat 连接新数组
                       var books = this.state.books;
                       this.setState({
                           books : books.concat(["React "])
                       })

                    // 方法二：使用preState、concat 连接新数组
                        this.setState(preState => ({
                            books: preState.books.concat(['Guide'])
                        }))

                    // 方法三：ES6 spread syntax 连接新数组
                    this.setState(preState => ({
                      books: [...preState.books, '.']
                    }))

                    从books中截取部分元素作为新状态时，使用数组的slice方法：
                        this.setState(preState => ({
                            books: preState.books.slice(1,3)
                        }))
                        or
                        var books = this.state.books;
                        this.setState({
                            books: books.slice(1,3)
                        })

                    当从books中过滤部分元素后，作为新状态时，使用数组的filter方法
                        var books = this.state.books;
                        this.setState({
                            books: books.filter(item => {
                                return item != 'React';
                            })
                        })
                        or
                        this.setState(preState => ({
                          books: preState.books.filter(item => {
                            return item != 'React';
                          })
                        }))
                    注意不要使用push、pop、shift、unshift、splice等方法修改数组类型的状态，因为这些方法都是在原数组的基础上修改，
                    而concat、slice、filter会返回一个新的数组。

                (3)状态的类型是普通对象（不包含字符串、数组）
                    如Object类型，使用ES6 的Object.assgin方法
                    var owner = this.state.owner;
                    this.setState({
                        owner: Object.assign({}, owner, {name: 'Jason'})
                    });
                    or
                    this.setState(preState=>({
                        owner: Object.assign({}, owner,{name: "Jason2"})
                    }));

                    使用对象扩展语法（object spread properties）
                    var owner = this.state.owner;
                    this.setState({
                        owner: {...owner, name: 'Jason'}
                    })
                    or
                    this.setState(preState=>({
                        owner: {...owner, name: "Jason3"}
                    }))

            为什么React推荐组件的状态是不可变对象呢？一方面是因为不可变对象方便管理和调试,另一方面是出于性能考虑

Diff 算法：
tree diff：即按新旧两颗树 逐层对比的过程，即为 Tree Diff。当整颗 DOM 逐层对比完毕，则所有按需更新的元素必找到。

    component diff：进行Tree Diff 时，每一层都是由各种组件来组成，因此每一个组件之间也要对比 即为Component Diff。
        * 若对比前后，组件的类型相同，则暂时认为组件不需要被更新。
        * 若对比前后，组件的类型不同，则需要移除就组件，创建新组件，并追加到页面上。

    element diff：在进行组件对比的时候，如果两个组件类型相同，则需要进行元素级别的对比，称Element Diff。

注：这里的生命周期浅析包含了最常用的几个。除此之外一个组件的加载是按照加载父组件再到子组件的这么一个过程（包含了子父组件的多个生命周期）

    0.注意 componentWillUnmount() 组件被卸载和销毁之前立即调用 此方法中执行任何必要的清理，例如使计时器无效、取消网络请求或清除在组件
    1.componentWillReceiveProps() 当组件传入的 props 发生变化时调用，但父组件进行render 此生命周期仍然调用
    2.shouldComponentUpdate() 中执行diff算法。（给定两棵树，找到最少转换步骤）原始O(n^3)，现在O(n) 不遍历整棵树，按层diff，不移动只删，
        若遍历到不同结点则不再后续遍历，直接删除不同结点。
