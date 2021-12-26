---
title: JS异步
order: 5
---

零、JS 异步：

一、

JS Event Loop（事件循环）宏任务 和 微任务 https://segmentfault.com/a/1190000012806637

理解 async/await https://segmentfault.com/a/1190000007535316

八张图看清 async/await、Promise 的执行顺序 https://zhuanlan.zhihu.com/p/52000508

二、理解 JS 的 async/await

    1.async/await是什么？
        - async 是 异步 的简写，而 await 可以认为是 async wait 的简写。
            所以应该很好理解 async 用于申明一个 function 是异步的，而 await 用于等待一个异步方法执行完成。

        - await 调用 async函数 但调用自身必须是async包装的函数（死循环），但若不用await来调用呢？见下


    2.async的返回 & 作用？
        - 写一个async函数，你会发现，async（包含函数语句、函数表达式、Lambda表达式）返回的是一个Promise对象！
            async function  testAsync() {
                return "hello async";
            }

            console.log(testAsync())    // Promise {<resolved>: "hello async"}

        - 如果在函数中 return 一个直接量，async 会把这个直接量通过 Promise.resolve() 封装成 Promise 对象。

        - 因此返回值可以用 then() 链调用
            testAsync().then(v => {
                console.log(v);    // 输出 hello async
            });

        - 若async 函数没有返回值又该如何？当然它会返回 Promise{<resolve>: undefined}

        联想Promise的特点 —— 无等待，所以在没有await的情况下会立即执行并返回一个Promise对象（意味着await的阻塞作用）

        即区别在于：
            直接执行 async 函数返回的是Promise对象，之后再执行async函数里面的内容。用await则不直接立即返回Promise对象，而是等到
            async 函数执行后才返回

        而作用则是：
            将返回值处理成Promise对象，并立即返回。


    3.await 到底在等啥？
        - 通常来说是在等 async函数执行完，但语法说明它等待的是一个表达式，这个表达式的结果是Promise对象或其他值（无特殊规定）

        - 因此await 后面实际上可以接 普通函数的返回值或 async函数的返回值（通用）
            function a() {};    async function b() {};

            async function c() {
                const ret_1 = await a()
                const ret_2 = await b()  // 用await都是正确的！
            }
            如果等的是一个Promise对象，则后面的代码会阻塞直到该函数完成。

        注：利用await的函数本身，不会造成阻塞！（能用 await的函数 都必须是 async函数，这就是原因）因此所有的阻塞都会封装在Promise
            对象中异步执行。


    4.async/await 帮我们干了啥？
        - 那么async既然只是立即返回了一个封装后的Promise对象，而await只是获取到Promise对象，并将resolve的结果返回回来。
            这样的话和直接使用返回 Promise对象的函数 及用 then()链获取值从效果上应该是一样的啊？见下。


    4.1 async/await 的优势是啥？
        - 单一的Promise链并不能体现 async/await的优势，而处理多个Promise组成的then()链时，优势才能体现出来。

        /* Promise是通过then()链来解决回调地狱的，但其实不彻底，因此用async/await来进一步优化
            n: 表示这个函数执行的时间（毫秒）
            return resolve(n + 200) 表示返回的是原时间添加了200毫秒，此值作用于下一步
        */
            function takeLongTime(n) {
                return new Promise(resolve => {
                    setTimeout(() => {
                        return resolve(n + 200)     // 返回resolve的值为传入的n + 200 毫秒
                    }, n)                           // 执行时间为 n毫秒
                })
            }

            function step1(n) {
                console.log(`step1 with ${n}`);
                return takeLongTime(n);         // 第一步 返回了上文的Promise对象 此时的值已经+200毫秒了
            }

            function step2(n) {
                console.log(`step2 with ${n}`);
                return takeLongTime(n);         // 第二步，同上
            }

            function step3(n) {
                console.log(`step3 with ${n}`);
                return takeLongTime(n);         // 第三步，也就是说，每一步都 +200毫秒
            }

            // 下面用Promise 的then()链实现
            function doIt() {
                console.time('doIt')
                const time1 = 300;
                step1(time1)
                    .then(time2 => step2(time2)) // 将第一步的500毫秒再调用
                    .then(time3 => step3(time3)) // 将第二步的700毫秒再调用
                    .then(result => {
                        console.log(`result is ${result}`); // 这里打印了第三步的900毫秒
                        console.timeEnd('doIt');
                    })
            }
        结果如下：
            // step1 with 300
            // step2 with 500
            // step3 with 700
            // result is 900
            // doIt: 1507.251ms  一共执行了1+2+3步 1.5s

            说实话可以看出then链的调用依然不好维护，下个then中函数的参数是上一个resolve的结果（初期就很混乱，现在好点了）

            // 而用async/await 来实现
            async function doIt() {
                console.time('doIt')
                const time1 = 300
                const time2 = await step1(time1);
                const time3 = await step2(time2);
                const result = await step3(time3);
                console.log(`result is ${result}`);
                console.timeEnd('doIt')
            }

            这么写下来简直不要太容易阅读，，代码犹如同步代码一样清晰，免得再一个个看then链。

        因此解决了then()链的死穴，就是参数传递和then()链调用。

            // 若更恶心一点每一步骤都需要 每个执行过步骤的结果（即之前所有步之和 —— 累和）
            function step1(n) {
                console.log(`step1 with ${n}`);
                return takeLongTime(n);
            }

            function step2(n, m) {
                console.log(`step2 with ${n + m}`);
                return takeLongTime(n + m);
            }

            function step3(n, m, k) {
                console.log(`step3 with ${n + m + k}`)
                return takeLongTime(n + m + k)
            }

            //利用then链的恶心写法
            function doIt() {
                console.time('doIt');
                const time1 = 300;
                step1(time1)
                    .then(time2 => {
                        return step2(time1, time2)
                            .then(time3 = [time1, time2, time3])    // 这里一开始没看明白，time1是300 time2是500 time3是1000
                    })                                              // then链传参的恶心之处。只要用then就能获取返回的值因此time3是1000
                    .then(times => {
                        const [time1, time2, time3] = times;        // 将传过来的参数解构赋值
                        return step3(time1, time2, time3);
                    })
                    .then(result => {   // 这里的result无疑就是之前的总和，上一步的返回值，即 (300 + 500 + 1000 + 200) = 2000
                        console.log(`result is ${result}`);
                        console.time('doIt');
                    })
            }

        不得不说，若繁琐的业务代码用then链写，就能给人恶心坏了，还好有async/await !

三、理解 async/await 和 promise 的执行顺序

    1.Js的问题
        首先要牢记两点：
            <1> JS是单线程语言
            <2> JS的event Loop 即是JS的执行机制，深入了解JS的执行，即了解了JS中的事件循环机制

        1.为啥js是单线程的？
            试想一下浏览器的js是多线程他们对同一个Dom进行操作，一个删除了该dom，一个对该dom进行编辑，浏览器如何执行

        2.js为啥要异步？
            若只能顺序执行，若上一行的解析时间很长，后面的代码会卡死，影响体验。

        3.js的单线程是如何实现异步的呢？
            事件循环机制

    2.JS的执行机制（事件循环）
        console.log(1);
        setTimeout(function () {
            console.log(2)
        }, 0)
        console.log(3)  // 得到结果1 3 2
        对于这类像sleep一样的阻塞代码，js会让先去执行后面的代码直到刚才那类代码条件满足，对于这类代码称为异步代码
        因此JS的第一步就是先把任务分为同步任务和异步任务

        <1> JS判断同步异步，若同步进入主线程，异步就进入event table
        <2> 异步任务在event table中注册函数，当满足触发条件后会再次被推进event queue
        <3> 同步任务在主线程会一直顺序执行，当空闲是才会去event queue查看是否有可执行的任务，若有则推入主线程中

        以上三步循环执行则就是 Event Loop。

        注意：
            所有同步任务都指的是在主线程上排队执行的任务形成一个【执行栈】，而异步任务是不进入主线程而进入【任务队列】的任务，只有
            【任务队列】通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行任务。

    3.JS真正的执行机制
        上面的分析是错误的，真正的Event Loop不是这样进行划分的
        setTimeout(function () {
            console.log('定时器开始了')
        },0)

        new Promise(resolve => {
            console.log('马上执行for循环了')
            for (let i = 0; i < 999; i++){
                i == 99 && resolve()
            }
        }).then(function() {
            console.log('执行then函数')
        })

        console.log('代码执行结束')
        按照2中的分析，执行顺序为 马上执行for循环了 -> 代码执行结束 -> 定时器开始了 -> 执行then函数了

        然而结果则是：马上执行for循环了 -> 代码执行结束 -> 执行then函数了 -> 定时器开始了

        难道异步任务的执行顺序不是顺序执行，而是另有规定？不是，而是划分规则有误

        异步代码正确的划分方式为：
            <1> macro-task(宏任务): 包含整体代码、setTimeout、setInterval
            <2> micro-task(微任务): Promise，process.nextTick

        事件循环的执行流程：
            宏任务 -> 执行完成 -> 有无微任务？-> 有 -> 执行微任务 -> 开始执行新的宏任务
                                            -> 无 -> 开始执行新的宏任务

        - 当执行一个宏任务时，过程中遇到微任务，就放入微任务的 【事件队列】 中。
        - 当宏任务执行完成后，检查是否微任务的 【事件队列】 ，若有则将里面的微任务全部执行完。

        因此将2、3结合才是真正的Event Loop

        <1> 当遇到异步代码setTimeout时，放入下一次将要执行的【宏任务队列】

        <2> 遇到new Promise 主线程执行内容，打印 "马上执行for循环"

        <3> 与到then() 方法，判断为微任务，放入下一次要执行的【微任务队列】

        <4> 主线程执行 打印 "代码执行结束"，此时本轮宏任务执行完成，检查微任务队列

        <5> 检查到刚刚加如的then()里的微任务，执行函数并打印 "执行then函数了"， 之后微任务执行完成，本轮的Event loop执行完成

        <6> 下一轮循环中，开始执行刚刚添加的宏任务，找到【宏任务队列】 中的setTimeout函数，打印 "定时器开始啦"，代码运行完毕。

    4.谈谈setTimeout:
        通常来说: 我们任务时 n秒后,会执行setTimeout里的那个函数
        其实不然，正确来说，是n秒后setTimeout()里面的 函数会被推到 event queue中，而【事件队列】中的任务，只有在主线程空闲时才会执行

四、数组遍历中 Promise 的解析：

    由于经常会遇到循环调用一个异步函数，但比如 data = ._map(data, (item) => { 一系列转化，中间用到async函数 }) 结果data已经
    提前返回了Promise <pending> 对象，因此导致拿不到数据。（尤其是当前函数需要返回的是实际值，非Promise对象时很头疼）

    1.map：
        map可以说是对Promise最友好的函数之一了。它接收两个参数，对每项元素执行回调，回调的返回值作为数组中相应下标的元素。
        若遍历内部需要async函数，需要将map的回调参数变为 [Array].map(async item => item)
        此时，不出意外会返回数组长度的[Promise对象]。

        解析：
            我们知道，Promise中有一个函数Promise.all()会将由一个Promise组成的数组依次执行，并返回一个Promise对象，该对象的结果
            为Promise产生的结果集

        修改：
            await Promise.all([Array].map(async item => item))
            用all方法对数组进行包装，然后用await获取结果，就可以拿到Promise对象中存储的实际值

    2.reduce、reduceRight:
        累加器，array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
            total           初始值（必），或者计算结束后的返回值。
            currentValue	当前元素（必）。
            currentIndex	当前元素的索引（选）。
            arr             当前元素所属的数组对象（选）。
            initialValue	传递给函数的初始值（选）。

        通常： [1,2,3].reduce((accumulator,item) => accumulator + item, 0)
        若加的这个操作是个异步的：在加函数前加上 async 变为异步，此时得到一个诡异的Promise对象 "[object Promise]3"

        原因： 对于上述代码，reduce内部的函数进行形变
            (accumulator, item) => new Promise(resolve => resolve(accumulator += item))
            就是说reduce内部的回调函数返回值其实是一个Promise对象，然后对对象进行了+ 操作，结果就怪异了。

        调整：
            首先要让返回值不是一个Promise对象，返回值前面要加await，因为执行完后整体也是返回Promise对象，因此最外层也要添加await
            await [1,2,3].reduce(async (accumulator,item) => await accumulator + item, 0) 注： 异步函数中

    3.forEach:
        作为用的最多的遍历方法，array.forEach(function(currentValue, index, arr), thisValue)
            currentValue	必需。当前元素
            index	        可选。当前元素的索引值。
            arr	            可选。当前元素所属的数组对象。
            thisValue	    可选。传递给函数的值一般用 "this" 值。如果这个参数为空， "undefined" 会传递给 "this" 值（this指向）

        通常：[1,2,3].forEach(item => { console.log(item ** 2) }) 若遇到了Promise 函数前加 async 则得到noting
            forEach并不关心回调函数的返回值，只是普通的执行了3个会返回Promise对象的函数。

        增强属性：（重新函数）
            Array.prototype.forEachSync = async function (callback, thisArg) {
                // 这里this应该是指代Array （传入的参数为数组,因为是数组的属性增强）
                for (let [index, item] of Object.entries(this)) {
                    await callback(item, index, this)
                }
            }
            await [1,2,3].forEachSync(async item => { console.log(item ** 2) })
            await 会忽略非Promise值，await 0、await undefined与普通代码无异

    4.filter:
        作为一个筛选数组用的函数，同样具有遍历的功能（参数参考3 和 forEach 一致）

        通常：若要筛选数组中的奇数，[1,2,3].filter(item => item % 2 !== 0), 若改为Promise版本，函数前加await，会使整个筛选
            的功能失效，因为每次返回一个Promise对象与预期不匹配，不能将返回值有效转化为true导致的（Promise对象必然都是True）。

        取巧...：（增强属性）
            Array.prototype.filterSync = async function (callback, thisArg) {
                let filterResult = await Promise.all(this.map(callback))
                // this 为传入数组，callback 为传入回调，利用1的map改写，返回 [true, false, true] 的数组值
                return this.filter((_, index) => filterResult[index]) //this 指代数组
            }
            await [1,2,3].filterSync(item => item % 2 !== 0)
            以上做法就是直接在内部调用map方法，map改动取巧拿到返回值（难道不能直接用map吗），之后对原数组每一项返回拿到的下标即可。

    some、every等等一系列遍历相关的基本都要增强扩展，自己实现。reduce的结果很像一个洋葱模型
    参考：https://www.jianshu.com/p/4c9360f9d8bd 有空再填
