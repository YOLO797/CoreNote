---
title: Vue 入门
order: 1
group:
  title: VUE生态
  order: 21
---

# Vue<Badge type="miku">渐进式框架</Badge>

既可以当成 `小插件` 使用，也可以当做 `全套全家桶前端项目` 来使用的框架

<Alert type="info"><Font type="miku" fsize="m">Vue 文档</Font>写的已经**可以**了，没必要自己**再抄一遍**文档！</Alert>

[Vue2](https://cn.vuejs.org/v2/guide/)

[Vue3](https://v3.cn.vuejs.org/guide/introduction.html)

[Vue3-Cookbook](https://v3.cn.vuejs.org/cookbook/)

<Font type="miku" fsize="l">因此以下仅为踩坑记录</Font>

---

### 一、基础

### 1.数据驱动视图：

**数据驱动视图: 逻辑只放在数据的改变上，至于页面怎么变，不 care**

注：原则上不希望用模板形式{{}}，用指令！正常讲所有指令对和原生一一对应。

- v-text: 对应 js 的 innerText, 用来指定文本内容
- v-html: 对应 js 的 innerHtml, 用来指定 DOM 内容
- v-for: 遍历 li 时，应该记得要指定 key, 遍历的 index 和 py 的循环位置刚好相反

```html
    <!-- <div id="app">
    {{ name }} // 最好不用
    <h2 v-text="name"></h2> // 而是用绑定属性  即指令的方式去get到数据
    <div v-html="hobby"></div>
    <div>
        <ul>
            <li v-for="(course, index) in course_list" :key="index">{{ course }}{{ index }}</li>
        </ul>
        <ul>
            <li v-for="(s, i) in s1" :key="index">{{ i }}-{{ s.name }}-{{ s.age }}</li>
        </ul>
    </div>
    </div>
    <script>
        var vm = new Vue({  // 实例化并绑定上文div 的作用域
            el:"#app",
            data: {
                name: 'ykb',
                age: 18
                html:`
                <ul>
                    <li>学习</li>
                    <li>舔狗</li>
                    <li>吸猫</li>
                </ul>
                `,
                course_list: [ 'Python', 'Linux', 'Ruby', 'Vue' ],
                s1: [
                    { name: "zz", age: 23 },
                    { name: 'ykb', age: 22 }
                ]
            }
        })
```

### 2.动态绑定

- v-bind：可以动态绑定属性, 可以简写为' : ', 用来绑定标签的样式、属性、input、textarea、select 等
- v-if/else-if/else: 可以通过判断来控制显示和隐藏及其他操作
- v-show：同样可以控制显示和隐藏

```html
<style>
  .my_active {
    width: 200px;
    height: 100px;
    border: 2px solid red;
  }
</style>

<div id="app">
  <img :src="my_src" alt="" />
  <div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }">
    {{ my_src }}
  </div>
  <div v-bind:class="{my_active: is_show}"></div>
  // 是否显示样式则取决于is_show 是否为真
  <p v-if="seen">现在你看到我了</p>
  <div v-if="role == 'root'">超级管理员</div>
  <div v-else-if="role == 'visitor'">游客</div>
  <div v-else>没有权限</div>
  <div v-show="is_show">通过v-show控制显示隐藏</div>
</div>

var vm2 = new Vue({ el: "#app", data: { my_src:
'http://i0.hdslb.com/bfs/face/bef99e3e9e699bcff3e59eda3c2922ac7f058a3d.jpg@70w_70h_1c_100q.webp',
activeColor: "red", fontSize: 30, is_show: true, seen: true, role: "root" } })
```

- v-on: 用来绑定事件，可以简写为' @ ', 用来绑定标签的所属事件

```html
<div id="app">
  <button @click="my_click('x')" @mouseenter="my_enter">{{ btn_info }}</button>
</div>

var vm = new Vue({ el: "#app", data: { btn_info: "按下", }, methods: { my_click:
function (x) { alert("按下" + x) }, my_enter: function () {
console.log("鼠标移入事件") } } })
```

所有指令跟的都是表达式：即 "指令" = "xx"

#### 3.指令修饰符

所有的指令都有修饰符，可以给指令增加一些小功能

- .lazy：懒加载，失去光标的时候才进行绑定，

  ```html
  <input type="text" v-model.lazy="username" /> {{ username }}
  ```

- .number：转为数字

  ```html
  <input type="text" v-model.lazy.number="phone" /> {{ phone }}
  ```

- .trim：去掉空格

  ```html
      <input type="text" v-model.lazy.trim="mail" >
      {{ mail }} <pre>{{ mail }}<pre>
  ```

#### 4.自定义指令

通过.directive("指令名",function(){})来设置

```html
<div id="app">
  <div class="my_box" v-pin.left.bootom="pinned"></div>
</div>
Vue.directive("pin", function (el, binding) { console.log(el)
console.log(binding) let gps = binding.modifiers; // modifiers: {right: true,
top: true} 是个对象，可获取指令修饰符 if (binding.value){ el.style.position =
"fixed"; // el.style.right = 0; // el.style.bottom = 0; 用写死的方式修改 for
(let posi in gps){ el.style[posi] = 0 //
动态根据v-pin.left.bottom传入的这两个值进行修改 } } else { el.style.position =
"static" } }) var vm = new Vue({ el: "#app", data: { pinned: true //
指令里面绑定的值 } })
```

- el：可以获取所有的原生属性，并在此基础上改写或指定
- binding: 指绑定指令的所有信息
- 注：自定义指令不支持大写，但可以下划线如 my_text

### 二、补充属性

- 获取 DOM（不建议）
  由于是数据驱动视图，因此 Vue 原则上是不推荐获取 DOM 的

Vue 思想变为，拿到 DOM，我去更改 Vue 里面 data 的数据，data 数据变了，DOM 自然就变了。

```html
<div id="app">
  <div ref="my_box"></div>
  <button @click="my_click">点击显示文本</button>
</div>
const vm = new Vue({ el: "#app", methods: { my_click: function () { let ele =
this.$refs.my_box console.log(ele) ele.innerText = "ykb" } } })
```

给任何标签绑定属性的是 ref，然后获取这个绑定标签的时候应该是$refs

- computed:Vue 提供的计算属性

data 不设内部初值的原因：data 在浏览器默认加载时会先去执行 data 里面各个 key 对应 value 的计算
当执行后就再也不会动了，替换并渲染到页面上，同时就算动态变动，也是监听不到的
因此有了计算属性发挥作用，可以实时的监听到数据的变化，并重新执行计算。

```html
<div id="app">
  <table>
    <thead>
      <tr>
        <td>科目</td>
        <td>成绩</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Python</td>
        <td><input type="text" v-model.number="python" /></td>
      </tr>
      <tr>
        <td>Django</td>
        <td><input type="text" v-model.nubmer="django" /></td>
      </tr>
      <tr>
        <td>Mysql</td>
        <td><input type="text" v-model.nubmer="mysql" /></td>
      </tr>
      <tr>
        <td>总分</td>
        <td>{{ total }}</td>
      </tr>
      <tr>
        <td>平均分</td>
        <td>{{ average }}</td>
      </tr>
    </tbody>
  </table>
</div>

const vm = new Vue({ el: "#app", data: { python: "", django: "", mysql: "", },
computed: { total: function () { return this.python + this.django + this.mysql
}, average: function () { return this.total/3 } } })
```

computed 将数据全部放入缓存，并监听所有的数据，当数据发生改变才会重新执行计算，否则就一直丢在缓存里不动

- watch:用于监听 data 中数据的改动

```html
<div id="app">
  <p>{{ name }}</p>
  <p>{{ hobby }}</p>
  <button @click="change">点击改变</button>
</div>
const vm = new Vue({ el: "#app", data: { name: "zz", hobby: ["舔狗", "雪球"],
obj: { "age": 23, "sex": "男" } }, methods: { change: function () { //this.name
= "zxy"
//取巧的办法，若去掉注释，不可变类型改变时可以影响下面数组中字符串改变的监听
//this.hobby.push("画画") this.hobby[0] = "吸猫" //vm.$set(this.hobby, 0,
"吸猫") 这个方法可以监听到Vue提供的通知方法 //this.obj.age = 17 this.obj["sex"]
= "女"// 此时发现深度监听也监听不到 vm.$set(this.obj, "sex", "女") } }, watch: {
name: { handler: function (val, oldval) { console.log(val) console.log(oldval) }
}, hobby: { handler: function (val, oldval) { console.log(val)
console.log(oldval) }, deep: ture } obj: { handler: function (val, oldval) {
console.log(val) console.log(oldval) }, deep: ture //
此时deep可以使修改对象监听到数据，但建立新键值对却不行 } } })
```

注： 例子中，watch 监听是有局限的它可以监听到不可变类型的改变，和数组长度的改变，但无法监听
到数组中单个数据的变化（Vue 中的大坑，所以不能重新渲染界面）
然后还会发现选择深度监听 deep: ture

组件名.$set方法： 例如vm.$set(this.obj, "sex", "女") 可以有效帮助浏览器监听到对象的改动
一定是要对应的组件名！

    注：小坑：vue和react的区别：
        场景描述：js 的 this指向问题，当在Vue的methods 下 试图写
        click: () => {
            console.log(this) // 发现此时this指向了export default
            // 因此可以获取default
        }
        click() {
            console.log(this)// 此时this指向VueComponent对象（即我的组件）
        }

- 箭头函数内部没有 this，会直接调用父级作用域的 this，它的父级作用域是 window？ - 而写成 function(){}的话，会指向调用它的对象，也就是你这个组件

       和react的区别：（刚好和react反过来了）
           react返回的是一个类, vue是一个对象, 对象没有形成一个块级作用域
           类有自己的内部作用域，会在实例化的是有把this指向实例化的对象，

           Vue：因此可以在vue中闭包的时候写 () => 箭头函数，只要内部操作用不到this的，你随便写，怎么写都行
           但若凡是内部使用this的，用到this的第一级方法，你都写function

           React：react是写箭头函数最保险，因为箭头函数的话this不会跑偏

### 三、Vue 的组件
