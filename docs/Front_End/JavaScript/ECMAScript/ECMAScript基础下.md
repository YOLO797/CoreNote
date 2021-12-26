---
title: ECMAScript基础下
order: 2
---

0、Symbol
在 ES5 中对象属性名都是字符串 -> 导致重名风险 -> 需要新机制保证独一无二 -> 引入原始类型 Symbol

    1.创建方式：
        let s = Symbol()  // 凡是属性名属于Symbol类型，则唯一（不使用new命令创建）
        typeof s // "symbol"

    2.接收参数：
        Symbol若接收字符串类型：打印时大概会易区分，若不传入参数，打印都直接显示Symbol()。
        Symbol若接收对象类型：会调用对象的toString方法，将其转化为一个字符串，之后才会生成一个Symbol值。

        注意：
            Symbol函数的参数只是对Symbol值的描述，相同参数的Symbol函数的返回值是不相等的
            Symbol值不能和其他类型的值进行运算，会报错。
            Symbol值能显示的转为字符串，也可以转为布尔值，但不能转为数值。

    3.作为属性名：
        由于每一个Symbol的值都不相等，因此可以作为标识符用于对象的属性名 而保证不会出现同名的情况。
        写法一：let s = Symbol(); let a = {}; a[s] = "qwe"
        写法二：let a = { [s]: "qwe" }
        写法三：let a = {}; Object.defineProperty(a, s, { value: "qwe" })
        都得到同样的结果：a -> {Symbol(): "qwe"}  a[s] -> "qwe"

        注意：
            Symbol 值作为对象属性名时，不能用点运算符a.s = "qwe" 错误。（点运算符后面总是字符串）
            Symbol值定义属性时，Symbol 值必须放在方括号之中a[s] = "qwe"。
            Symbol 类型还可以用于定义一组常量，保证这组常量的值都是不相等的。如日志的等级
                log.levels = {
                  DEBUG: Symbol('debug'),
                  INFO: Symbol('info'),
                  WARN: Symbol('warn')
                };
            Symbol 值作为属性名时，该属性还是公开属性，不是私有属性。

    实例：消除魔术字符串（强耦合）
        let Area = (flag, prop) => {
            let area = 0
            switch (flag){
                case 'Triangle':    // 此时代码中出现强耦合，不利用后期维护
                    area = .5 * prop.height* prop.width
                   break
            }
            return area
        }
        let flag = 'Triangle'
        ret = Area(flag,{height: 100,width: 100})

    - 改写：
        const shapeType  = {
            //triangle: 'Triangle'
            triangle: Symbol()  //  外部变量shapeType.triangle的值是啥不重要，只要不和shapeType属性的值冲突即可，因此用Symbol
        }
        let Area = (flag, prop) => {
            let area = 0
            switch (flag){
                case shapeType.triangle:    // 把魔术字符串消除，用外部变量代替
                   area = .5 * prop.height* prop.width
                   break
            }
            return area
        }
        ret = Area(shapeType.triangle,{height: 100,width: 100})

    4.属性名的遍历:
        Symbol 作为属性名，该属性不会出现在for...in、for...of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()、
        JSON.stringify()返回。

        <1>.Object.getOwnPropertySymbols方法，可以获取指定对象的所有 Symbol 属性名。

        <2>.Reflect.ownKeys方法可以返回所有类型的键名，包括常规键名和 Symbol 键名。

        利用Symbol的特性，可以定义一些不能遍历获取的方法，可以造成了一种非私有的内部方法的效果。

    5.Symbol.for()，Symbol.keyFor()：
        .for()：先检查有无传入参数 - key是否存在，若存在则不生成新值，无论调用多少次Symbol.for("f") 都返回同一个Symbol值
        .keyFor()：返回一个已登记的 Symbol 类型值的key。
            let s1 = Symbol.for("foo"); Symbol.keyFor(s1) // "foo"

        注意:
            Symbol.for为 Symbol 值登记的名字，是全局环境的，可以在不同的 iframe 或 service worker 中取到同一个值。
            就是说在 iframe 窗口生成的 Symbol 值，可以在主页面得到。

    实例：模块的 Singleton 模式
        Singleton 模式指的是调用一个类，任何时候返回的都是同一个实例。
        对于 Node 来说，模块文件可以看成是一个类。怎么保证每次执行这个模块文件，返回的都是同一个实例呢？
        利用global，把实例对象放入顶层global中
        //mod.js
        function A() {
            this.foo = "hello";
        }
        if(!global._foo) {
            global._foo = new A();
        }
        module.exports = global._foo

        //加载mod.js
        const a = require('./mod.js');  a.foo //变量a在任何时候加载的都是A的同一个实例

        但问题是全局变量global._foo是可改写的，任何文件都可修改，因此会使mod.js的脚本都失真。因此使用Symbol.for()
        const FOO_KEY = Symbol.for('foo');
        if(!global[FOO_KEY]) { global[FOO_KEY] = new A();}
        此时保证global[Symbol().for('foo')]不会无意间覆盖，但还是可被改写。若使用Symbol()生成，那么外部无法引用，也不能改写。

    6.内置的Symbol的值：
        除了定义自己使用的 Symbol 值以外，ES6 还提供了 11 个内置的 Symbol 值，指向语言内部使用的方法。详情见文档。

1、Set
ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。 1.创建方式：
const s = new Set(); // Set 本身是构造函数，用来生成 Set 数据结构。
const item = new Set([1, 1, 2, 2, 3])
items.size // 3 因此可用于数组去重。

        注意：
            Set中的{}空对象的值不同。

    2.属性和方法：
        .prototype.construtor：构造函数，用于生成集合
        .prototype.size：返回集合的长度

        - add(value)：添加元素
        - delete(value)：删除元素
        - has(value)：判断存在
        - clear()：清空成员

        Array.from(set)：可以将Set结构转化为数组。

    3.遍历操作：
        - keys()：返回键名的遍历器
        - values()：返回键值的遍历器
        - entries()：返回键值对的遍历器
        - forEach()：使用回调函数遍历每个成员

        注意：
            <1>.Set遍历的顺序就是插入顺序，这个特性有时特别有用，比如使用 Set 保存一个回调函数列表，调用时就能保证按照添加顺序调用。
            <2>.由于 Set 结构没有键名，只有键值（或者说键名和键值是同一个值），所以keys方法和values方法的行为完全一致。
            <3>.Set结构默认可遍历 Set.prototype[Symbol.iterator] === Set.prototype.values ，故values方法可省略。

        Set结构与实例数组同，拥有forEach方法，对于每个成员执行某种操作，没有返回值。
        forEach的 参数是一个处理函数，该函数的参数与数组的ForEach一致，为键值、键名、集合本身（可忽略），还可以有第二个参数，表示
        绑定处理函数内部的this对象。

    4.遍历的应用：
        ...：扩展运算符可以和Set结构结合，就可以去重。
        let arr = [3, 5, 2, 2, 5, 5];
        let unique = [...new Set(arr)]; // [3, 5, 2]

        数组的map、filter也可以间接用于Set
        let set = new Set([...set].filter(x => (x % 2) == 0))

        因此集合可以容易的实现交并补：
            let union = new Set([...a, ...b])
            let intersect = new Set([...a].filter(x => b.has(x)));
            let difference = new Set([...a].filter(x => !b.has(x)));

        若要赋值给原来的集合，除了利用原Set结构映射出一个新结构再赋值回去之外还可以利用Array.from()

2、WeakSet
与 Set 类似，也是不重复的值的集合。 1.与 Set 的区别：
<1>.WeakSet 的成员只能是对象，而不能是其他类型的值。
<2>.WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用。若引用无其他对象，不考虑 WeakSet 而直接回收。
WeakSet 里面的引用，都不计入垃圾回收机制。因此适合临时存放一组对象，以及存放跟对象绑定的信息。

        注：由于WeakSet 的成员是不适合引用，会随时消失，因此WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能
            成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakSet 不可遍历。

    2.创建方式：
        const ws = new WeakSet(); // 接受一个数组或类似数组的对象作为参数。（任何具有 Iterable 接口的对象）
        该数组的所有成员，都会自动成为 WeakSet 实例对象的成员。a = [[1],[2,3]] 要像这样的数组，他的成员才能成为WeakSet的成员

3、Map
JS 的对象 Object，本质上是 hash 结构的键值对集合，但局限于键只能是字符串。

    若想要let element = document.getElementById("myDiv"); let data[element] = 'metadata';
    element会转为'[object HTMLDivElement]' 因此为了解决这个问题，引入了Map数据结构。

    Map数据结构的键可以是各种类型的值，Object结构提供 "字符串 - 值"的对应，Map结构提供了 "值 - 值"的对应。若要键值对的结构Map更好。

    1.创建方式：
        const  m = new Map();   // 参数可以接收数组，该数组的成员是一个个表示键值对的数组。如 [['name', '张三'],['title', 'Author']]

        Map构造函数接受数组作为参数，实际上执行的是下面的算法:
            items.forEach(
              ([key, value]) => map.set(key, value)
            );

        任何具有Iterator接口，且每个成员都是双元素的数组的数据结构，都可以当做Map的参数。

    2.基本方法和属性：
        map.get(key)：取值，注意不能像Object 那样通过 obj.key 或 obj["key"]来取值，要通过方法获取。

        map.set(key, value)：赋值，除了通过构造函数传Iterator之外，还可以通过方法设置键值对，同键的值会被后面的覆盖。

        注意：
            只有键为同一个对象的引用，Map结构才视为同一个键。
            map.set(["a"],233)
            这种形式 map.get(["a"]) 是获取不到的，因为里面的["a"]只是Array("a")了一个，get获取的是另一个Array()后的。
            因此要通过 b = ["a"]; map.set(b,233); 才能被 map.get(b) 获取到

            同理，同样的值的两个实例，在 Map 结构中被视为两个键。
            const k1 = ['a'];   const k2 = ['a']; // k1、k2 被视为两个键

        map.has(key)：返回一个布尔值，表示某个键是否在当前 Map 对象之中。

        map.delete(key)：方法删除某个键，返回true。如果删除失败，返回false。

        map.clear()：清除所有成员，没有返回值。

        map.size 属性：返回 Map 结构的成员总数。

    3.结论：
        Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞（clash）的问题，我们扩展别人的库
        的时候，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。
        Map 只要两个值严格相等，就将其视为一个键，虽然NaN不严格相等于自身，但Map也将其视为一个键。

    4.遍历方法：
        Map是有序的，需要特别注意的是，Map 的遍历顺序就是插入顺序。
        Map 结构原生提供三个遍历器生成函数和一个遍历方法。
            - keys()：返回键名的遍历器。
            - values()：返回键值的遍历器。
            - entries()：返回所有成员的遍历器。可以利用let [key,value] of map 代替
            - forEach()：遍历 Map 的所有成员。
        Map的遍历通常都是用for of进行遍历的。

        const reporter = {
          report: function(key, value) {
            console.log("Key: %s, Value: %s", key, value);
          }
        };
        map.forEach(function(value, key, map){ // 注意这里由于this问题，有第二个参数时不要使用箭头函数
            this.report(key, value);
        },reporter);    // forEach方法还可以接受第二个参数，用来绑定this。

        Map可以转化为数组，因此结合数组的map方法、filter方法也可以实现Map的遍历和过滤（Map没有这些方法）。
        [...map].filter((k,v) => k < 3);
        [...map].map

    5.结构转化：
        <1>Map转为数组：
            转为数组结构最快的方法就是用扩展运算符（...）[...map.keys()] => 返回键的数组

        <2>数组转为Map：
            将数组传入 Map 构造函数，就可以转为 Map。

        <3>Map 转为对象：
            如果所有 Map 的键都是字符串，它可以无损地转为对象。如果有非字符串的键名，那么这个键名会被转成字符串，再作为对象的键名。
            function strMapToObj(strMap) {
              let obj = Object.create(null);
              for (let [k,v] of strMap) {
                obj[k] = v;
              }
              return obj;
            }

        <4>对象转为 Map：
            参考如上。

        <5>Map 转为 JSON：
            function strMapToJson(strMap) {
              return JSON.stringify(strMapToObj(strMap));
              //return JSON.stringify([...map]);
            }
            调用上文的strMapToObj方法，这时Map的键都为字符串。
            另一种情况，Map键有非字符串的键，可以用数组转换

        <6>JSON 转为 Map：
            正常情况下，所有键名都是字符串。
            function jsonToStrMap(jsonStr) {
              return objToStrMap(JSON.parse(jsonStr));
            }

4、WeakMap
WeakMap 结构与 Map 结构类似，也是用于生成键值对的集合。

    1.区别
        <1>.WeakMap只接受对象作为键名（null除外）不接受其他类型的值作为键名。
        <2>.WeakMap的键名所指向的对象，不计入垃圾回收机制。（和WeakSet相同）

    2.应用场景：
        在网页上DOM元素中添加数据，就要使用WeakMap结构。当该 DOM 元素被清除，其所对应的WeakMap记录就会自动被移除。
        const wm = new WeakMap();   //创建方式
        const element = document.getElementById('example');
        wm.set(element, 'some information');
        WeakMap作为一个实例，存入了DOM节点，将附加信息作为键值，此时wm对element引用就是弱引用，不会计入垃圾回收机制。
        注：WeakMap弱引用的只有键名而不是键值，键值依然是正常引用的。

    3.API区别：
        WeakMap与Map在API上的区别有两个，一是没有遍历操作（即无keys()、values()和entries()方法和 size属性），二是无法清空。
        因此只有四个方法可用：get()、set()、has()、delete()。

5、Proxy 1.概述：
Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种 "元编程"（meta programming），即对编程语言进行编程。
实际上重载（overload）了点运算符，即用自己的定义覆盖了语言的原始定义。
例：
var obj = new Proxy({}, {
get: (target,key,receiver) => {
console.log(`getting ${key}!`)
return Reflect.get(target,key,receiver)
},
set: (target,key,value,receiver) => {
console.log(`setting ${value}!`)
return Reflect.set(target,key,value,receiver)
}
})

            obj.count = 1   // setting 1! 赋值的时候先走了set
            obj.count++     //getting count!  .count时调用get方法  setting 2! 之后赋值操作又调用了set方法

    2.初始化：
        ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例
        var proxy = new Proxy(target, handler);     // Proxy 对象的所有用法，都是这种形式，不同的只是handler参数的写法。
        target：表示所要拦截的目标对象
        handler：该参数也是一个对象，用来定制拦截行为。（通常作为配置对象，代理操作所需的方法，调用时拦截并返回，没有拦截则直通）
        例：
            var target = {};
            var handler = {};
            var proxy = new Proxy(target, handler);
            proxy.a = "b"
            target.a // "b"
            proxy传入的handler没有任何拦截，等于直通原对象。故访问proxy等同于直接访问target。

    3.技巧：
        var object = { proxy: new Proxy(target, handler) }; // 设置到object属性
        let obj = Object.create(proxy)  // 还可以作为其他对象的原型
        obj.time
        obj对象本身并没有 time 属性，所以根据原型链，会在proxy对象上读取该属性，导致被拦截。

    4.拦截实例和操作一览：
        http://es6.ruanyifeng.com/#docs/proxy#Proxy-revocable
        {
            get: '咋获取',
            set: '咋设置',
            deleteProperty: '咋删除',
            enumerate: '咋枚举',
            ownKeys: '咋获取所有该对象的属性键 ',
            has: '问你有没有, 比如 "xxx" in target',
            defineProperty: '如何defineProperty， 这个我们也是可以代理的',
            getOwnPropertyDescriptor: '获取属性描述的代理',
            getPrototypeOf: '找原型时候的代理',
            setPrototypeOf: '设置对象原型的时候的代理',
            isExtensible: '判断对象是否可扩展的时候的代理',
            preventExtensions: '设置阻止对象扩展的时候的代理',
            apply: '执行调用操作的时候的代理',
            construct: '执行实例化的时候的代理'
        }
        Proxy.revocable()：
            返回一个可取消的 Proxy 实例。
            let {proxy, revoke} = Proxy.revocable(target, handler);
            proxy.foo = 123;
            revoke();   proxy.foo // TypeError: Revoked //revoke属性是一个函数，可以取消Proxy实例。

            使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。

        this 问题：
            在 Proxy 代理的情况下，目标对象内部的this关键字会指向 Proxy 代理。


    5.Proxy的作用：
        拦截，预警，上报，扩展功能，统计，强化对象...能想得到的都能沾到点边，并且由于规范依然在发展，所以大家慎用。。。

6、Promises 对象：（注意是一种对象）
好处： 避免 callback Hell ，并使异常捕获受控。比起回调函数和事件更合理及强大

    1.三种状态：
        -pending（进行中）、fulfilled（已成功）和rejected（已失败）。

        只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。
        即 asyncFunction().then(中的 return secondAsync(); )
        或 function fecth() {
            return new Promises(() => {})
        }
        fetch().then(中的 function(reason, data){})
