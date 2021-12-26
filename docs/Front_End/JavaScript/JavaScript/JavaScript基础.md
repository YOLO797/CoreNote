---
title: JavaScript基础
order: 1
group:
  title: JavaScript
  order: 11
---

JavaScript：（懒得写啊 QAQ，）
一、JavaScript 概述：
JavaScript 的历史：
1.1992 年 Nombas 开发出 C-minus-minus(C--)的嵌入式脚本语言(最初绑定在 CEnvi 软件中).后将其改名 ScriptEase.(客户端执行的语言)
客户端语言:
server 端把代码发给客户端，客户端来解释 -- 这是与其他语言不一样的理念，基于这种理念就有了浏览器跟 js。
2.Netscape(网景 94 年)接收 Nombas 的理念,(Brendan Eich)在其 Netscape Navigator 2.0 产品中开发出一套 livescript 的脚本语言.Sun 和
Netscape 共同完成.后改名叫 Javascript（开始占有百分之九十的占有率，语言是让 sun 公司（斯坦福实验室）开发的，两个人写了两周）
JAVA 的亲爹是 JavaScript 的干爹 -- 两种语言唯一的关系 （firefox 的技术支持还是网景当时开源的，其实很好用） 3.微软随后模仿在其 IE3.0 的产品中搭载了一个 JavaScript 的克隆版叫 Jscript.（占有率第一后，太狂了，不更新了，不支持新特性） 4.为了统一三家,ECMA(欧洲计算机制造协会)定义了 ECMA-262 规范.国际标准化组织及国际电工委员会（ISO/IEC）也采纳 ECMAScript 作为标
准（ISO/IEC-16262）。从此，Web 浏览器就开始努力（虽然有着不同的程度的成功和失败）将 ECMAScript 作为 JavaScript 实现的基
础。EcmaScript 是规范.

    ECMAScript：
        尽管 ECMAScript 是一个重要的标准，但它并不是 JavaScript 唯一的部分，当然，也不是唯一被标准化的部分。实际上，一个完整的 JavaScript
        实现是由以下 3 个不同部分组成的：
            1.核心（ECMAScript）
            2.文档对象模型（DOM） Document object model (整合js，css，html)
            3.浏览器对象模型（BOM） Broswer object model（整合js和浏览器）（用于js和浏览器交互）
            .Javascript 在开发中绝大多数情况是基于对象的.也是面向对象的.
            基于对象和面向对象的区别：
                其实就是说使用对象，它语言中提供了很多创建好了的对象，我要做的就是使用这些对象，自己基本不用再去创建了。
                学的是它到底为我创建了那些对象，而它创建的对象到底有那些用（js中本身都没有对象这个概念）因此基于对象

        简单地说，ECMAScript 描述了以下内容：
            语法 类型 语句 关键字 保留字 运算符 对象 (封装 继承 多态) 基于对象的语言.使用对象.

    JavaScript的引入方式:
        {#1 直接编写#}
            <script>
                alert('hello igarashi')
            </script> -- 建议放到下面 body最下，因为放到上面可能未加载，习惯
        {#2 导入文件#}
            <script src="hello.js"></script>　

二、JavaScript 的基础：
2.1 变量：
在代数中，我们使用字母（比如 x）来保存值（比如 5）。
通过上面的表达式 z=x+y，我们能够计算出 z 的值为 11。
在 JavaScript 中，这些字母被称为变量。 0. 变量是弱类型的(很随便)； 1. 声明变量时不用声明变量类型. 全都使用 var 关键字;
var a; 2. 一行可以声明多个变量.并且可以是不同类型.
var name="igarashi", age=20, job="gamer"; 3. (了解) 声明变量时 可以不用 var. 如果不用 var 那么它是全局变量. 4. 变量命名,首字符只能是字母,下划线,$美元符 三选一，且区分大小写，x 与 X 是两个变量 5. 变量还应遵守以下某条著名的命名规则：
Camel 标记法:
首字母是小写的，接下来的字母都以大写字符开头。例如：
var myTestValue = 0, mySecondValue = "hi";
Pascal 标记法:
首字母是大写的，接下来的字母都以大写字符开头。例如：
Var MyTestValue = 0, MySecondValue = "hi";
匈牙利类型标记法: -- 通常用这个先小写字母表明类型
在以 Pascal 标记法命名的变量前附加一个小写字母（或小写字母序列），说明该变量的类型。例如，i 表示整数，s 表示字符串，如下所示“
Var iMyTestValue = 0, sMySecondValue = "hi";

    2.2 基础规范:
        1 每行结束可以不加分号. 没有分号会以换行符作为每行的结束
        2 注释 支持多行注释和单行注释. /* */  //

    2.3 常量和标识符:
        常量 ：直接在程序中出现的数据值

        标识符：
            1.由不以数字开头的字母、数字、下划线(_)、美元符号($)组成
            2.常用于表示函数、变量等的名称
                例如：_abc,$abc,abc,abc123是标识符，而1abc不是
            3.JavaScript语言中代表特定含义的词称为保留字，不允许程序再定义为标识符

    2.4 数据类型:(和java基本相同)
        JavaScript在内存维护着两个东西，一个叫堆内存，一个叫栈内存。js的数据类型分为两部分，一个是基本数据类型，一个是引用数据类型。

        引用数据类型：(object)
            比如var a = 3 它们这个数据类型在你创建时并不知道是什么数据类型，只有代码执行到这一部分，就会临时给它一个整型。此时整型放到
            堆内存里面去（基本数据类型都放到堆里面，存的是内存地址）这个地址会指向某一块对应的栈内存的对象，此时栈内存里面存的就是对应的数据
            因此把这个对应称为引用数据类型（堆内存引用栈内存） -- JAVA同理

        数字类型(Number)
        简介:
            最基本的数据类型
            不区分整型数值和浮点型数值
            所有数字都采用64位浮点格式存储，相当于Java和C语言中的double格式
            能表示的最大值是±1.7976931348623157 x 10308
            能表示的最小值是±5 x 10 -324
          整数：
                   在JavaScript中10进制的整数由数字的序列组成
                   精确表达的范围是-9007199254740992 (-253) 到 9007199254740992 (253)
                   超出范围的整数，精确度将受影响
          浮点数：
                   使用小数点记录数据
                   例如：3.4，5.6
                   使用指数记录数据
                   例如：4.3e23 = 4.3 x 1023

          16进制和8进制数的表达：
                   16进制数据前面加上0x，八进制前面加0
                   16进制数是由0-9,A-F等16个字符组成
                   8进制数由0-7等8个数字组成
                   16进制和8进制与2进制的换算

            # 2进制: 1111 0011 1101 0100   <-----> 16进制:0xF3D4 <-----> 10进制:62420
            # 2进制: 1 111 001 111 010 100 <-----> 8进制:0171724

        字符串(String)：--Unicode
        简介：
            是由Unicode字符、数字、标点符号组成的序列
            字符串常量首尾由单引号或双引号括起
            JavaScript中没有字符类型
            常用特殊字符在字符串中的表达
            字符串中部分特殊字符必须加上右划线\
            常用的转义字符 \n:换行  \':单引号   \":双引号  \\:右划线

        String数据类型的使用：
            特殊字符的使用方法和效果
            Unicode的插入方法：
                <script>
                        var str="\u4f60\u597d\n欢迎来到\"JavaScript世界\"";
                        alert(str);
                </script>

        布尔型(Boolean)
        简介
            Boolean类型仅有两个值：true和false，也代表1和0，实际运算中true=1,false=0
            布尔值也可以看作on/off、yes/no、1/0对应true/false
            Boolean值主要用于JavaScript的控制语句，例如
                if (x==1){
                    y=y+1;
                }else{
                    y=y-1;
                }

        Null & Undefined

        Undefined 类型：（如果声明了某个变量，未对它赋值则为undefined）
            Undefined 类型只有一个值，即 undefined。当声明的变量未初始化时，该变量的默认值是 undefined。
            当函数无明确返回值时，返回的也是值 "undefined";
            var a; -- 系统自动赋值为undefined 这是大概是动态语言js特有的，像java，python都会有这样的写法，编译器报错

        Null 类型：（省空间）
            另一种只有一个值的类型是 Null，它只有一个专用值 null，即它的字面量。值 undefined 实际上是从值 null 派生来的，因此 ECMAScript
            把它们定义为相等的。
            尽管这两个值相等，但它们的含义不同。undefined 是声明了变量但未对其初始化时赋予该变量的值，null 则用于表示尚未存在的对象（在讨论
            typeof 运算符时，简单地介绍过这一点）。如果函数或方法要返回的是对象，那么找不到该对象时，返回的通常是 null。
            var person=new Person()
            var person=null -- 先写一个变量占住  通常java会有这样的写法先赋一个空值在堆内存中占坑之后指向栈内存，但是python中却不行
            注意：占的一定是一个空对象--必须是对象（栈内存中也都是对象，引用哪怕为空也要占对象）

        特殊类型（对象类型）: -- object （对象）
        obj = {"name":"igarashi"} -- 这个类型类似python的字典，也类似json类型。他是json的上一级--叫对象。另：它是有序的。json通常只能用""号来写
            typeod(obj) -- 得出object类型
            alert(obj) -- 输出为[object Object]
        当用for i in 进行遍历时，此时取到的也同python 为键 。同理也支持 obj[i]这种写法取值

        当前后端进行数据交互的时候，前端一直传这种格式，当我们通过后端查看console时要知道这种格式其实拿到的是这样类字典的对象

        数据类型转换：（五种数据类型之间可以相互转换）
            JavaScript属于松散类型的程序语言
            变量在声明的时候并不需要指定数据类型
            变量只有在赋值的时候才会确定数据类型
            表达式中包含不同类型数据则在计算过程中会强制进行类别转换

            数字 + 字符串：数字转换为字符串

            数字 + 布尔值：true转换为1，false转换为0   -- alert(2 == true) --flase 说好的1就是1 --和python相同

            字符串 + 布尔值：布尔值转换为字符串true或false

        强制类型转换函数：（啥都能转，十分随便,还有parseJson）
            函数parseInt：   强制转换成整数   例如parseInt("6.12")=6  ; parseInt("12a")=12 ;
                parseInt("a12")=NaN ;（当字符串转换数字失败时，返回NaN，属于Number数据类型）NaN==|>|<0 -- 都是flase NaN啥都不是
                //NaN出现在表达式中一定结果flase除非!=。       parseInt("1a2")=1

            函数parseFloat： 强制转换成浮点数  parseFloat("6.12")=6.12

            函数eval：       将字符串强制转换为表达式并返回结果 eval("1+1")=2 ; eval("1<2")=true

        类型查询函数(typeof)：（它值能判断基本数据类型）
            ECMAScript 提供了 typeof 运算符来判断一个值是否在某种类型的范围内。可以用这种运算符判断一个值是否表示一种原始类型：如果它是
            原始类型，还可以判断它表示哪种原始类型。

            函数typeof ：查询数值当前类型 (string / number / boolean / object )
                例如typeof("test"+3)      "string"
                例如typeof(null)          "object " --因为null存的也是obj（同在栈内存）
                例如typeof(true+1)        "number"
                例如typeof(true-false)    "number"

            弊端：加入用String创建一个对象时，再用typeof()查看，此时不会表名类型，会返回object，因此它不够明确（猜想：只能查看堆内存类型）

        判断类型：instanceof
            s instanceof String 返回判断结果True or False （此时可以判断各种类型数据）

三、ECMAScript 运算符：
ECMAScript 算数运算符：
加(＋)、 减(－)、 乘(*) 、除(/) 、余数(% ) 加、减、乘、除、余数和数学中的运算方法一样 例如：9/2=4.5，4*5=20，9%2=1 -除了可以表示减号还可以表示负号 例如：x=-y +除了可以表示加法运算还可以用于字符串的连接 例如："abc"+"def"="abcdef"

        递增(++) 、递减(--)：
            假如x=2，那么x++表达式执行后的值为3，x--表达式执行后的值为1
            i++相当于i=i+1，i--相当于i=i-1
            递增和递减运算符可以放在变量前也可以放在变量后：--i
            （为什么python没有++猜想, b = a++ 按照python的解释应该是先从右边运算，不是先赋值，因此与++冲突）

        一元加减法：普通的"+"、"-"当 a = "123" 时b = +a可以解析为+123 "-"则为 -123 字符串失效NaN

    ECMAScript 逻辑运算符：
        含等于 ( == )  、不等于( != ) 、 大于( > ) 、 小于( < ) 大于等于(>=) 、小于等于(<=)、 与 (&&) 、或(||) 、非(!)

        逻辑 AND 运算符(&&)：

        逻辑 AND 运算的运算数可以是任何类型的，不止是 Boolean 值。
        如果某个运算数不是原始的 Boolean 型值，逻辑 AND 运算并不一定返回 Boolean 值：
            如果某个运算数是 null，返回 null。（即是空对象，栈内存占位）
            如果某个运算数是 NaN，返回 NaN。
            如果某个运算数是 undefined，返回undefined。
            当if(true && new Object()){}时因为前面的为true，此时只返回后面的Object()。此时变为if(Object())相当于判断对象是否为空

        逻辑 OR 运算符(||)：
            与逻辑 AND 运算符相似，如果某个运算数不是 Boolean 值，逻辑 OR 运算并不一定返回 Boolean 值

    ECMAScript 赋值运算符：
        赋值 =
        JavaScript中=代表赋值，两个等号==表示判断是否相等
        例如，x=1表示给x赋值为1
            if (x==1){...}程序表示当x与1相等时
            if(x==“on”){…}程序表示当x与“on”相等时

        配合其他运算符形成的简化表达式：
            例如i+=1相当于i=i+1，x&=y相当于x=x&y

    ECMAScript等性运算符：（==）
        执行类型转换的规则如下：
            如果一个运算数是 Boolean 值，在检查相等性之前，把它转换成数字值。false 转换成 0，true 为 1。
            如果一个运算数是字符串，另一个是数字，在检查相等性之前，要尝试把字符串转换成数字。
            如果一个运算数是对象，另一个是字符串，在检查相等性之前，要尝试把对象转换成字符串。
            如果一个运算数是对象，另一个是数字，在检查相等性之前，要尝试把对象转换成数字。

        在比较时，该运算符还遵守下列规则：
            值 null 和 undefined 相等。 null == undefined -- true
            在检查相等性时，不能把 null 和 undefined 转换成其他值。
            如果某个运算数是 NaN，等号将返回 false，非等号将返回 true。
            如果两个运算数都是对象，那么比较的是它们的引用值。如果两个运算数指向同一对象，那么等号返回 true，否则两个运算数不等。

    ECMAScript 关系运算符(重要)：
            var bResult = "Blue" < "alpha";
            alert(bResult); //输出 true　　
        在上面的例子中，字符串 "Blue" 小于 "alpha"，因为字母 B 的字符代码是 66，字母 a 的字符代码是 97。

        比较数字和字符串：
        另一种棘手的状况发生在比较两个字符串形式的数字时，比如：
            var bResult = "25" < "3";
            alert(bResult); //输出 "true"
        上面这段代码比较的是字符串 "25" 和 "3"。两个运算数都是字符串，所以比较的是它们的字符代码（"2" 的ascii是 50，"3" 的ascii是 51）。

        不过，如果把某个运算数该为数字，那么结果就有趣了：
            var bResult = "25" < 3;
            alert(bResult); //输出 "false"
        这里，字符串 "25" 将被转换成数字 25，然后与数字 3 进行比较，结果不出所料。

        总结：
            比较运算符两侧如果一个是数字类型,一个是其他类型,会将其类型转换成数字类型.
            比较运算符两侧如果都是字符串类型,比较的是最高位的asc码,如果最高位相等,继续取第二位比较.

    Boolean运算符(重要):
        var temp=new Object();// false;[];0; null; undefined;//后面这个是true object(new Object();)
        if(temp){
            console.log("igarashi")
        }else {
            console.log("kakkoi")
        }

    全等号和非全等号:（===、!==）
        等号和非等号的同类运算符是全等号和非全等号。这两个运算符所做的与等号和非等号相同，只是它们在检查相等性前，不执行类型转换。

四、控制语句
if 控制语句：
if(判断){执行语句}else{执行语句}
if 既可以单独使用，还可以和 if-else if 嵌套使用

    switch  选择控制语句：
        优化if使用的，switch比else if结构更加简洁清晰，使程序可读性更强,效率更高。
        switch(表达式){
            case 值1: 执行语句1; break;
            case 值2: 执行语句2; break;
            default: 执行default语句;
        }
        通常switch接收参数,通过case查看是否满足条件，满足case的值则执行对应语句，否则执行default。break防止switch穿透

        问题: -- 为什么switch效率高？
            1.if的适用范围比switch广，只要为boolean表达式均可。switch则只能对基本类型比较。（因此累着可比性限定在基本类型中）
            2.既然只能比较基本类型的效率高低，那么if语句每句都是独立的若if(a == 1)else if(a == 2)此时a便被寄存器读取了两次
                1、2分别被寄存器读取一次（a的两次是多余的额外开销）。
            3.但是if语句必须每次都把里面的两个数从内存拿出来读到寄存器，因为它不知道你其实比较的是同一个a。
            4.于是 switch case 就出来了，因此switch用来根据一个整型值进行多路分支，并且编译器可以对多路分支进行优化
            5.switch-case只将表达式计算一次,然后将表达式的值与每个case的值比较,进而选择执行哪一个case的语句块

        所以在多路分支时用switch比if..else if .. else结构要效率高。

    for  循环控制语句：
        for (初始化;条件;增量){
            执行语句;
        }
        实现条件循环，当条件成立时，执行语句，否则跳出循环体
        for(var 变量 in 遍历对象){
            alert(对象[变量])
        }
        这种写法虽然可以，但不推荐，因为和py不同，假设变量i取值不是元素内容，而是序号，要遍历对象[i]才能遍历到元素

        注意：
            doms=document.getElementsByTagName("p");

            for (var i in doms){
               console.log(i); // 0 1 2 length item namedItem
               //console.log(doms[i])
            }
            若上文有三个p标签的结果：0 1 2 length item namedItem
            //循环的是你获取的一个DOM元素集，for in用来循环对象的所有属性，dom元素集包含了你上面输出的属性。
            //如果你只要循环dom对象的话，可以用for循环:
            for (var i=0;i<doms.length;i++){
                console.log(i) ; // 0 1 2
                //console.log(doms[i])
            }
            此时只打印结果0 1 2 去掉注释打印对应标签及内容
        结论：for i in 不推荐使用.

    while  循环控制语句：
        while (条件){
            执行语句;
        }
        运行功能和for类似，当条件成立循环执行语句花括号{}内的语句，否则跳出循环

    异常处理:
        try {
            //这段代码从上往下运行，其中任何一个语句抛出异常该代码块就结束运行
        }
        catch (e) {
            // 如果try代码块中抛出了异常，catch代码块中的代码就会被执行。
            //e是一个局部变量，用来指向Error对象或者其他抛出的对象
        }
        finally {
             //无论try中代码是否有异常抛出（甚至是try代码块中有return语句），finally代码块中始终会被执行。
        }
        注：主动抛出异常 throw Error('xxxx')

-----------------------------------------------------分割线：以上都是最基本内容,下面介绍对象---------------------------------------------
ECMA 对象:
从传统意义上来说，ECMAScript 并不真正具有类。事实上，除了说明不存在类，在 ECMA-262 中根本没有出现“类”这个词。ECMAScript 定义了“对象定义”，
逻辑上等价于其他程序设计语言中的类。
var o = new Object();

    ECMA对象概述：
        ECMA对象下有分了两类对象：
            1.一类是 native object -- 本地对象
            2.另一类是 host object -- 宿主对象   DOM & BOM 都包括其中  （宿主环境就是提供ECMA一个语法规范）

    上帝对象： -- object对象
        所有对象的祖宗（和java类似）。ECMA中的所有对象都是由这个类继承而来；Object 对象中的所有属性和方法都会出现在其他对象中。
        ToString() :  返回对象的原始字符串表示。
        ValueOf()  : 返回最适合该对象的原始值。对于许多对象，该方法返回的值都与 ToString() 的返回值相同。（一般就记这两个）

    11种内置对象：
        包括：Array ,String , Date, Math, Boolean, Number  Function, Global, Error, RegExp（正则）, Object

        简介：在JavaScript中除了null和undefined以外其他的数据类型都被定义成了对象，也可以用创建对象的方法定义变量，String、Math、Array、
            Date、RegExp都是JavaScript中重要的内置对象，在JavaScript程序大多数功能都是通过对象实现的

        上文的大多数对象都要么与JAVA类似，要么与Python类似，都不是重点，接下来着重介绍重点 -- Function

    Function对象:（重点）
        函数的定义：
        function 函数名 (参数){
            函数体;
            return 返回值;
        }

        功能说明：
            1.可以使用变量、常量或表达式作为函数调用的参数
            2.函数由关键字function定义
            3.函数名的定义规则与标识符一致，大小写是敏感的
            4.返回值必须使用return

        Function 类可以表示开发者定义的任何函数。
        用 Function 类直接创建函数的语法如下：(第一种即上面的那种，第二种见下)
            var 函数名 = new Function("参数1","参数n","function_body"); --(说实话，没用)

        虽然由于字符串的关系，第二种形式写起来有些困难，但有助于理解函数只不过是一种引用类型，它们的行为与用 Function 类明确创建的函数行为是相同的。

        注意：js的函数加载执行与python不同，它是整体加载完才会执行，所以执行函数放在函数声明上面或下面都可以

        Function 对象的 length 属性
            如前所述，函数属于引用类型，所以它们也有属性和方法。
            比如，ECMAScript 定义的属性 length 声明了函数期望的参数个数。
                alert(func1.length)

        Function 对象的方法
            Function 对象也有与所有对象共享的 valueOf() 方法和 toString() 方法。这两个方法返回的都是函数的源代码，在调试时尤其有用。
                alert(void(fun1(1,2)))
                运算符void()作用：拦截方法的返回值　-- 之后打印undefined（有啥用？不清楚）

        函数的调用：
            function func1(a,b){ alert(a+b) }
            此时无论传几个参都能调用 func1(1,2) -- 3 func1(1,2,3) -- 3 func1(1) -- NaN func1() -- NaN
            只要函数名写对即可,参数怎么填都不报错.

        函数的内置对象: -- arguments对象（类似python 的*args） 重要
            因为arguments是对象因此可以调用它的方法和属性：
            .length --获取到函数内部传递了几个参数
            arguments -- 直接返回了获取的参数即对应下标 （此时便可以接收多参 -- 某种意义上感觉比python好用）
            作用: if(arguments!=3){
                throw new Error("param is not 3");
            }
            可以判断参数的个数，并根据参数的异常来抛出

        匿名函数 & 自执行函数：
            var f = function(){ alert("匿名函数") }; -- 匿名函数无名字
            f() -- 此时便执行了匿名函数（py中的lambda也是赋给一个标签进行调用）-- 有什么用？不想起名字就用

            (function(arg){ console.log(arg) })("123") -- 自执行函数 （其实前半部分相当于匿名函数了，还没赋值，之后就用括号执行了）
            (lambda a:print(a))("python中的lambda也有这种方式") --连开销都省了

        注：语法糖其实是很装逼的说法，其实就是把一些复杂的东西封装起来，简单的调用（让你省点劲，甜了）

---------------------以上就是 js 的基础部分-------------
