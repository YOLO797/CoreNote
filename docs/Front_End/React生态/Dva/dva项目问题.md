---
title: DvaJS-踩坑篇
order: 2
---

零、注意事项： 1.每次项目都要 npm run build 进行更新，更新之后要 ctrl+shift+r 进行清除缓存并刷新

一、语法&框架： 1.*函数名是什么意思，里面参数怎么理解
*init({}, {put}) -- _name(){} 前面的 _ 号，表示这个方法是一个 Generator 函数
\*query({payload}, {select, call, put})

        仅有这种*后面接函数的方式 内部才能用yield。
        这种写法可以看成是 name: function(){}  {payload}就把它当做传入的参数，{select,call,put}三种动作形式

    2.如何理解这种写法 changeSeason: (value) => {}
        这么理解 changeSeason(value){}

    3.关于menu.js 若在其中对key赋值，为何能直接解释出路由

    4.antd的表格 每次select选中的列 对应 后端query获取到的一列数据

二、参数及写法： 1.路由：
tutor/ajax/class_list 为啥在 Django 中找不到对应 -- 没仔细找，Django 的主路由下指定了 tutor

    2.渲染：
        render: (subject) => {}
        render: (list, record) => {}
        为什么这两种方式都能获取到数据，而我用第一种却获取不到数据

        这里并不是React里面的渲染，而是 antd 表格 的一个自带的函数，第一个参数为每行的值text，第二个为每行的数据record，

    3.Reducer是返回了数据，但是它到底干了啥，数据返回给了谁？
         Reducer 函数只是一个纯函数，它接收应用程序的当前状态以及发生的 action，然后返回修改后的新状态。
         当做接收原数据，通过订阅action来更新state存放的新数据

    4.model下的state 是全局状态管理？ 指的就是这个页面用到的所有数据？
        对，可以这么理解

    5.createSeasonInfoAndFilterData: { ...createSeasonInfo, ...filterData } 这种是什么传参方式
        这种就是把两个object 当参数合起来作为createSeasonInfoAndFilterData的子集并传过去
        createSeasonInfoAndFilterData 里面包含了 两个参数的值直接用 '.'即可访问

    6.如何理解updateQueryData updateState & query &delete_class_by_id
        同4，直接理解为涉及数据的方法

    7.如何理解 updateStateDeeply 这个函数
        reducers下面所有方法传入的state都是全局的所有state。而action 里面包含了index、payload、type、或@@redux..之类
        若要规定传入参数为{ payload: id }这种形式，那么dispatch 中一样传，表示在reducers里只接收payload

        每次payload 传给reducers，此时还尚未在原来的state中更新，所有的数据上的操作都是在reducers下完成,因此传入之后
        把原来的state更新，并返回更新后的state，此时全局状态才会改变

    8.antd若要自定义样式，可以参考https://ant.design/docs/react/customize-theme-cn （多半没用）貌似无需导入antd的入口less
           直接 :global .ant-modal（修改组件）{.ant-modal-content{自定义的颜色}} 即可
           但覆盖组件样式就有用了，参考https://pro.ant.design/docs/style-cn

    9.js 对象和字典一样是无序的，也不要试图去用对象进行排序，手段：_.forEach 进行遍历，申请一个数组进行push每一个对象元素，之后
        利用arr.sort((a,b) => a - b) 进行排序 a, b为数组中的上、下元素，根据需求转化为对应的可排序类型。

四、项目爬坑记录：
1.Antd 的文档一定要看下文方法参数，DatePicker 选择日期 插件 中的 onChange = {listenerMap.onStartChange} 之后
复写的 onStartChange(time, value) 是要两个参数的，function(date: moment, dateString: string) ，若直接按照例子
上写一个 value，其实是拿到了 time 类型为 moment，之后的逻辑全崩溃

    2.Antd 的文档描述的不是很清楚，不是很懂前端有些Bug真的难以解决，这次的是组件多选模式
        Uncaught Error: must set key for <rc-animate> children
        虽然github的issue我没看懂，但只要把之前组件写的默认值defaultValue={''}去掉即可

    3.CSRF 跨站伪造请求，老问题，也和我一开始想的一样，前端表单提交没有csrf_token怎么办，只好在后端把csrf给禁了
        利用@csrf_exempt 把防御去除

    4.改动前端代码若出现500、403、等多半可能是webkeeper中出现异常，此时记得查看view中接收的值是否正确。通常前端发送的数据要经过
        def parse_post_request(request):
            return json.loads(request.body)
        即可读取，并赋值 （回去研究） 注：405是传的方法（get、post等）不对导致的

    5.理解并灵活运用组件的属性，比如什么时候用onChange、onFocus等，当刷新下拉列表时，把onFocus和onChange分开，onFocus
        仅仅用来刷新和生成列表，而onChange则负责改动。

    6.细节
        <1>注意，导入组件（其他同），应该用import { 组件名 } from xxx
        <2>注意括号{}和 ,要对应好,避免犯多了}, 的错误
        <3>注意Dva的传值，看准了参数再传参（尤其是Dva中组件从model-> route-> component-> child_component 的传值）
        <4>注意model层中的updateStateDeeply是传子state的
        <5>注意dva中的css使用要使用className={cssless.name}，即less文件中会用到的对应名字，而不是className={"name"}

    7.antd中的表格若要排序则前端可以通过sorter: (a, b) => a.id - b.id ,但只能单页面进行排序，不适用数据量较大的页面
        若远程调用排序，则通过设置 sorter: true 之后通过 onPageChange 进行监听，之后传入后端，解析，映射，order_by

        排序时涉及到年月日 记住是moment('2018-08-21', 'YYYY-MM-DD') DD是大写。还有排序哪需要 y*10000 + m*100 + d
        直接moment(a, 'YYYY-MM-DD').valueOf() - moment(b, 'YYYY-MM-DD').valueOf() 就出来了

    8.创建虚拟DOM -- React nodes
        创建虚拟DOM p 标签 切记它没有value，也不能用innerHTML 而是在React.createElement(p标签,props,children这里写文本)

        注意赋值css 时，坑爹的IDE只提示style的 key，没提示value 因此需要自己查 因此对style赋值用以下形式
        var reactNodeTextArea = React.createElement('p', {style:{wordBreak: 'break-all'}},"文本"})

    9.当加载延时影响到渲染时，利用await或是在添加一个开关来控制页面的渲染

    10.理解event.target 它指代了目标的事件源，通常调用者是谁谁就是事件源。因此在React中form表单的Input传值则是利用onChange回调
        取值。(e) => {listenMap.function(e.target.value)} 而 currentTarget（暂时理解为触发事件元素的父级元素）

    11.antd中的select提交后如何清空，首先置空geteid[0].innerHTML不行，会销毁组件，还会发现并无其他能正常修改的属性。目前解决办法是
        清空之前选中的数据源state，三元式显示空数据。

    12.请正确理解组件的导出，export default 表示默认导出，import A from './A' import时无需添加括号同时制定名称也无关紧要。
        而仅当export const A = 42 包含了定义名的导出，import { A } from './A' 导入时仅能严格通过括号名称导入。
        一个模块只能有一个默认导出，但是你可以拥有多个命名导出 import A, { myA, Something } from './A'

五、拿了用 1.禁止复制：
style={{ color: '#07E', mozUserSelect: 'none', webkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none' }}
火狐某些 js 会无效，因此直接屏蔽样式。
