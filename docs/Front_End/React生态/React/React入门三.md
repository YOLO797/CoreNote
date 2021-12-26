---
title: react 入门三
order: 3
---

六、列表&Keys 1.列表
在 React 中，把数组转化为数列元素的过程与 js 是相似的
function NumberList(props) {
//js 中转化列表
const jsnumbers = [1,2,3,4,5];
const doubled = jsnumbers.map((number)=>number\*2);
console.log(doubled);

            //jsx内构建元素集合
            const numbers = props.numbers;
            const listItems = numbers.map((i)=>
                <li>{i}</li>
            );

            return(
                <div>
                    {doubled}
                    <ul>{listItems}</ul>
                </div>
            )
        }

        const numbers = [1,2,3,4,5];

        这个组件接收numbers数组作为参数，输出一个无序列表。
        运行这段代码，将会看到一个警告 a key should be provided for list items ，意思是当你创建一个元素时，必须包括一个特殊的 key 属性

        <li key={number.toString()}>
        给每个列表元素分配一个 key 来解决

    2.Keys
        Keys可以在DOM中的某些元素被增加或删除的时候帮助React识别哪些元素发生了变化。因此应当给数组中的每一个元素赋予一个确定的标识。

        一个元素的key最好是这个元素在列表中拥有的一个独一无二的字符串，通常使用来自数据的id作为元素的key:
            const todoItems = todos.map((todo) =>
              <li key={todo.id}>
                {todo.text}
              </li>
            );

        当元素没有确定的id时，你可以使用他的序列号索引index作为key
            const todoItems = todos.map((todo, index) =>
              <li key={index}>
                {todo.text}
              </li>
            );
        如果列表可以重新排序，我们不建议使用索引来进行排序，因为这会导致渲染变得很慢。

        用keys提取组件
            元素的key只有在它和它的兄弟节点对比时才有意义。
            当拆分提取组件时，注意map循环要把key标识对应的多个组件，而不是组件下的多个value
            function ListItem(props) {
                const value = props.value;
                return (
                     // 错啦！你不需要在这里指定key，且这里没有map
                     <li key={value.toString()}>
                       {value}
                     </li>
                );
            }
            function ListItem(props) {
              // 对啦！这里不需要指定key:
              return <li>{props.value}</li>;
            }
            function NumberList(props) {
              const numbers = props.numbers;
              const listItems = numbers.map((number) =>
                // 又对啦！key应该在数组的上下文中被指定
                <ListItem key={number.toString()}
                          value={number} />

              );
              return (
                <ul>
                  {listItems}
                </ul>
              );
            }
            当你在map()方法的内部调用元素时，你最好随时记得为每一个元素加上一个独一无二的key。

        数组元素中使用的key在其兄弟之间应该是独一无二的。然而，它们不需要是全局唯一的。
            function Blog(props) {
                const sidebar=(
                    <ul>
                        {props.posts.map((post)=>
                            <li key={post.id}>
                                {post.title}
                            </li>
                        )}
                    </ul>
                );
                const content = props.posts.map((post)=>
                    <div key={post.id}>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                    </div>
                );
                return(
                    <div>
                        {sidebar}
                        <hr/>
                        {content}
                    </div>
                )
            }

            const posts = [
                {id:1 ,title:"Hello World", content:"Welcom to study React!"},
                {id:2 ,title:"Installation", content:"You can install React from npm"}
            ];
            当我们生成两个不同的数组时，我们可以使用相同的键，如{sidebar} 和 {content}

            key会作为给React的提示，但不会传递给你的组件。
                const content = posts.map((post) =>
                  <Post
                    key={post.id}
                    id={post.id}
                    title={post.title} />
                );
            如上，Post组件可以读出props.id，但是不能读出props.key （key不能被读），若需要使用和key相同的值，要作为参数传递

        在jsx中嵌入map()
            JSX允许在大括号中嵌入任何表达式，所以我们可以在map()中这样使用
                function ListItem(props) {
                    return <li>{props.value}</li>;
                }
                function NumberList(props) {
                    const numbers = props.numbers;  //[1,2,3]
                    return(
                        <ul>
                            {numbers.map((post)=>   //post 指代每一个元素
                                <ListItem key ={post.toString()} value={post}/> //<li> 1 </li>...
                            )}
                        </ul>
                    )
                }
            这么做有时可以使你的代码更清晰，但有时这种风格也会被滥用。
            但请记住，如果一个map()嵌套了太多层级，那可能就是你提取出组件的一个好时机。

七、组件通信
通常组件会发生三种通信：
<1>向子组件发消息
<2>向父组件发消息
<3>向其他组件发消息

    React 只提供了一种通信手段：传参。对于大应用，很不方便。

    当父组件要获取子组件的值，只能通过回调：
        class Son extends React.Component{
            render(){
                return(
                    <p>自定义子组件：<input onChange={this.props.onChange}/></p>
                )
            }
        }
        class Father extends React.Component{
            constructor(porps){
                super(porps);
                this.state = {
                    son:""
                }
            }
            changeHandler(e){
                this.setState({
                    son:e.target.value
                })
            }
            render(){
                return(
                    <div>
                        <Son onChange ={this.changeHandler.bind(this)}/>
                        <p>这里显示子组件的内容：{this.state.son}</p>
                    </div>
                )
            }
        }

八、React nodes 1.什么是 React nodes？
React node 是一种轻量的，无状态的，不可变的，真实 DOM 节点的一种虚拟代表。它是 React 创建的基本元素。

        React node可以使用纯JavaScript方式创建也能使用JSX创建。以下讨论使用纯JavaScript创建React node

    2.创建虚拟DOM -- React nodes
        React.createElement(type,props,children)
            -type (string |React.createClass() ): 可以是一个代表HTML元素的字符串，也可以是一个React组件实例
                （React.createClass()的实例）；

            -props(null|object): 可以为null，也可以是一个对象；（通常为样式类代码）如：{ style: { wordBreak: 'break-all' } }

            -Children(null | string | React.createClass() | React.createElement()): 可以为null，如果是Text，
                其将被转换为文本节点，也可以是一个React node实例 (React.createElement() )或一个React 组件实例
                (React.createClass() )。

        该函数第一个参数代表你想创建的节点类型，第二个参数代表给该节点传入的参数（props），第三个代表该React节点的
            子节点（文本，子元素节点或组件实例）。

        示例：
            var reactNodeFailInfo = React.createElement('p', {style:{wordBreak: 'break-all'}}, "所选的课程服务包含" +
                      "已结束服务，其ID为: " + failServiceList.join(",") + " 无法延期");

        之后调用ReactDOM.render()方法进行渲染
            ReactDOM.render(reactNodeLi,document.getElementById('app'));
            render()做了两件事：渲染React nodes为Virtual DOM；渲染其为真实DOM。

        注意：
           <1> React中所有的属性都被写作驼峰式（如accept-charset写做acceptCharset）;
           <2> React中class属性写作className,for写作htmlFor，style属性为写作驼峰式 ;
           <3> HTML表单元素 (<input>、<textarea></textarea>等)，当其由React创建时，其支持与交互有关的属性value、
            checked、selected等。
           <4> “px”是React内联样式的默认单位，如果用其他的单位可以类似"2em"这样写，用引号围起来就可以了

    3.React元素工厂
        一个 ReactElement 工厂就是一个简单的函数，该函数生成一个带有特殊 type 属性的 ReactElement
        React.DOM.li(props, children);

        var reactNodeLi = React.DOM.li({id:'li1'}, 'one');

        如果你使用JSX，你可能永远不会用到ReactElement工厂；

    4.React Node中的事件
        React Node 中添加事件和在DOM中添加事件一样方便，把click和mouseover事件绑定在了一个Reactdiv节点上。

            var reactNode = React.createElement(
                'div',
                { onClick: clickhandler, onMouseOver: mouseOverHandler },//在此绑定事件
                'click or mouse over'
            );//之后编辑添加后的事件函数即可

        React为每一个事件绑定了一个被称为SyntheticEvent的对象，里面包含了该事件的所有细节，其实这个和DOM事件很类似，
        某个事件的SyntheticEvent实例，可以通过事件的回调函数访问

            var clickhandler = function clickhandler(SyntheticEvent) {
                console.log(SyntheticEvent);
            };

    以上参考：https://www.reactenlightenment.com/        -- React启蒙
