---
title: JavaScript进阶
order: 3
---

# JavaScript 进阶

## 理解 this 指向

#### **1. 普通函数调用**

this 指向 window 对象

```js
var name = 'window';

function func() {
  var name = 'object';
  console.log(this.name);
}

func(); // window
```

#### **2. 作为对象的方法被调用**

由对象调用，this 指向该对象

```js
var name = 'window';

var object = {
  name: 'object',
  func: function () {
    console.log(this.name);
  },
};

object.func(); // object

var other_func = object.func;
other_func(); // window
```

`object.func()`实际上等同于`object.func().call(object)` 见下文`call`

而`other_func()`则是`object.func().call(undefined)`，`call`传入`undefined`绑定了`window`上下文<Badge type="info">隐性绑定</Badge>

<Alert type="info"> **注意**：是作为`对象的方法`被调用，只是作为对象被调用的话依然指向 window</Alert>

#### **3. 使用 new 构造函数**

创建新实例，实例的方法或属性的 this 指向新实例

```js
var name = 'window';

function Person() {
  this.name = 'person';
}

Person.prototype.sayName = function () {
  // 给Person类添加了sayName()方法
  console.log(this.name);
};

var person = new Person();
person.sayName(); // person
```

#### **4. 应用场景：改变 this 指向**

为啥要改变 this 指向? 先来看一个栗子：

```js
var name = 'Freya';

let obj = {
  name: 'Regina',
  say: function () {
    console.log(this.name);
  },
};

obj.say(); //Regina，this指向obj对象

setTimeout(obj.say, 0); //Freya，this指向window对象
```

say 方法在定时器中是作为`回调函数`来执行的，定时器执行是回到**主栈**并在**全局**上下文环境中执行的，但我们需要的是 say 方法中 this 指向 obj 对象，因此我们需要修改 this 的指向。

#### **5. bind / call / apply 改变 this 指向**

<Alert type="info">即：将 **方法** -> **绑定到** -> **对象** 模式</Alert>

**apply 方法：**

> 接收两个参数：
>
> - **this**：指向
> - **param**： 函数的参数，已数组形式，传一个数组为参数
>
> 当第一个参数为`null`、`undefined`时，this 默认指向 window

<Alert type="info"> **注意**：使用`apply`方法改变 this 指向后，原函数会`立即执行`，且此方法只是`临时改变this指向一次`</Alert>

```js
var name = 'Freya';

var obj = {
  name: 'Regina',
  say: function (year, place) {
    console.log(this.name + ' is ' + year + ' born from ' + place);
  },
};

var say = obj.say;

setTimeout(function () {
  say.apply(obj, ['1996', 'China']);
}, 0); //Regina is 1996 born from China

say('1996', 'China'); //Freya is 1996 born from China
```

**setTimeout** 定时器，通过`apply`方法改变了`this`指向为`obj`对象

**say** 这个全局变量，调用的`this`则依然指向`window`，说明 apply 只是`临时改变一次this指向`

> <span style="color: #7395f7">**Tips**: apply 不实用の小技巧</span>
>
> 改变参数传入方式：
>
> ```js
> var arr = [1, 10, 5, 8, 3];
>
> console.log(Math.max.apply(null, arr)); //10
> ```
>
> `Math.max()`的参数是`参数列表`形式传入的：
>
> **如：Math.max(1,10,5,8,3)**
>
> 使用`apply()`可以将`数组参数`转成`列表参数`传入，从而直接求数组的最大值。

实现个 apply：

---

**call 方法：**

> 接收两个参数：
>
> - **this**：指向
> - **params**： 参数列表，已列表形式，传多个参
>
> 当第一个参数为`null`、`undefined`时，this 默认指向 window

<Alert type="info"> **注意**：使用`call`方法改变 this 指向后，原函数会`立即执行`，且此方法只是`临时改变this指向一次` ， 和`apply`相同</Alert>

传参示例：

```js
var arr = [1, 10, 5, 8, 3];

console.log(Math.max.call(null, arr[0], arr[1], arr[2], arr[3], arr[4])); //10
```

---

**bind 方法：**

> 接收两个参数：
>
> - **this**：指向
> - **params**： 参数列表，已列表形式，传多个参
>
> 当第一个参数为`null`、`undefined`时，this 默认指向 window
>
> 和`call`的区别：第二个参数列表可以分多次传入，而`call`必须一次性传入

<Alert type="info"> **注意**：使用`bind`方法改变 this 指向，原函数<Badge type="info">不会立即执行</Badge>，而是返回一个<Badge type="info">永久改变 this 指向</Badge >的函数，便于后续调用</Alert>

传参示例：

```js
var arr = [1, 10, 5, 8, 12];

var max = Math.max.bind(null, arr[0], arr[1], arr[2], arr[3]);

console.log(max(arr[4])); //12，分两次传参
```

`bind`方法可以分多次传参，最后函数运行时会把**所有参数连接起来**一起放入函数运行。

手动实现一个 bind：

```js
Function.prototype._bind = function (obj, ...p) {
  const that = this;
  return function (...a) {
    this.apply(obj, [...p, ...a]);
  };
};
```

---

```js
var o1 = {
  name: 'o1',
  sayName: function () {
    console.log(this.name);
  },
};

var o2 = {
  name: 'o2',
};

o1.sayName.call(o2); // o2
o1.sayName.apply(o2); // o2
```

arguments：
由于 js 没有重载功能，Arguments 对象能够模拟重载。
arguments 对象和 Function 是分不开的。因为 arguments 这个对象不能显式创建，arguments 对象只有函数开始时才可用。
arguments 对象并不是一个数组，但是访问单个参数的方式与访问数组元素的方式相同
function test(){
var s = ''
for (var i = 0; i < arguments.length; i++) {
alert(arguments[i]);
s += arguments[i] + ",";
}
return s;
}
test('name','age')

    如上代码，函数无需写明参数，传入的参数通过arguments进行获取

一、js 的函数多面体：
function Fn() {
var num = 500;
this.x = 100;
} # 注意类型是 "function" 函数对象 不是"object" 对象

    角色一：普通函数
        对于Fn而言，它本身是一个普通的函数，执行的时候会形成私有的作用域，然后进行形参赋值、预解析、代码执行、执行完成后内存销毁；

    角色二：类
        不仅如此，要知道js管函数叫普通的函数，还叫类！之后管这个函数名 Fn 实例化后的东西叫对象！如：
            var f = new Fn()    // f 就是Fn作为类而产生的实例。

            然而你要想获取 函数中的值，通过f.num /f.x 是根本获取不到的，Fn只是个函数又不是真正的类。你要给Fn作为类赋个参数和值
            通过 Fn.aaa = 1000 这种方式，除了用Fn能取到之外 f根本娶不到，又不是py。
        原型：
            因此像 py 的 self 一样。js的类都是用prototype 来进行存储的无论是方法还是参数都要 Fn.prototype.xxx 才能放到类里。
            prototype属性就是类自己的原型（就理解为self）

    角色三：普通对象
        Fn和 var obj = {} 中的obj一样，就是一个普通的对象。所有的函数都是Function的实例），它作为对象可以有一些自己的私有属性，
        也可以通过__proto__（理解为原型链指针）找到Function.prototype。

    原型、原型链、原型链指针：
        JS中每一个函数初始化都会默认初始化一个属性 原型 - prototype。结构：Object【__proto__、prototype】

        1.原型链的概念:
            当需要访问某个函数的某个属性时就会去到prototype中寻找这个属性，若没有找到这个属性，prototype中也存在自己的prototype，
            于是乎就这样一直往上找，这就是

        2.原型对象：
            原型本身也是一个对象，内部存在一个原型指针（_proto_）和构造器指针（_constructor_）
            - 原型指针：指向所继承对象的原型属性
            - 构造器指针：指向自己本身

        3.原型链的特点：
            Javascript的对象都是通过引用传递的，我们创建新对象的时候并没有一份属于对象本身的原型副本，都是通过不断的往上继承而来的，
            当我们修改原型时，与之相关的对象也会继承这一改变。
            因此需要一个属性就会向上找，找到Object后没有就没了，返回undefined。
            Fn = new Function()     // Function：函数类，所有函数都是它的实例，它上层是Object
            f = new Fn()            // __proto__：找基类对象的原型属性
             console.log(f.__proto__ === Fn.prototype)  //  true，原型指针指向上一个继承类的原型属性 f是Fn派生出来的
             console.log(Fn.__proto__ === Function.prototype)   // true，Fn 是 Function 基类派生出来的
             console.log(Fn.prototype.__proto__ === Object.prototype)   // true，Fn自己的原型本身也是一个对象
             console.log(Fn.prototype.__constructor__  === Fn())    // true，构造器指针指向自己本身

        Object：顶层类（包含对象、函数、数组等）
            constructor：指向Object自己。
            prototype：有原型，属性中包含toString、hasOwnProperType...等
            没有__proto__，自身就是顶层基类。

        根据以上特点，就解释了为啥function 函数也是一个普通对象了。它内部的参数（prototype）

二、call 方法详解：https://www.jianshu.com/p/00dc4ad9b83f
call 一般有两个作用： 1.继承。 2.修改函数运行时的 this 指针（如零中的第 4 种 this 指向）。它应用于 Function 对象，调用对象的一个方法，以另一个对象替换当前对象。

    call([thisObj[,arg[,arg2...N]]])
        thisObj：作为可选项。被用作当前对象的对象。
        arg...N：可选项。将被传递方法的参数序列。

    call可以将一个函数的对象上下文从初始的上下文改变为thisObj指定的新对象。没有提供参数Global对象用作thisObj。

    2.1 call的基本使用：
        var ary = [12, 23, 34];
        ary.slice();

        首先，先看如上代码的执行过程，ary这个实例通过原型链的查找机制找到Array.prototype上的slice方法，让找到的slice方法执行，在
        执行slice方法的过程中才把ary数组进行了截取。因此slice方法执行之前有一个在原型上查找的过程。

        var obj = {name:'iceman'};
        function fn() {
            console.log(this);
            console.log(this.name);
        }
        fn(); // this --> window
        // obj.fn(); // Uncaught TypeError: obj.fn is not a function
        fn.call(obj);

        再看，只执行fn()的话，打印this即为window,若全局中有name的话，this.name指向全局的name（这里没有）。

        call方法的作用：首先寻找call方法，最后通过原型链在Function的原型中找到call方法，然后让call方法执行，在执行call方法的时候，
            让fn方法中的this变为第一个参数值obj，最后再把fn这个函数执行。之后this被obj替代，name为obj中的name。

    2.2 call方法原理：
        function fn(){
            console.log(this);
        }
        var obj = {name:"asd"}
        // 要实现一个call方法
        Function.prototype.myCall = function (context) {
            console.log(this,context)
            // 1.让fn中的this关键字转变为context的值（即obj）
            //   因为这里的this关键字是fn函数，那么就要让this()中的this变为context，
            //   eval(...);

            // 2.让fn方法执行
            //   this();
        }
        fn.myCall(obj)

        1.当 fn.myCall(obj); 这行代码执行的时候，根据this的寻找规律，在myCall方法前面有"."，那么myCall中的this就是fn。

        2.执行myCall的方法，在第一步会将方法体中this换为传入的对象，并且执行原来的this， 注意：是执行原来的this,在本例中就是执行fn。

三、call、apply、bind、arguments 的区别
首先补充严格模式这个概念，这是 ES5 中提出的,只要写上：
"use strict"
就是告诉当前浏览器，接下来的 JavaScript 代码将按照严格模式进行编写。
<1>.fn.call(); // 普通模式下 this 是 window，在严格模式下 this 是 undefined
<2>.fn.call(null); // 普通模式下 this 是 window，在严格模式下 this 是 null
<3>.fn.call(undefined); // 普通模式下 this 是 window，在严格模式下 this 是 undefined

    apply:
        apply方法和call方法的作用是一模一样的，都是用来改变方法的this关键字，并且把方法执行，而且在严格模式下和非严格模式下，对于
        第一个参数是null/undefined这种情况规律也是一样的，只是传递函数的的参数的时候有区别。
            fn.call(obj , 100 , 200);
            fn.apply(obj , [100, 200]);

        call在给fn传递参数的时候，是一个个的传递值的，而apply不是一个个传的，而是把要给fn传递的参数值同一个的放在一个数组中进行操作，
        也相当于一个个的给fn的形参赋值。

        ES6使用 数组扩展...已经替代apply的将数组转为参数的特性。

    bind:（在IE6~8下不兼容）
        bind方法和apply、call稍有不同，bind方法是事先把fn的this改变为我们要想要的结果，并且把对应的参数值准备好，以后要用到了，直
        接的执行即可，也就是说bind同样可以改变this的指向，但和apply、call不同就是不会马上的执行。
            var tempFn = fn.bind(obj, 1, 2);
            tempFn();

        第一行代码只是改变了fn中的this为obj，并且给fn传递了两个参数值1、2，但是此时并没有把fn这个函数给执行，执行bind会有一个返回
        值，这个返回值tempFn就是把fn的this改变后的那个结果。

    arguments：
        由于js没有重载功能，Arguments对象能够模拟重载。
        arguments对象和Function是分不开的。因为arguments这个对象不能显式创建，arguments对象只有函数开始时才可用。
        arguments对象并不是一个数组，但是访问单个参数的方式与访问数组元素的方式相同
            function test(){
                var s = ''
                for (var i = 0; i < arguments.length; i++) {
                    alert(arguments[i]);
                    s += arguments[i] + ",";
                }
                return s;
            }
            test('name','age')

        如上代码，函数无需写明参数，传入的参数通过arguments进行获取

四、JS 的垃圾回收机制： 1.垃圾回收的必要性：
String、Object、Array 没有固定大小，因此当大小已知时才会分配内存。每次分配内存都要进行释放，否则解释器会消耗系统中可用的所有
内存而崩溃。但 JS 不像 C、C++有自己的一套垃圾回收机制，它只是检测程序何时不再使用对象了，无用才释放。

    2.垃圾回收原理：
        <1>标记清除：
            JS最常用的垃圾回收方式，当变量进入执行环境 -> 添加进入标记（意味永远不会释放） -> 离开环境 -> 标记离开（释放内存）
            工作流程：
                1.垃圾回收器，在运行的时候会给存储在内存中的所有变量都加上标记。（内存中所有都标记一遍）

                2.去掉环境中的变量以及被环境中的变量引用的变量的标记。（去掉当前环境相关的标记，这些是有用需要保留的）

                3.再被加上标记的会被视为准备删除的变量。（当前或之后有标记的都会被删除，因为没标记的都是有用的）

                4.垃圾回收器完成内存清除工作，销毁那些带标记的值并回收他们所占用的内存空间。

        <2>引用计数：
            另一种不太常见的垃圾回收策略是引用计数。
            # 基本类型 #：String、Number、Null、Undefined、Boolean 被保存在栈内存中。
            # 引用类型 #：指除了基本类型之外的，如Object、Array、基本类型的包装类型、内置对象、等等。保存在堆内存中。

            记录一个值被引用的次数 -> 声明或有引用类型的变量 -> 这个值引用次数 +1
            包含这个值的引用变量 -> 取得另外一个值 -> 这个值引用次数 -1 -> 若变为0 -> 下次垃圾回收器运行，该值被回收

            注：
                和py的回收机制同，IE的一部分非原生对象BOM、DOM就是用C++的COM对象实现，也是使用了C++回收算法的计数回收策略。弊端也
                相同，就是存在循环引用问题导致内存泄漏。（还有闭包、没有清理DOM引用、遗忘定时器或回调、子元素存在引用等都会泄漏）
                let objA = new Object(); let objB = new Object();
                objA.someOtherObject = objB
                objB.someOtherObject = objA

            解决方案：
                手动切断循环引用。objA.someOtherObject = null; objB.someOtherObject = null;

    3.性能优化：
        Object优化：
            为了最大限度的实现对象重用，就应该像避免使用new语句一样，避免使用{}来新建对象。
            有一种方式能够保证对象（确保对象prototype上没有属性）的重复利用，那就是遍历此对象的所有属性，并逐个删除，最终将对象清理为一个空对象。
            // 删除obj对象的所有属性，高效的将obj转化为一个崭新的对象！
            cr.wipe = function (obj) {
                for (let p in obj) {
                     if (obj.hasOwnProperty(p))
                        delete obj[p];
                }
            };
            有些时候，你可以使用cr.wipe(obj)方法清理对象，再为obj添加新的属性，就可以达到重复利用对象的目的。

        Array优化：
            arr = [] 情况数组则会创建一个空对象，并且将原来的数组对象变成了一小片内存垃圾！实际上，将数组长度赋值为0
            （arr.length = 0）也能达到清空数组的目的，并且同时能实现数组重用，减少内存垃圾的产生。

        Function优化：
            方法一般都是在初始化的时候创建，并且此后很少在运行时进行动态内存分配，这就使得导致内存垃圾产生的方法，找起来就不是那么容易了。
            但是，将方法作为返回值，就是一个动态创建方法的实例。只要是动态创建方法的地方，就有可能产生垃圾内存。
                setTimeout(
                    (function(self) {
                      return function () {
                              self.tick();
                    };
                })(this), 16)   // 乍一看似乎没什么问题，但每一次调用都返回了一个新的方法对象，就产生了大量垃圾。

            为了解决这个问题，可以将作为返回值的方法保存起来，例：
                this.tickFunc = (
                    function(self) {
                      return function() {
                                self.tick();
                      };
                    }
                )(this);

                // in the tick() function
                setTimeout(this.tickFunc, 16);  //这种方式每次重用了相同的方法对象。因为他值动态创建了一次返回给了tickFunc

            这种思想可以应用在任何以方法为返回值或者在运行时创建方法的情况当中。

        new语句：
            若进行生成类，使用类似JAVA的思想取创建，如：
                var Cat = function (name) { // 类似定义类
            　　　　this.name = name;       // 类似对属性赋值
            　　　　this.saying = 'meow' ;
            　　}
                var myCat = new Cat('mimi');   // 然后，再生成一个对象

            使用的时候，很容易忘记加上new，就会变成执行函数，然后莫名其妙多出几个全局变量。因此如下：

                Object.beget = function(o) {
                    let F = function(o) {};
                    F.prototype = o;
                    return new F;
                };

            创建对象时就利用这个函数，对原型对象进行操作：
                let Cat = {
                    name:'',
    　　　　         saying:'meow'
                }
                let myCat = Object.beget(Cat);

            对象生成后，可以自行对相关属性进行赋值：
                myCat.name = 'mimi';

五、彻底搞懂路由跳转：location、history 两大接口
在单页应用中，通常由前端来配置路由，根据不同的 url 显示不同的内容。想要知道这是如何做到的，首先得了解浏览器提供的两大 API：

    1、window.location：
        location对象有很多属性，可以通过修改属性值来改变页面的url。
        .href：设置或返回完整的URL
        .hash：设置或返回URL中的#后面的hash值，如果没有则为""
        .host：设置或返回URL中的主机名称和端口号
        .pathname：设置或返回当前 URL 的路径部分
        .protocol：设置或返回当前 URL 的协议，通常是http:或https:
        .search：返回URL的查询字符串。这个字符串以"?"开头

        方法：
            原生查询字符串参数:
                function getArgsQuery() {
                    //取得查询字符串并去掉"?"
                    var searchStr=window.location.search.length>0?window.location.search.substring(1):"";
                    //将每一项集成到数组中
                    var searchStrArray=searchStr.length>0?searchStr.split("&"):[];
                    //存储最后返回的对象
                    var args={};
                    searchStrArray.forEach(function (item) {
                        //属性
                        var name=decodeURIComponent(item.split("=")[0]);
                        //值
                        var value=decodeURIComponent(item.split("=")[1]);
                        args[name]=value;
                    });
                    return args;
                }

            改变浏览器的位置
                window.location.reload(true) //重新加载页面，true表示从服务器加载
                window.location.assign(url); //加载新的文档 等同于 location.href=url or location=url
                window.location.replace(url); //用新文档替换当前文档


    2、window.history:
        History 对象最初设计来表示窗口的浏览历史。但出于隐私方面的原因，History 对象不再允许脚本访问已经访问过的实际 URL。因此H5
        新增接口有5个方法，有的方法可以改变url而不刷新页面。

        方法：
            window.history.go(-2);      //后退两页
            window.history.go("");      //传字符串,跳转到历史记录中包含该字符串的第一个位置（未生效）

            window.history.back();      //后退一页

            window.history.forward();   //前进一页

            history.pushState(stateObject,title,url):
                当前URL和history.state加入到history中，并用新的state和URL替换当前，不会造成页面刷新。

                - stateObject    //与要跳转到的URL对应的状态信息，没有特殊的情况下可以直接传{}
                - title          //现在大多数浏览器不支持或者忽略这个参数，我们在用的时候建议传一个空字符串
                - url            //这个参数提供了新历史纪录的地址,它不一定要是绝对地址，也可以是相对的，不可跨域
                如： location.href : http://172.16.0.225/#/authority_manage
                     history.pushState({},"","/foo")
                     location.href : http://172.16.0.225/foo

            history.replaceState(stateObject,title,url) :用新的state和URL替换当前，不会造成页面刷新。参数同上

    3.页面监听：
        window.addEventListener('hashchange', function(e) {
          console.log(e) // do something
        })
        可以监听 url hash 的改变，通过history还是location直接改变hash 都可以进行监听到变化，更强大的还有popstate

        window.addEventListener('popstate', function(e) {
          console.log(e) // do something
        })
        能监听除 history.pushState() 和 history.replaceState() 外 url 的变化。（这两个方法也不会触发hashchange）

        单页面应用的路由有两种模式：hash 和 history。如果我们在 hash 模式时不使用 history.pushState() 和 history
        .replaceState() 方法。但推荐用history模式，因为hash模式丑。

        注：hash模式是如 /#/ 的模式（#） 还有hashBang模式 （#!）即以他们开头的形式，因此由于丑被诟病。而H5则是和正常url一致。

    4.为React Router提供核心功能的包 history：
        安装：npm install --save history

        导入：存在三类history，分别时browser，hash，与 memory。history包提供每种history的创建方法。
            import {
              createBrowserHistory,
              createHashHistory,
              createMemoryHistory
            } from 'history'
            无论你创建哪种history，最终都会得到一个几乎拥有相同属性与方法的对象。

        起源：
            在JQuery统治的年代，通过ajax请求无刷新更新页面是当时相当流行的页面处理方式，但改变页面会通过改变hash来唯一定位页面，因此
            用户无法使用前进/后退来切换页面。

            因此出现history对象。当页面的url或者hash发生变化的时候，浏览器会自动将新的url push到history对象中。history对象内部
            会维护一个state数组，记录url的变化。前进后退即是调用 forward/back 方法，取出对应的state，进行页面切换。
            history对象还提供2个不用通过操作url也能更新内部state的方法，分别是pushState和replaceState。（能存额外数据）

        history对象：（注意是对象）
            history对象中最重要的属性就是location。location对象反映了当前应用所在的"位置"。（注意是对象）
            location对象：{
                pathname: '/here',
                search: '?key=value',       // search属性是一个字符串，非被解析的对象（字符串解析包query-string）
                hash: '#extra-information',
                state: { modal: true },
                key: 'abc123'
            } 和 window 对象的 location 属性类似

            当创建一个history对象后，需要初始化location。对于不同类型history这一过程也不相同。例如，browser history会解析当前URL。

            方法：扩充了很多方法，如listen 用于监听 location 的变化等等。

            .push({ pathname: '/new-place' })：跳转到新的location。默认点击<Link>时，会调用history.push方法进行导航。

            .replace({ pathname: '/go-here-instead' })：与push类似，是替换当前索引上的位置

            .go...方法 不详细说明

            .listen(func)：监听，当location发生变化时，history会发送通知（事件驱动？）此时即可判断监听到的地址，之后在进一步操作。
                常用的就是判断location.pathname是否是目标地址，之后再设置代码更新。

                注： React Router的router组件（即router层）将会订阅history对象，这样当location变化时，其能重新渲染。

            .createHref(location)：传入location对象，输出url。
                场景应用：a标签（它只能解析url）。

            类型：不同类型的history中存在着差异。下面两者的最大区别在于创建URL。
                createBrowserHistory()：browser则是pathname后地址，hash: '#hash'
                createHashHistory()：hash 的创建直接pathname（#后地址）
                    另：hash由于其依赖所有路径信息存在URL中，可能遭攻击，没有动态服务时再考虑使用吧。
                createMemoryHistory()：以在能使用JavaScript的地方随意使用。可以被使用在app中。
                    你可以在浏览器中使用使用memory history，如果你愿意的话。（虽然这样会失去与地址栏的交互能力）。
                    与其他两类history最大的区别在于其维护着自己的location。
                    默认值：entries = [{ pathname: '/' }], index = 0


        location对象控制一切：
            诚然，每次访问的都是当前的location，history对象会持续追踪一组location，这个对象有添加和访问location数组中任意location
            的能力。history中保存了一个索引值，用来指向当前的location。（history掌控所有location）
            在memory中location被直接定义，在history和hash中数组的索引被浏览器控制，不能直接访问。（出于安全性的限制）
