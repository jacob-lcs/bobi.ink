---
title: "Javascript竟然没有标准库?"
date: 2019/7/16
categories: 前端
---

最近在SegmentFault热心解题，一个问题比较让我比较印象深刻：_一个初学者试图在浏览器中导入Node.js的net模块。结果在控制台打印后是一个空对象_。

对于有点Javascript经验的人来说，这是一个‘弱智’问题，怎么可以在浏览器端运行Node程序呢？因为这些Node模块经过[Webpack处理](http://webpack.docschina.org/configuration/node/#其他-node-js-核心库-node-js-core-libraries-), 所以变成了一个空对象，更好的处理方式应该是抛出异常.

**仔细反思一下，对于这些刚入门Javascript的或者从其他语言切换过来的开发者，他们压根就没有概念，比如Python、Ruby、Java这些语言都有强大的标准库，可以满足80%的开发需求，不管它在什么环境、什么平台运行，基本上都可以统一使用这套标准库。而Javascript目前的现状是：不同的运行环境，API结构是割裂的**。

Javascript这门十几天开发出来的、专供浏览器的语言，可能当初设计是根本就没有考虑标准库这些玩意，比如文件系统，网络等等。**因为这个背景, Javascript长期不具备独立性，它深度依赖于浏览器这个运行环境, 处于一种给浏览器打辅助的角色**, 所以Javascript很多年没有走出浏览器玩具语言这个范围.

当然这既是劣势，也是优势, 现在没任何语言能撼动Javascript在浏览器中的地位。

我想很多人跟我当初一样认为**浏览器提供的Web API === Javascript的标准库**, 比如`console.log`、`setTimeout`(下文会介绍这些功能都不在Javascript规范里面). 正如当年那些把JQuery当成‘Javascript’的人.

直到NodeJS的出现，Javascript才挣脱浏览器约束，延伸到服务器领域, 不再是一个'沙盒语言'。NodeJS定义了很多模块来支撑服务端的开发, 如fs、os、Buffer、net。但是这些API一样不是Javascript的标准、也就是说**NodeJS !== Javascript**.

再到后来，学不动了，NodeJS原作者吐槽了一通NodeJS，又搞出了一个[Deno](https://deno.land), 它也会有自己标准库，会定义自己的文件系统、网络API。从名字上就暗示着这些API不可能和NodeJS兼容。Ok，现在回到文章开始那个问题，**如果deno发展起来，说不定哪天又有人尝试在浏览器引用Deno的模块**？

<br>
<br>

## 现有的Javascript API结构

![](https://bobi.ink/images/js-stdlib/outline.png)

如上图, Javascript其实是有一层比较薄全局的、通用的、**标准的**、核心的API层，即`标准内置对象`，这是一些语言核心的内置对象，可以全局访问。关键的是这些是标准的，它们在[ECMAScript规范](https://tc39.es/ecma262/#sec-global-object)中被定义. 在这个基础之上，不同的运行环境拓展了自己的API。

以浏览器为例:

![](https://bobi.ink/images/js-stdlib/brw.png)

浏览器端的Web API是一个非常复杂API集合，上图总结了一下，基本就包含两块东西:

- [Core DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model). DOM是一个通用的技术，不仅仅局限于浏览器，这个规范定义了结构化(structured document)文档的解析和操作规范。定义了基本的节点类型和操作方法。不局限于HTML的操作
- [HTML DOM](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM). 可以认为是Core DOM的扩展，这里面定义了各种HTML元素对象类型、扩展了元素的操作方法，另外还包含了浏览器相关的接口，如XMLHttpRequest。这一块通常也被统称为BOM

WebAPI基本概览:

![](https://bobi.ink/images/js-stdlib/webAPI.png)

如果你有留心查看MDN文档下面的规范引用，你会发现有些规范引用了[W3C](https://www.w3.org/TR/), 有些则引用了[WHATWG](https://html.spec.whatwg.org/multipage/). 到底谁说了算?

如果你掀开锅盖，就会发现这是一场闹剧. 如果前阵子有关注新闻，会看到这些标题‘_WHATWG 击败 W3C，赢得 HTML 和 DOM 的控制权_’、'_W3C将与WHATWG合作制定最新HTML和DOM规范标准_'. 大概可以猜出这两个组织之间的关系. 本文就不扯这些‘八卦’了，相关背景可以看这篇文章[WHATWG 击败 W3C，赢得 HTML 和 DOM 的控制权](https://www.infoq.cn/article/bsvFxt96DOh-SBZphBwJ)

相对而言, 语言层则由ECMAScript规范定义的，比较独立, 近些年成果也比较显著.

<br>

### 标准内置对象层主要包含这些东西

- 特殊值
  - Infinity
  - NaN
  - undefined
  - null
  - globalThis
- 函数
  - eval()
  - uneval() 
  - isFinite()
  - isNaN()
  - parseFloat()
  - parseInt()
  - decodeURI()
  - decodeURIComponent()
  - encodeURI()
  - encodeURIComponent()
- 基础对象
  - Object
  - Function
  - Boolean
  - Symbol
  - Error
  - EvalError
  - InternalError 
  - RangeError
  - ReferenceError
  - SyntaxError
  - TypeError
  - URIError
- 数值和时间
  - Number
  - BigInt
  - Math
  - Date
- 文本处理
  - String
  - RegExp
- 索引容器
  - Array
  - 'TypedArray'
- 键值容器
  - Map
  - Set
  - WeakMap
  - WeakSet
- 结构化数据
  - ArrayBuffer
  - SharedArrayBuffer 
  - Atomics 
  - DataView
  - JSON
- 控制抽象化对象
  - Promise
  - Generator
  - GeneratorFunction
  - AsyncFunction 
- 反射
  - Reflect
  - Proxy
- 国际化
  - Intl
- WebAssembly
- 其他
  - arguments

<br>

这些全局基本对象数量很少, 这些对象是每个JavaScript开发者必须掌握的. 

平时我们使用的非常频繁的Timer和Console都不再此列.

这些对象只能满足很基本开发需求, 根本不能和其他语言的标准库相比. **当然这和语言的定位也有一定关系**

<br>
<br>

## 什么是标准库?

标准库没有一个严格的定义，按照Wiki的说法标准库就是**该语言在不同实现中都按例提供的库**, 比如Ruby官方实现cRuby和基于JVM的JRuby都按照官方标准库规范实现了标准库。 **标准库怎么设计，需要包含什么内容取决于语言各自秉持的哲学和定位**。 我认为标准库应该有以下特征:

- 标准化的. 有规范明确定义它的内容和行为
- 内容经过仔细雕琢和挑选，可以覆盖大部分使用场景或者符合的语言定位
- 可选的、按需导入. 标准库不是全局的，需要通过模块导入, 非强制性使用

<br>

至于标准库需要包含什么内容，可以参考其他语言的实现。比如：

- [go](https://golang.org/pkg/)
- [ruby](http://ruby-doc.org/stdlib-2.6.3/)
- [python](https://docs.python.org/3/library/index.html)

<br>

大概分析一下，它们标准库大致都有这些内容：

- 网络协议
- 文件系统
  - 文件系统
  - 流
  - 标准输入输出
  - 二进制处理
- 算法
  - 密码算法
  - 编码
  - 压缩、归档
  - 排序
  - 数学
  - 字符串、文本
- 数据结构, 例如树、堆、队列等等
- 数据持久化和序列化. 比如JSON序列化，二进制序列化，数据库操作等等
- 调试/辅助
- 单元测试
- 文档处理
- 设计模式. 标准库中经常会携带(或辅助设计)该语言的最佳实践和设计模式, 例如go中的context, Ruby中的singleton
- 国际化
- 时间、日期
- 操作系统
  - 命令行
  - 环境变量
  - 系统资源
- 并发
  - 进程
  - 线程
  - 协程
- 语言或运行时的底层接口

大部分语言的核心都很小(C++除外)，我们学一门语言，大部分时间是花在标准库上和语言的生态上面，但是你会发现这些标准库一般都是大同小异，这就是为什么有经验的开发者可以很快地入手一门语言.

显然上面这些功能大部分在NodeJS中已经实现了，**鉴于NodeJS这么广泛的使用率，NodeJS可以算是事实上的标准了**

<br>

## 我们需要标准库?

![](https://bobi.ink/images/js-stdlib/dep.png)

显然要结合当前的背景来辩证地考虑。

**有标准库有什么好处?**

- 标准库提供通用、定义良好、优化的功能和行为，减少第三方模块依赖, 而且第三方库很难保证质量
- 避免社区割裂, 抚平不同运行环境的差异. 现在有NodeJS、后面有Deno，可能还会有Aeno、Beno, 尽管取代NodeJS的可能性很低，有规范化的标准库可以避免重复造轮子，不然真会学不动
- 安全性. [近期npm安全事件频发](https://mp.weixin.qq.com/s/UEPZwFuousrRVj17zZU80w)，投毒、删库(left-pad事件)、npm商业运作, 给社区带了不少麻烦。而标准库由运行环境内置，可以避免引用第三方库导致的安全问题
- 今天的Javascript应用会有很多依赖(node_modules hell)，打包出来的体积很大，网络加载和脚本解析需要耗费一定的资源，而且这些资源不能在多个应用之间被缓存. 一个很大的原因是npm的依赖过于零碎(比如几行代码的包)和重复(依赖不同的版本、Dead Code)，使用标准库可以减少这部分依赖
- 选择困难症. 没有标准库，可以选择npm上的第三方库，在npm上挑选靠谱、高质量的库是需要一定的时间成本的. 有时候我们就是懒得去比较和选择
- 优雅的标准库，是学习的榜样. 网上很多教程都是钻研标准库算法和实现的，对语言的开发者来说标准库是一块宝藏
- 学习成本。其他语言的开发者，可以较快入手

<br>

**标准库可能会有什么问题?**

- 标准可能滞后跟不上社区发展. Javascript正处于快速发展阶段，很多规范的定义是由社区驱动的，比如Promise、async/await. 跟不上社区的发展结果可能就是没人用
- 想下WebComponent目前的境遇
- 标准库不可能满足所有人的口味

<br>

**如何设计标准库? 标准库推进进程可能会有什么障碍?**

- NodeJS已经是事实上的标准, 怎么兼容现有的生态?
- 标准库应该包含什么内容，如何保持和社区同步?
- 如何把控标准库内容的尺度? 

  最小化的标准库容易被维护和升级，但可能出现'没什么卵用'的情况；
  
  最大化的标准库，例如Java的标准库，几乎包含了所有的东西，开发者可以快速开发一个东西, 但是过了几年很多API就会变得过时，一般为了保持向下兼容，这些API会一直像一根刺一样卡在那里.
  另一个非常典型的反例就是PHP的标准库，这里可以看到各种风格的API.
  
  标准库是跟随语言发布的，如果你的项目中使用了过时的API，又想升级语言版本，就需要重构项目。而使用第三方库则可能可以保持不动。

- Javascript的主要战场还是浏览器, 标准库是否应该有一个'基本版'(用于浏览器或者一些抽象操作系统的运行环境), 还有个'旗舰版'(服务端), 或者只提供一个跨越所有平台的标准库?
- 如何处理兼容性问题? 老旧浏览器如何Polyfill?
- 如何与现有的全局对象或用户模块分离？

<br>

## 近期的一些尝试

- [proposal-javascript-standard-library](https://github.com/tc39/proposal-javascript-standard-library) 这是一个非常早期的语言提议，定义了如何引用标准库(built-in modules)，但是没有定义标准库的内容
- [KV Storage: the Web's First Built-in Module](https://developers.google.com/web/updates/2019/03/kv-storage) Chrome在年初推出的实验性功能，尝试实现proposal-javascript-standard-library提议. 它通过下面方式来引用‘标准库’模块:

  ```js
  import {storage, StorageArea} from 'std:kv-storage'; // std: 前缀，和普通模块区分开来
  ```

<br>

## 总结

本文从一个SegmentFault上的一个问题开始，对比其他语言，揭露Javascript没有标准库的窘境. 接着介绍现有Javascript的API结构，介绍什么是标准库，辩证考虑标准库的优缺点，以及推行上面可能会遇到的阻碍.

<br>

## 扩展

- [Brendan Eich: JavaScript standard library will stay small](https://www.infoworld.com/article/3048833/brendan-eich-javascript-standard-library-will-stay-small.html)
- [What if we had a great standard library in JavaScript?](https://medium.com/@thomasfuchs/what-if-we-had-a-great-standard-library-in-javascript-52692342ee3f)
- [The JavaScript Standard Library](https://www.i-programmer.info/news/167-javascript/12608-the-javascript-standard-library.html)
- [W3C](https://www.w3.org/TR/)
- [Web API 索引](https://developer.mozilla.org/en-US/docs/Web/API)
- [Explain Like I'm Five: What's a standard library?](https://dev.to/sloan/explain-like-im-five-whats-a-standard-library-4gi)