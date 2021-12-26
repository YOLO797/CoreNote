---
title: ECMAScript基础上
order: 1

group:
  title: ECMAScript
  order: 12
---

ECMAScript:
JavaScript 的创造者 Netscape 公司，提交给标准化组织 ECMA，之后 ECMA 规定了浏览器脚本语言的标准，并将这种语言称为 ECMAScript。
该标准从一开始就是针对 JavaScript 语言制定的，因此在之后，这门语言的制定者是 ECMA。

初识 ES6： http://es6.ruanyifeng.com/#docs/intro（详情参考）
自从 2011 年发布了 ECMAScript 5.1 版后开始制定了 6.0 版，因此，ES6 这个词的原意，就是指 JavaScript 语言的下一个版本。
简称 ES2015 是因为其在 2015 年 6 月发布。Node 是 JavaScript 的服务器运行环境（runtime）。它对 ES6 的支持度更高。

    Babel 转码器：http://babeljs.io/docs/en
        是一个广泛使用的 ES6 转码器，可以将 ES6 代码转为 ES5 代码，从而在现有环境执行。这意味着，你可以用 ES6 的方式编写程序，
        又不用担心现有环境是否支持。不仅如此它还支持转换JSX、React等
            如：// 转码前
                input.map(item => item + 1);

                // 转码后
                input.map(function (item) {
                  return item + 1;
                });
        上面的原始代码用了箭头函数，Babel 将其转为普通函数，就能在不支持箭头函数的 JavaScript 环境执行了。

    .babelrc：
        Babel 的配置文件，存放在项目的根目录下。使用 Babel 的第一步，就是配置这个文件。该文件用来设置转码规则和插件，基本格式如下。
        {
          "presets": ["es2017", "es2016"],        //presets字段设定转码规则
          "plugins": ["transform-es2015-modules-commonjs"]
        }

    命令行转码babel-cli：
        Babel 提供babel-cli工具，用于命令行转码。    npm install --global babel-cli

一、基本语法：
1.let 和 const：
var 定义的变量有许多缺陷，因此 es6 中用 let 和 const 代替，var 的缺陷比如：

        变量提升：
            console.log(foo)    //输出undefined
            var foo = 2

        全局范围：var a = []
            for (var i = 0; i < 10; i++) {
                a[i] = function() {
                    console.log(i)  //调用10个方法，打印结果都是10 i为全局变量
                };
            }

        因此对于声明变量要利用let，而for循环计数器很好契合了let。let命令也有以下特征：

        let、const的暂时性死区TDZ：
            只要块级作用域内存在，其声明的变量就会binging（绑定）这个区域，不受外部影响。
            若声明let 的变量之前 typeof 了该变量，则出现错误（没有let之前typeof是百分百安全的操作）

        不允许重复声明：
            let不允许在相同作用域内，重复声明同一个变量。

        const声明只读常量：
            类似C的只读常量，真正常量为#define。若更改会报错，也意味着const一旦声明必须赋值，变量指向的内存地址不能改变。
            假设指向了一个对象：
                const foo = {} foo.prop = 123 //给对象赋值是可以的，但不能
                foo = {} //直接指向另一个空对象。

            因此它不能保证指向的数据结构是否可变。若真想把对象冻结，使用 object.freeze 方法:
                const foo = object.freeze()     //之后 foo.prop = 123 在严格模式下报错。

        声明变量六种方法：
            除了es5的：var、function、之外。es6不仅有：let、const、还有：import、class 共六种。

        顶层对象属性：
            浏览器的上下文（环境）中指 window 对象。Node中指 global 对象。在es5中顶层对象的属性赋值与全局变量赋值是一回事。这是js
            最大败笔之一。编译时不报未声明错误就是顶层对象导致的。和JAVA的Object类不同，这里顶层对象 window 有实体含义，不合适。

            ES6为了兼容，规定var、function命令声明全局变量，其余使用let、const、class声明的变量不属于 全局/顶层 变量。

        global对象：
            node里面，顶层对象只有global，没有window，没有self。因此同一段代码为了能在各种环境下取得顶层变量一般使用的是this变量，
            但存在局限性。

            <1>: 全局环境中this取得的是顶层对象，但在node和es6中this取得的是当前模块。
            <2>: 函数中的this，若不是作为对象的方法运行，而是单纯作为函数运行，this会指向顶层对象。
            <3>: 无论严格模式还是普通模式 new Function('return this')()，总是会返回全局对象。

            垫片库system.global模拟了这个提案，可以在所有环境拿到global。
                // CommonJS 的写法
                require('system.global/shim')();

                // ES6 模块的写法，可以保证各种环境里面，global对象都是存在的。
                import shim from 'system.global/shim'; shim();


    2.变量的解构赋值：
        ES6 中允许按照一定模式解构并进行赋值（和py类似，但这是是根据其他类型进行解构）属于 "匹配模式"

        数组解构赋值：
            let [a, b, c] = [1, 2, 3]   //从数组中提取每个元素进行赋值，只要两边模式相同，左边的变量就会赋予对应的值。

            注意：
                不完全解构也可以赋值成功，若不成功则提示undefined。等号右边的值 本身、转为对象 以后不具备Iterator（迭代器）接口，
                不能进行正确赋值。

        默认值：
            解构赋值中允许指定默认值，如：
                let [foo = true] = []; // true
                let [x, y = 'World'] = ['Hello', undefined] //x = 'Hello', y = 'World'

            注意：
                ES6内部严格使用 === 运算符，判断一个位置是否有值。因此只有成员 === undefined 才会使默认值生效。若：
                let [x = 1] = [null];   //x = null 此时默认值不会生效 x直接为null
                若默认值为惰性表达式，该默认值也不会生效

        对象的解构赋值：
            与数组不同的是对象是无序的（同py）。因此变量必须与属性同名才能取到正确的值。如：
            let { foo, bar } = { bar: 'bbb', foo: 'aaa' }   // 若无同名属性则 undefined，再如：
            let obj = { first: "hello", last: 'world'}
            let { first: f, last: l} = obj  // f = 'hello' l = 'world'

            因此说明，实际是下面形式的简写：
            let { foo: foo, bar: bar } = { foo: "aaa", bar: "bbb" };

            对象的解构指定默认值：
            let {x: y =3} = {x: 5}    // y = 5  同上，默认值生效条件是为undefined

            若解构模式为嵌套对象，子对象的所在的属性父对象中不存在，则报错：
            let {foo} = {bar: "bbb"}    // foo解构失败 undefined
            let {foo: {bar}} = {bar: "bbb"}    // foo报错

            let {foo: {bar}} = {foo: {bar: "bbb"}}    // foo报错,获取不到foo，正确做法如下
            let {foo, foo: {bar}} = {foo: {bar: "bbb"}}    // foo = {bar: "bbb"} bar = "bbb"

        函数参数的解构赋值：
            function move({x = 0,y = 0} = {})   //给参数的变量设置默认值
            function move({x, y} = {x:0, y:0})  //给参数设置默认值
            注意：
                上面的函数参数是对象，第二种是对整个对象设置的默认值。因此若给出{} 空参数则默认不走默认值，由于空参数使值为undefined

        用途：
            1.交换变量                      [x, y] = [y, x]
            2.从函数返回多个值               let [a,b,c] = example()
            3.函数参数的定义
                function f([x, y, z]) { ... }   //数组有次序
                f([1, 2, 3]);
                function f({x, y, z}) { ... }   //对象无次序
                f({z: 3, y: 2, x: 1});
            4.提取 JSON 数据：
                let jsonData = {
                  id: 42,
                  status: "OK",
                  data: [867, 5309]
                };

                let { id, status, data: number } = jsonData;
            5.函数参数的默认值
                jQuery.ajax = function (url, {
                  async = true,
                  beforeSend = function () {},
                  cache = true,
                  complete = function () {},
                  crossDomain = false,
                  global = true,
                  // ... more config
                } = {}) {  // ... do stuff  };      避免了在函数体内部再写var foo = config.foo || 'default foo';这样的语句。
            6.遍历 Map 结构
                任何部署了 Iterator 接口的对象，都可以用for...of循环遍历。Map 结构原生支持 Iterator 接口，配合变量的解构赋值，
                获取键名和键值就非常方便。
                for (let [key, value] of map) 或是单获取键或值 let [key] of map     let [,value] of map
            7.输入模块的指定方法
                加载模块时往往需要指定输入那些方法。解构赋值使得输入语句非常清晰
                const { SourceMapConsumer, SourceNode } = require("source-map");


    3.字符串的扩展：
        字符的Unicode表示法：
            js中允许用 \uxxxx 表示一个字符，但局限于0000~ffff中若超范围如\u20bb7 则由于 20bb 不可打印 结果为 " 7" 空字符 + 7
            es6中优化 把字符放入{}即可解析 {\u20bb7} 大括号表示法与四字节的 UTF-16 编码是等价的。

        codePointAt():
            JavaScript 内部，字符以 UTF-16 的格式储存，每个字符固定为2个字节。对于那些需要4个字节储存的字符（Unicode 码点大于0xFFFF
            的字符），JavaScript 会认为它们是两个字符。对于汉字这种4个字节的字符，JavaScript 不能正确处理.
            ES6 提供了codePointAt方法，能够正确处理 4 个字节储存的字符，返回一个字符的码点。如
                let s = "𠮷a";
                s.codePointAt(0)    //134071

            codePointAt方法的参数，是字符在字符串中的位置（从 0 开始）。
            上面代码中，JavaScript 将 "𠮷a" 视为三个字符，codePointAt 方法在第一个字符上，正确地识别了 "𠮷" ，返回了它的十进制码点
            134071（即十六进制的20BB7）。在第二个字符（即 "𠮷" 的后两个字节）和第三个字符 "a" 上同。

            codePointAt方法返回的是码点的十进制值，如果想要十六进制的值，可以使用toString方法转换一下。如
                s.codePointAt(0).toString(16) // "20bb7"    s.codePointAt(2).toString(16) // "61"

            但上述的a按理在第一位却要传入2 ，解决这种问题，则利用for of
                for (let ch of s) { console.log(ch.codePointAt(0).toString(16)) }   //会正确识别32为的UTF16字符

            codePointAt方法是测试一个字符由两个字节还是由四个字节组成的最简单方法。
                function is32Bit(s) { s.condePointAt(0)> 0xffff}

        String.fromCodePoint():
            可以识别大于0xFFFF的字符,正好与codePointAt方法相反。如：
                String.fromCodePoint(0x78, 0x1f680, 0x79) === 'x\uD83D\uDE80y'  // true
            如果String.fromCodePoint方法有多个参数，则它们会被合并成一个字符串返回。

            注意：fromCodePoint方法定义在String对象上，而codePointAt方法定义在字符串的实例对象上。

        字符串的遍历器接口：
            ES6 为字符串添加了遍历器接口，使字符串可以使用for of 遍历。除了遍历字符串，这个遍历器最大的优点是可以识别大于0xFFFF的
            码点，传统的for循环无法识别这样的码点。（因此碰到遍历字符串，首先想到for of）

        normalize()：详情见文档。欧洲重音符合等也许会用到。

        includes(), startsWith(), endsWith()：
            JavaScript 只有indexOf方法，可以用来确定一个字符串是否包含在另一个字符串中。
            es6中
                - includes()：传入字符串，返回布尔值，表示是否找到了参数字符串。
                - startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部。
                - endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。
            这三个方法都支持第二个参数，表示开始搜索的位置。

        repeat()：
            repeat方法返回一个新字符串，表示将原字符串重复n次。若参数为小数则配取整。如：
                'na'.repeat(2.9)    // 'nana'

            若参数是负数或Infinity 报错。0 ~ -1 间小数等同于0 则返回 ''。NaN等同0。字符串参数转为数字，若转化后不是数字则返回 ''。

        padStart()，padEnd()：
            ES2017 引入了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。padStart()用于头部补全，padEnd()
            用于尾部补全。如：
                x.padStart(5,'ab')  //ababx     在头部用'ab'补全到长度5

            第一个参数用来指定字符串的最小长度，第二个参数是用来补全的字符串。如果原字符串的长度，等于或大于指定的最小长度，
            则返回原字符串。若用于补全的字符串超了最小长度，会截去超出位数的补全字符串。省略第二个参数，默认使用空格补全长度。
            用途：
                padStart的常见用途是为数值补全指定位数。    '12'.padStart(10, '0') // "0000000012"
                另一个用途是提示字符串格式。                '09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"

        matchAll()：返回一个正则表达式在当前字符串的所有匹配，详见正则

        模板字符串：
            模板字符串（template string）是增强版的字符串，用反引号（`）标识。它可以当作普通字符串使用，也可以用来定义多行字符串，
            或者在字符串中嵌入变量。如：
            let name = "Bob" , time = "today";
            `Hello ${name}, how are you ${time}?`   //避免使用 + 进行拼接

            若需要表示反引号则用\。 如： let greeting = `\`Yo\`

            使用模板字符串表示多行字符串，所有的空格和缩进都会被保留在输出之中。若不想要其中的换行，可以使用``.trim()方法消除它。
            大括号内部可以放入任意的 JavaScript 表达式，可以进行运算，以及引用对象属性，还可以调用函数。若括号的值不是字符串会转化。
            注意：
                这里和jsx不同，jsx是允许html和js代码混合无需`${}`而是用{}进入js的上下文。这里是es6的字符串扩展。

        模板编译：
            包含模板字符串的限制，详情见文档，正则解析，用到了再说。



        标签模板:
            若模板字符串跟在一个函数名之后便具有标签模板的功能。如下：
                let total = 30;
                let msg = passthru`The total is ${total} (${total*1.05} with tax)`;
                function passthru(literals,...value){
                    literals：这个参数是数组，指模板成员中没有替换的部分。变量替换只会发生在前一个与后一个成员之间，这里中间若再加
                        ${total} 在 "(" 之前，那么数组中用 " " 代替没有替换的部分。raw属性保存的则是转义后的原字符串。

                    value：这是后续参数，可以用...获取多个，会依次接收替换后的部分
                }
            应用：
                1.过滤 HTML 字符串，防止用户输入恶意内容（XSS攻击）。如：
                    let message = SaferHTML`<p>这里面可能有恶意代码，比如${sender}.</p>`;
                    其中sender参数往往是用户提供的 var sender = '<script>alder(1)</script>'
                    function SaferHTML(templateData) {
                      let s = templateData[0];
                      for (let i = 1; i < arguments.length; i++) {
                        let arg = String(arguments[i]);

                        // 利用正则表达式转义特殊字符
                        s += arg.replace(/&/g, "&amp;")
                                .replace(/</g, "&lt;")
                                .replace(/>/g, "&gt;");

                        s += templateData[i];
                      }
                      return s;
                    }

                2.标签模板的另一个应用，就是多语言转换（国际化处理）。
                    模板字符串不能替代模板库，没有if、for等功能，但是通过标签函数可以自己添加这些功能（自己写解析字符串的对应函数，
                    利用正则，十分麻烦。不推荐）。

                    推荐做法：
                        使用标签模板，在 JavaScript 语言之中嵌入其他语言。jsx 即是如此实现的，实现源码如下：
                        https://gist.github.com/lygaret/a68220defa69174bdec5（大致是先转个文档在转为Reactdom，没深究）

        String.raw()：
            充当模板字符串的处理函数，返回一个斜杠都被转义（即斜杠前面再加一个斜杠）的字符串，对应于替换变量后的模板字符串。

    4.正则的扩展：
        正则的构造函数：
            new RegExp()：相比es5更灵活，俩参数都是字符串，第一个是字符串表达式，第二个是字符串修饰符。或 第一个参数是正则表达式，
                第二个参数是修饰符，但会替换表达式中的。

        字符串的正则方法：
            字符串对象共有 4 个方法，可以使用正则表达式：match()、replace()、search()和split()。内部全部调用RegExp的实例方法，
            从而做到所有与正则相关的方法，全都定义在RegExp对象上。
            match():
                可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。该方法类似 indexOf() 和 lastIndexOf()，但是它返回
                指定的值，而不是字符串的位置。（返回位置利用reg.exec(str).index也可以实现）
                stringObject.match(searchvalue) 找到一个符合字符串的字符串
                stringObject.match(regexp)      找到一个符合正则表达式的字符串

        u 修饰符：
            Unicode 模式，用来正确处理大于\uFFFF的 Unicode 字符。会正确处理四个字节的 UTF-16 编码。
            只要构造正则表达式时加上 u 修饰符号，即可校验UTF-16编码字符。

        点字符：
            点（.）字符在正则表达式中，含义是除了换行符以外的任意单个字符。对于码点大于0xFFFF的 Unicode 字符，点字符不能识别，
            必须加上u修饰符。

        Unicode 字符表示法：
            ES6 新增了使用大括号表示 Unicode 字符，这种表示法在正则表达式中必须加上u修饰符，才能识别当中的大括号，否则会被解读为量词。

        量词:
            使用u修饰符后，所有量词都会正确识别码点大于0xFFFF的 Unicode 字符。

        预定义模式:
            \S是预定义模式，匹配所有非空白字符。只有加了u修饰符，它才能正确匹配码点大于0xFFFF的 Unicode 字符。
            利用这一点，可以写出一个正确返回字符串长度的函数。（怎么写自己想）

        i 修饰符：
            有些 Unicode 字符的编码不同，但是字型很相近，比如，\u004B与\u212A都是大写的K。不加u修饰符，就无法识别非规范的K字符。
            因此修饰符为 iu

        y 修饰符：
            叫做 "粘连"（sticky）修饰符。作用与g修饰符类似，也是全局匹配，后一次匹配都从上一次匹配成功的下一个位置开始。g对下个字符
            没有要求，y若不指定优先匹配下个字符。即每次匹配，都是从剩余字符串的头部开始。（找到匹配字符串，记录位置并返回）
            示例：
                const REGEX = /a/gy;                'aaxa'.replace(REGEX, '-') // '--xa'

                'a1a2a3'.match(/a\d/y) // ["a1"]    'a1a2a3'.match(/a\d/gy) // ["a1", "a2", "a3"]
                单一个y修饰符对match方法（特殊，返回也奇怪），只能返回第一个匹配，必须与g修饰符联用，才能返回所有匹配。

            注意：
                从字符串中提取 token（词元）使用 tokenize(reg, str) 通常g匹配的会忽略非法字符 3x + 4 -> 3 + 4 ，而y则不会

        RegExp.prototype.sticky：
            与y修饰符相匹配，ES6 的正则实例对象多了sticky属性，表示是否设置了y修饰符。

        RegExp.prototype.flags 属性：
            ES6 为正则表达式新增了flags属性，会返回正则表达式的修饰符。

        s 修饰符：dotAll 模式：
            点（.）修饰符 难以判断换行符\n 如： /foo.bar/.test('foo\nbar') 。因此利用 ES2018 引入的 s 修饰符，使得.可以匹配任意
            单个字符。称为dotAll模式，即点（dot）代表一切字符。还引入了dotAll属性，返回一个布尔值，表示该正则表达式是否处在dotAll模式。

        后行断言：
            "先行断言" 指的是，x只有在y前面才匹配，必须写成/x(?=y)/。"先行否定断言" 指的是，x只有不在y前面才匹配，必须写成/x(?!y)/。
            "后行断言" 正好与“先行断言”相反，x只有在y后面才匹配，必须写成/(?<=y)x/。

        Unicode 属性类:
            ES2018 引入了一种新的类的写法\p{...}和\P{...}，允许正则表达式匹配符合 Unicode 某种属性的所有字符。很nb，甚至能匹配
            罗马字，如：
                const regex = /^\p{Number}+$/u;     regex.test('ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫ') // true

        具名组匹配：
            类似Django的命名分组，ES2018 引入了具名组匹配（Named Capture Groups），允许为每一个组匹配指定一个名字，既便于阅读
            代码，又便于引用。使用圆括号进行组匹配。如：
                const RE_DATE = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;

                const matchObj = RE_DATE.exec('1999-12-31');
                const year = matchObj.groups.year; // 1999
                const month = matchObj.groups.month; // 12
                const day = matchObj.groups.day; // 31

        解构赋值和替换：
            let {groups: {one, two}} = /^(?<one>.*):(?<two>.*)$/u.exec('foo:bar');
            表达式右边 ret.groups.one = foo  ret.groups.tow = bar .* 进行全匹配后：又匹配 因此解构赋值结果 one：foo two：bar

            let re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/u;
            '2015-01-02'.replace(re, '$<day>/$<month>/$<year>')     //'02/01/2015'
            先用re和字符串匹配，得到group下匹配好的值，之后进行替换即可

        String.prototype.matchAll:
            正常遍历匹配后的结果利用while + exec 进行遍历，而string.matchAll(regex)返回的是迭代器,如果匹配结果是一个很大的数组，
            那么使用matchAll + for of 比较节省资源。


    5.数值的扩展
        Number.isFinite(), Number.isNaN()：
            检查一个数值是否为有限，一个值是否为NaN

        Number.parseInt(), Number.parseFloat()：
             将全局方法parseInt()和parseFloat()，移植到Number对象上面，行为完全保持不变。

        Number.isInteger()：
            判断一个数值是否为整数。有精度，小数点后16个十进制位，转成二进制位超过了53个二进制位，校验失败。

        安全整数和 Number.isSafeInteger()：
            整数范围在-2^53到2^53之间（不含两个端点），超过这个范围，无法精确表示这个值。
            ES6 引入了Number.MAX_SAFE_INTEGER和Number.MIN_SAFE_INTEGER这两个常量，用来表示这个范围的上下限。用于判断。

        Math扩展：
            Math.sign()：判断一个数到底是正数、负数、还是零。
            Math.clz32()：返回一个数的 32 位无符号整数形式有多少个前导 0。

        指数运算符：
            ES2016 新增了一个指数运算符（**）。同py。


    6.函数的扩展：
        参数默认值：
            ES6 允许为函数的参数设置默认值，即直接写在参数定义的后面。解构赋值见上文
            参数默认值的位置 与py同，如果非尾部的参数设置默认值，实际上这个参数是没法省略的。

        函数的 length 属性：
            函数的length属性，将返回没有指定默认值的参数个数。

            注意：
                指定了默认值后，length属性将失真。如果设置了默认值的参数不是尾参数，那么length属性也不再计入后面的参数了。

        作用域：
            参数默认值包含在函数作用域内，同py。
            let x = 1;
            function f(y = x) {
              let x = 2;
            }   // 函数f调用时，参数y = x形成一个单独的作用域。这个作用域里面，变量x本身没有定义，所以指向外层的全局变量x。

            let foo = 'outer'
            function bar(func = () => foo) {}   // 函数默认值是匿名函数，返回变量foo，foo为 指向外部变量 因此输出'outer'。
            若将参数的默认值指定为undefined，表名这个参数是可以省略的


        rest参数：
            ES6 引入 rest 参数（形式为...变量名）用于获取函数的多余参数，这样就不需要使用arguments对象了。理解为*args
            rest参数就是数组，数组的特有方法都可以使用。和*args 同的是，后面也不可以接正常的参数。函数的length属性也不包含。

        严格模式：
            函数内部可设置为严格模式 'use strict'; 但是函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定
            为严格模式

        name属性：
            es6的name属性，可以在匿名下返回函数名。构造函数返回的 (new Function).name // 是"anonymous"

        箭头函数：
            ES6 允许使用 "箭头"（=>）定义函数。如：
                var f = v => v;
                var f = function (v) { return v; };

            如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分。
                var f = () => 5;    //  等同于
                var f = function () { return 5 };

                var sum = (num1, num2) => num1 + num2;  //  等同于
                var sum = function(num1, num2) { return num1 + num2; };

            如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用return语句返回。 => {... return ...}

            由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号，否则会报错。
                let getTempItem = id => ({ id: id, name: "Temp" });

            箭头函数可以与变量解构结合使用。
                const full = ({ first, last }) => first + ' ' + last;

            箭头函数的一个用处是简化回调函数。
                正常函数写法：
                    [1,2,3].map(function (x) {
                        return x * x;
                    });

                箭头函数写法：
                    [1,2,3].map(x => x * x);
            或：
                var result = values.sort(function (a, b) {
                  return a - b;
                });

                var result = values.sort((a, b) => a - b);

            和rest参数结合：
                const headAndTail = (head, ...tail) => [head, tail];
                headAndTail(1, 2, 3, 4, 5)      // [1,[2,3,4,5]]

            使用注意点：
                （1）函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。（因此定义对象的原型方法要使用箭头函数要在
                    对象内部定义，外部后续定义的this不指向原对象，而是window）

                （2）不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。

                （3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

                （4）不可以使用yield命令，因此箭头函数不能用作 Generator 函数。

            this对象的指向是可变的，但是在箭头函数中，它是固定的。如：
                function foo() {
                  setTimeout(() => {
                    console.log('id:', this.id);
                  }, 100);
                }

                var id = 21;

                foo.call({ id: 42 });
                foo调用了call方法，把原本指向全局的id改为了传入obj的id
                箭头函数生效是在foo函数生成时，才生效，箭头函数自己没有this，只能指向外层函数的this

            由于箭头函数没有自己的this，所以当然也就不能用call()、apply()、bind()这些方法去改变this的指向。（会无效）

        双冒号运算符：
            :: 为了取代call、apply、bind的调用。双冒号左边是一个对象，右边是一个函数。该运算符会自动将左边的对象，作为上下文环境
            （即this对象），绑定到右边的函数上面。

            foo = {"age":18}
            foo::bar;
            // 等同于
            bar.bind(foo);

        什么是尾调用:
            是函数式编程的一个重要概念，本身非常简单，一句话就能说清楚，就是指某个函数的最后一步是调用另一个函数。
            function f(x){
              return g(x);
            }   // 函数f的最后一步是调用函数g，这就叫尾调用。（只能是这种形式，无其他操作）

        尾调用优化：（ES6 的尾调用优化只在严格模式下开启，正常模式是无效的。）
            函数调用会在内存形成一个“调用记录”，又称“调用帧”，保存调用位置与内部变量。
            若函数A调用函数B，那么A的上方形成B的调用帧（多了形成调用栈），等到B结束后才会把结果返回A，此时B的调用帧才消失。

            尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用帧，因为调用位置、内部变量等信息都不会再用到了，只要直接用
            内层函数的调用帧，取代外层函数的调用帧就可以了。

            因此只要最后一步调用函数不再用到外层函数的变量，即可实现尾调用优化。如：
            function f() {
              let m = 1;
              let n = 2;
              return g(m + n);
            }
            f();
            // 等同于
            g(3);

        尾递归:
            函数调用自身，称为递归。如果尾调用自身，就称为尾递归。好处是不会栈溢出。

            普通：
                function factorial(n) {
                  if (n === 1) return 1;
                  return n * factorial(n - 1);
                }

            改写尾递归：
                function factorial(n, total) {
                  if (n === 1) return total;
                  return factorial(n - 1, n * total);
                }

            斐波那契-普通：
                function Fibonacci (n) {
                  if ( n <= 1 ) {return 1};
                  return Fibonacci(n - 1) + Fibonacci(n - 2);
                }   //  100即可栈溢出

            改写：
                function Fibonacci2 (n , ac1 = 1 , ac2 = 1) {
                  if( n <= 1 ) {return ac2};

                  return Fibonacci2 (n - 1, ac2, ac1 + ac2);
                }

            尾递归的实现，往往需要改写递归函数，确保最后一步只调用自身。做到这一点的方法，就是把所有用到的内部变量改写成函数的参数。

            若需要直观的话，就再提供一个正向形式的函数，调用改写后的尾递归

            更好的话可以利用函数式的柯里化（currying），思是将多参数的函数转换成单参数的形式。如：
            function currying(fn, n) {
              return function (m) {
                return fn.call(this, m, n); // fn -> this -> tailFactor  call方法传入参数，并执行函数 tailFactor(5,1)
              }; // 返回了一个函数给factorial 这个函数需要一个参数m 传入的是5
            }

            function tailFactorial(n, total) {
              if (n === 1) return total;
              return tailFactorial(n - 1, n * total);
            }

            const factorial = currying(tailFactorial, 1);

            factorial(5) // 120

            以上貌似不用call也行，直观还可以采用默认值。凡是使用递归就使用尾递归。

        正常模式的尾递归：
            蹦床函数（trampoline）可以将递归执行转为循环执行。
                function trampoline(f) {
                  while (f && f instanceof Function) {
                    f = f();
                  }
                  return f;
                }
            由于每次对返回新的函数行进执行，避免自己调自己使得栈过大。之后把递归函数改写为每一步返回另一个函数即可。


    7.数组的扩展：
        ES6中对数组进行了扩展，实现了 Iterator 接口的对象，和调用Iterator的Map 和 Set 结构，Generator （生成器）函数

        Array.from()：
            将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象，...扩展运算符也可以转换。
            可以接受第二个参数，作用类似于数组的map方法，对每个元素进行处理。
            适用：把类数组结构的转为数组，即可运用众多的数组方法。

        Array.of()：
            用于将一组值转化为数组，目的，是弥补数组构造函数Array()的不足（只有当参数个数不少于 2 个时，Array()才会返回由参数组成
            的新数组）。用于初始化

        copyWithin()：
            Array.prototype.copyWithin(target, start = 0, end = this.length)
            - target（必需）：从该位置开始替换数据。如果为负值，表示倒数。
            - start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示倒数。
            - end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示倒数。

            [1, 2, 3, 4, 5].copyWithin(0, 3) // [4, 5, 3, 4, 5]
            表示将从 3 号位直到数组结束的成员（4 和 5），复制到从 0 号位开始的位置，结果覆盖了原来的 1 和 2。

        find() 和 findIndex()：
            用于找出第一个符合条件的数组成员。它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为true的
            成员，然后返回该成员。如果没有符合条件的成员，则返回undefined。

            [1, 4, -5, 10].find((n) => n < 0)   // -5   找出数组中第一个小于 0 的成员。

            find方法的回调函数可以接受三个参数，依次为当前的值、当前的位置和原数组。

            findIndex方法的用法与find方法非常类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1。

            [1, 5, 10, 15].findIndex(function(value, index, arr) {
              return value > 9;
            })

            这两个方法可以接收第二个参数，表示回调函数的this对象。除此之外还可以发现NaN。

        fill()
            fill方法使用给定值，填充一个数组。fill(value,start,end)
            第二三个参数可以指定填充的值。
            注意：如果填充的类型为对象，那么被赋值的是同一个内存地址的对象，而不是深拷贝对象。

        entries()，keys() 和 values()：
            用于遍历数组。它们都返回一个遍历器对象，可以用for...of循环进行遍历，唯一的区别是keys()是对键名的遍历、values()是对键值
            的遍历，entries()是对键值对的遍历。
            如果不使用for...of循环，可以手动调用遍历器对象的next方法，进行遍历。
            注：这里是遍历数组的方法，keys返回的是位置

        includes():
            返回一个布尔值，表示某个数组是否包含给定的值。如：
            [1, 2, 3].includes(4)     // false
            第二个参数表示搜索的起始位置，默认为0。如果第二个参数为负数，则表示倒数的位置，如果这时它大于数组长度，会重置为从0开始。

            没有该方法之前，用indexOf方法有两个缺点，一是不够语义化，二是会有NaN误判

        flat()，flatMap()：
            [1, 2, [3, 4]].flat()
            flat()方法将子数组的成员取出来，添加在原来的位置。默认只会 "拉平" 一层，若多层嵌套将flat()传参数为想要拉平的整数即可。
            若无论多少层都转为一维数组，可以用Infinity关键字作为参数。如果原数组有空位，flat()方法会跳过空位。

            flatMap()方法对原数组的每个成员执行一个函数（相当于执行Array.prototype.map()），然后对返回值组成的数组执行flat()方法。
            该方法返回一个新数组，不改变原数组。flatMap()只能展开一层数组。

        数组的空位：
            指该位置上没有任何值，如Array(3)则会返回一个有三个空位的数组。空位不是undefined，undefined依然有值。如
            0 in [undefined]    // true 表示0位上依然有值
            0 in [ , , ,]   // false 表示0位上没有值了

            注意：
                ES6和5不同不会跳过空位，而是把空位转化为undefined，或是保留。空位的处理规则非常不统一，所以建议避免出现空位。


    对象的扩展：
        属性的简洁表示法：
            ES6 允许直接写入变量和函数，作为对象的属性和方法。这样的书写更加简洁。例：
            // 属性简写
            const foo = {querydata: querydata}  直接简写为 const foo = {querydata}

            //方法简写
            const o = {                         const o = {
                method: function() {}                method() {}    // 可以直接省略function
            }                                    }

            //实际情况
            let birth = '2000/01/01';
            const Person = {
              name: '张三',

              //等同于birth: birth
              birth,

              // 等同于hello: function ()...
              hello() { console.log('我的名字是', this.name); }
            };

            注意：
                简洁写法的属性名总是字符串，这会导致一些看上去比较奇怪的结果。
                如果某个方法的值是一个 Generator 函数，前面需要加上星号。yield
                const obj = {
                  * m() {
                    yield 'hello world';
                  }
                };

        属性名表达式：
            ES6中除了直接obj.foo = 123 定义对象属性外，还可以 obj["a" + "bc"] = 23 来用表达式作为属性名。

        方法的name属性：
            因为函数的name属性返回函数名，如obj对象中有sayName函数，那么obj.sayName.name 返回sayName。
            如果对象的方法使用了取值函数(getter)和存值函数(setter)，则name属性不是在该方法上面，而是该方法的属性的描述对象的get
            和 set属性上面，返回值是方法名前加上get和set。
            const descriptor = Object.getOwnPropertyDescriptor(obj, 'foo');
            descriptor.get.name // "get foo"

        Object.is()：
            ES5 比较两个值是否相等，只有两个运算符：相等运算符（==）和严格相等运算符（===）。它们都有缺点，前者会自动转换数据类型，
            后者的NaN不等于自身，以及+0等于-0。

            ES6 提出 "Same-value equality"（同值相等）算法，用来解决这个问题。
            Object.is用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致。
            不同之处只有两个：一是+0不等于-0，二是NaN等于自身。

        Object.assign()：
            用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。
            assign(target, source1, source2);
            第一个参数是目标对象，后面的参数都是源对象。若出现同名，后覆盖前。数值和布尔值会被忽略，只有字符串的包装对象才会产生可
            枚举的实义属性，不会拷贝不可枚举的属性。

            注意：其实该方法实行的是浅拷贝，若需要深拷贝可以用 Lodash 的_.defaultsDeep方法，得到合并。

        属性的可枚举性：
            对象的每个属性都有一个描述对象（Descriptor），用来控制该属性的行为。
            Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象。
            let obj = { foo: 123 };
            Object.getOwnPropertyDescriptor(obj, 'foo')
            //  {
            //    value: 123,
            //    writable: true,
            //    enumerable: true, //可枚举
            //    configurable: true
            //  }
            描述对象的enumerable属性，称为”可枚举性“，如果该属性为false，就表示某些操作会忽略当前属性。

            目前，有四个操作会忽略enumerable为false的属性。
            - for...in循环：只遍历对象自身的和继承的可枚举的属性。
            - Object.keys()：返回对象自身的所有可枚举的属性的键名。
            - JSON.stringify()：只串行化对象自身的可枚举的属性。
            - Object.assign()： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。

            其中，只有for...in会返回继承的属性，其他三个方法都会忽略继承的属性，只处理对象自身的属性。
            实际上，引入“可枚举”（enumerable）这个概念的最初目的，就是让某些属性可以规避掉for...in操作，不然所有内部属性和方法都会被遍历到。

        属性的遍历：
            ES6 一共有 5 种方法可以遍历对象的属性。
            （1）for...in
                for...in循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。

            （2）Object.keys(obj)
                Object.keys返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。

            （3）Object.getOwnPropertyNames(obj)
                Object.getOwnPropertyNames返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。

            （4）Object.getOwnPropertySymbols(obj)
                Object.getOwnPropertySymbols返回一个数组，包含对象自身的所有 Symbol 属性的键名。

            （5）Reflect.ownKeys(obj)
                Reflect.ownKeys返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

            以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。
             - 首先遍历所有数值键，按照数值升序排列。
             - 其次遍历所有字符串键，按照加入时间升序排列。
             - 最后遍历所有 Symbol 键，按照加入时间升序排列。

        Object.getOwnPropertyDescriptors()：
            会返回某个对象属性的描述对象（descriptor）。ES2017 引入了Object.getOwnPropertyDescriptors方法，返回指定对象所有
            自身属性（非继承属性）的描述对象。

        __proto__属性，Object.setPrototypeOf()，Object.getPrototypeOf()
            JavaScript 语言的对象继承是通过原型链实现的。ES6 提供了更多原型对象的操作方法。

            __proto__属性：
                __proto__属性（前后各两个下划线），用来读取或设置当前对象的prototype对象。
                标准明确规定，只有浏览器必须部署这个属性，其他运行环境不一定需要部署，而且新的代码最好认为这个属性是不存在的。因此，
                无论从语义的角度，还是从兼容性的角度，都不要使用这个属性，而是使用下面的Object.setPrototypeOf()（写操作）、
                Object.getPrototypeOf()（读操作）、Object.create()（生成操作）代替。

            Object.setPrototypeOf()：
                作用与__proto__相同，用来设置一个对象的prototype对象，返回参数对象本身。ES6 正式推荐的设置原型对象的方法。
                    let proto = {};
                    let obj = { x: 10 };
                    Object.setPrototypeOf(obj, proto);
                    proto.y = 20;
                    obj.y // 20
                将proto对象设为obj对象的原型，所以从obj对象可以读取proto对象的属性。

            Object.getPrototypeOf()：
                与Object.setPrototypeOf方法配套，用于读取一个对象的原型对象。
                    Object.getPrototypeOf(obj) === proto
                因为proto对象被设置为了obj对象的原型，因此为true

        super 关键字：
            我们知道，this关键字总是指向函数所在的当前对象，ES6 又新增了另一个类似的关键字super，指向当前对象的原型对象。
            const proto = {
              foo: 'hello'
            };

            const obj = {
              foo: 'world',
              find() {
                return super.foo;   //指向原型，找到当前对象的原型，获取原型的foo
              }
            };

            Object.setPrototypeOf(obj, proto);  //将当前对象obj的原型对象设置为proto
            obj.find() // "hello"   执行当前对象的find方法，找到了原型对象的值

            对象obj的find方法之中，通过super.foo引用了原型对象proto的foo属性，原型就好似父类。

        Object.keys()，Object.values()，Object.entries()：
            ES5 引入了Object.keys方法，返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键名。
            var obj = { foo: 'bar', baz: 42 };
            Object.keys(obj) // ["foo", "baz"] 和py不同，无需遍历，直接拿到所有key键的数组

            ES2017 引入了跟Object.keys配套的Object.values和Object.entries，作为遍历一个对象的补充手段，供for...of循环使用。

            注意：
                .values()是按照从小到大的键进行遍历的，且只返回自身可遍历的属性。会过滤属性名为 Symbol 值的属性。若参数不是对象，
                    会进行转换，若为数值或布尔，则返回空数组。
                .entries()还有个用途是将对象转为真正的Map结构
                    const map = new Map(Object.ertries(obj))
