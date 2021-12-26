---
title: react 入门二
order: 2
---

三、数据流的自顶向下
父组件或子组件都不能知道某个组件是有状态（类）还是无状态（函数），并且它们不关心某组件是被定义为一个函数还是一个类。

    这就是为什么State（状态）通常被称为局部或封装。 除了拥有并设置它的组件外，其它组件不可访问!

    组件可以选择将其状态作为属性传递给其子组件:
        现有子组件-无状态
        function FormattedDate(props) {
            return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
        }
        在父组件Clock中进行调用
        render(){
            return(
                <div>
                    <h1>数据流自顶向下</h1>
                    <FormattedDate date={this.state.date}/>
                </div>
            )
        }
        此时FormattedDate 子组件将在其属性中接收到 date 值，并且不知道它是来自 Clock 状态、还是来自 Clock 的属性、亦或手工输入

    这通常被称为自顶向下或单向数据流。 任何状态始终由某些特定组件所有，并且从该状态导出的任何数据或 UI 只能影响树中下方的组件。
    （想象一个组件树作为属性的瀑布，每个组件的状态就像一个额外的水源，它连接在一个任意点而向下流动）

    为了表明所有组件都是真正隔离的，我们可以创建一个 App 组件，它渲染三个Clock：
        function App() {
            return(
                <div>
                    <Clock/>
                    <Clock/>
                    <Clock/>
                </div>
            );
        }
        ReactDOM.render(
            <App />,
            document.getElementById("root")
        )
        每个 Clock 建立自己的定时器并且独立更新。可以在有状态组件中使用无状态组件，反之亦然。

四、事件处理
1.React 内置组件的事件处理
React 内置组件是指 React 中已经定义好的，可以直接使用的如 div、button、input 等与原生 HTML 标签对应的组件。
原始：
<a href="#" onclick="console.info('You clicked me.'); return false;">
Click me.
</a>石器时代的注册方式，可以通过 return false 来阻止 HTML 的默认行为

        原生：比较麻烦，但各浏览器支持好
            <a href="#" id="my-link">
                Click me.
            </a>

            <script type="text/javascript">
                document.querySelector('#my-link').addEventListener('click', (e) => {
                    e.preventDefault();
                    console.info("You clicked me.");
                });
            </script>

        在 React 中，事件注册与石器时代的注册方式非常类似，不过有如下几点不同：
            -- React事件绑定属性的命名采用驼峰式写法，而不是小写。
            -- 如果采用 JSX 的语法你需要传入一个函数作为事件处理函数，而不是一个字符串(DOM元素的写法)
            -- return false; 不会阻止组件的默认行为，需要调用 e.preventDefault();

        React：
            function ActionLink() {
              function handleClick(e) {
                e.preventDefault();
                console.log('The link was clicked.');
              }

              return (
                <a href="#" onClick={handleClick}>
                  Click me
                </a>
              );
            }
        这是一个以函数方式定义的组件，组件渲染一个 a 元素。通过事件处理函数接收到的事件对象（e），阻止了链接的默认行为，并打印。
        这样就完成了 React 内置组件的事件处理函数

        注：e 是一个合成事件，根据 W3C spec 来定义这些合成事件，所以你不需要担心跨浏览器的兼容性问题。

    2.React 事件对象与浏览器原生 DOM 事件对象的区别：
        -- React 中的事件对象称之为 SyntheticEvent（合成对象）最大的好处是可以屏蔽浏览器的差异。
        -- React 中所有的事件处理函数都会接收到一个 SyntheticEvent 的实例 e 作为参数，如果在某些特殊的场景中，
            你需要用到原生的 DOM 事件对象，可以通过 e.nativeEvent 来获取。

    3.不要在异步过程中使用 React 事件对象
        出于性能的考虑，React 并不是为每一个事件处理函数生成一个全新的事件对象，事件对象会被复用。
        当事件处理函数被执行以后，事件对象的所有属性会被设置为 null，所以在事件处理函数中，你不能以异步的方式使用 React 的事件对象。

    4.不要使用 addEventListener
        React 为了提高框架的性能，内部实现了一套高效的事件机制。React 通过 DOM 事件冒泡，只在 document 节点上注册原生的 DOM 事件，
        React 内部自己管理所有组件的事件处理函数，以及事件的冒泡、捕获。

        因此通过addEventListener 注册了某个 DOM 节点的某事件处理函数，并且通过 e.stopPropagation(); 阻断了事件的冒泡或者捕获，
        那么该节点下的所有节点上，同类型的 React 事件处理函数都会失效。

        例：
            class CounterLink extends React.Component{
                constructor(props){
                    super(props)
                    this.state = {count: 0}
                    // 这种绑定是在回调中实现这个工作所必需的。
                    this.handleClick = this.handleClick.bind(this);
                }
                componentDidMount(){
                    document.querySelector(".my-link").addEventListener("click",(e)=>{
                        console.log("raw click");
                        e.stopPropagation();    // 阻断了事件的冒泡或者捕获
                    })
                }

                handleClick(e){
                    e.preventDefault()
                    console.info("react link");
                    this.setState({count:this.state.count + 1});
                }

                render(){
                    return(
                        <div className="my-link">
                            <a href="#" onClick={this.handleClick}>Click me {this.state.count} times.</a>
                        </div>
                    )
                }
            }此时handleClick无法执行


    5.必须谨慎对待 JSX 回调函数中的 this
        类的方法默认是不会绑定 this 的。如果你忘记绑定 this.handleClick 并把它传入 onClick, 当你调用这个函数的时候 this
        的值会是 undefined。

        如果你没有在方法后面添加 () ，例如 onClick={this.handleClick}，你应该为这个方法绑定 this。

        通过原地bind绑定：
            <button onClick={this.handleClick.bind(this)}>{this.state.isToggleOn ? "ON" : "OFF"}</button>
        通过初始化进行绑定：（构造函数中）
            this.handleClick =  this.handleClick.bind(this)

        如果使用 bind 让你很烦，这里有两种方式可以解决:
        1.实验性的属性初始化器语法，你可以使用属性初始化器来正确的绑定回调函数
            handleClick = () => {
                console.log('this is:', this);
            }
            这个语法在 Create React App 中默认开启。

        2.如果你没有使用属性初始化器语法，你可以在回调函数中使用 箭头函数：
            render() {
                // 这种语法确保this被绑定在handleClick中
                return (
                  <button onClick={(e) => this.handleClick(e)}>
                    Click me
                  </button>
                );
              }
            使用这个语法有个问题就是每次 LoggingButton 渲染的时候都会创建一个不同的回调函数。大多数情况下，这没有问题。

            注：然而如果这个回调函数作为一个属性值传入低阶组件，这些组件可能会进行额外的重新渲染。
                故：通常建议在构造函数中绑定或使用属性初始化器语法来避免这类性能问题。（尽管书写麻烦）


    6.向事件处理程序传递参数
        通常我们会为事件处理程序传递额外的参数。
        例如，若是 id 是你要删除那一行的 id，以下两种方式都可以向事件处理程序传递参数：
            <button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
            <button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>

        这两种方式是等价的
        例：
             preventPop(name, e){    //事件对象event要放在最后
                e.preventDefault();
                alert(name);
             }
            <a href="#" onClick={this.preventPop.bind(this,this.state.name)}>Click</a>

五、条件渲染
React 中的条件渲染和 JavaScript 中的一致，使用 JavaScript 操作符 if 或条件运算符来创建表示当前状态的元素，然后让 React 根据
它们来更新 UI。

    1.if渲染：
        function UserGreeting(props) {
            return <h1>Welcome back!</h1>
        }

        function GuestGreeting(props) {
            return <h1>Please sign up.</h1>
        }

        function Greeting(props) {  // 通过if渲染注销登录的不同组件
            const isLoggedIn = props.isLoggedIn;
            if(!isLoggedIn){
                return <UserGreeting/>
            }
            return <GuestGreeting/>
        }

        function LoginButton(props) {   // 渲染按钮，props.onClick?
            return(
                <button onClick={props.onClick}>Login</button>
            )
        }
        function LogoutButton(props) {
            return(
                <button onClick={props.onClick}>Logout</button>
            )
        }

        class LoginControl extends React.Component{
            constructor(props) {
                super(props);
                this.state={isLoggedIn:false};
                this.handleLoginClick = this.handleLoginClick.bind(this);
                this.handleLogoutClick = this.handleLogoutClick.bind(this)
            }

            handleLoginClick() {    // 通过执行函数来改变状态
                this.setState({isLoggedIn:true})
            }
            handleLogoutClick() {
                this.setState({isLoggedIn:false})
            }

            render(){
                const isLoggedIn =  this.state.isLoggedIn;
                let button = null;
                if(isLoggedIn){ // 利用变量来存储组件，通过id判断要渲染那个组件
                    button = <LogoutButton onClick={this.handleLogoutClick}/>
                }else{
                    button = <LoginButton onClick={this.handleLoginClick}/>
                }
                return(
                    <div>
                        <Greeting isLoggedIn={isLoggedIn}/>
                        {button}    // 如上变量
                    </div>
                )
            }
        }

    2.&& 逻辑与
        {unreadMessages.length>0 &&
            <h2>You have {unreadMessages.length} unread messages.</h2>
        }
        const messages = ['React', 'Re: React', 'Re:Re: React'];

        通常左边为条件表达式，右侧为要渲染的组件，若条件为False则右侧不会渲染

    3.三目运算符
        <b>{isLoggedIn ? 'currently' : 'not'}</b>

        若 isLoggedIn 为True 则为 "currently" 否则为 "not"

    4.阻止组件渲染
        在极少数情况下，你可能希望隐藏组件，即使它被其他组件渲染。让 render 方法返回 null 而不是它的渲染结果即可实现。
        function WarningBanner (props) {
            if(!props.warn){    // 此处返回null，阻止渲染
                return null
            }
            return(
                <div>Warning</div>
            )
        }

        class Page  extends React.Component{
            constructor(props){
                super(props)
                this.state = {showWarning: true}
                this.handleToggleClick = this.handleToggleClick.bind(this)
            }

            handleToggleClick(){
                this.setState(prevState=>({
                    showWarning:!prevState.showWarning
                }))
            }

            render(){
                return(
                    <div>   // 下面组件返回null并不影响组件生命周期方法的回调
                        <WarningBanner  warn={this.state.showWarning}/>
                        <button onClick={this.handleToggleClick}>{this.state.showWarning ?"hide":"show"}</button>
                    </div>
                )
            }
        }

        组件的 render 方法返回 null 并不会影响该组件生命周期方法的回调。
        例如，componentWillUpdate 和 componentDidUpdate 依然可以被调用。
