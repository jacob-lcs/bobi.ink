---
title: React组件设计实践总结02 - 组件的组织
date: 2019/4/23
categories: 前端
---

## 组件的组织

### 组件的分类

#### 1️⃣ **容器组件**和**展示组件**分离

*容器组件和展示组件分离*是 React 开发的重要思想, 它影响的 React 应用项目的组织和架构. 下面总结一下两者的区别

|          | 容器组件        | 展示组件 |
| -------- | --------------- | -------- |
| 关注点   | 业务            | UI       |
| 数据源   | 状态管理器/后端 | props    |
| 组件形式 | 高阶组件        | 普通组件 |

了解更多[Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)

- **展示组件**是一个只关注展示的'元件', 为了可以在多个地方被复用, 它不应该耦合'业务/功能', 或者说不应该过渡耦合. 像`antd`这类组件库提供组件明显就是'展示组件'

  下面是一个典型的应用目录结构, 我们可以看到展示组件和业务/功能是有不同的耦合程度的, 和业务的耦合程度越低, 通用性/可复用性越强:

  ```shell
  node_modules/antd/     🔴 通用的组件库, 不能和任何项目的业务耦合
  src/
    components/          🔴 项目通用的组件库, 可以被多个容器组件共享
    containers/
      Foo/
        components/      🔴 容器组件特有的组件库, 和一个业务/功能深度耦合. 以致于不能被其他容器组件共享
        index.tsx
      Bar/
        components/
        index.tsx
  ```

  对于展示组件，我们要以一种'第三方组件库'的标准来考虑组件的设计，减少和业务的耦合，考虑各种应用的场景， 设计好公开的接口.

- **容器组件**主要关注业务处理. 容器组件一般以'高阶组件'形式存在, 它一般 ① 从外部数据源(redux 这些状态管理器或者直接请求服务端数据)获取数据, 然后 ② 组合*展示组件*来构建完整的视图.

  <img src="/images/04/container.png" width="400" />

  *容器组件*通过组合*展示组件*来构建完整视图, 但两者直接并不是简单的包含与被包含的关系.

  在 React Hooks 出来以后, 容器组件的职责就被 hooks 取代了 👇

`容器组件和展示组件的分离`可以带来好处主要是**可复用性**和**可维护性**:

- 可复用性: 展示组件可以用于多个不同的数据源(容器组件). 容器组件(业务逻辑)也可以被复用于不同'平台'的展示组件
- 展示和容器组件更好的分离，有助于更好的理解应用和 UI, 可以独立地维护
- 展示组件变得轻量(无状态/或局部状态), 更容易被测试

#### 2️⃣ 分离逻辑和视图: `容器组件和展示组件`的分离本质上是`逻辑和视图`的分离.

在`React Hooks`出现后, 容器组件进化为 Hooks 形式, Hooks 可以和视图层更自然的分离. 它为视图层提供纯粹的数据来源, 可以复用于不同的'展示平台', 例如 web 版和 native 版:

```shell
Login/
  useLogin.ts   // 可复用的业务逻辑
  index.web.tsx
  index.tsx
```

上面使用了`useLogin.tsx`来单独维护业务逻辑. 可以被 web 平台和 native 平台的代码复用

#### 3️⃣ 有状态组件和无状态组件

无状态组件内部不存储状态, 完全由外部的 props 来映射. 这类组件一般以函数组件形式, 作为低级/高复用的底层展示型组件.
无状态组件天然就是'纯组件', 如果无状态组件的映射需要一点成本, 可以使用 React.memo 避免重复渲染

#### 4️⃣ 纯组件和非纯组件

纯组件的'纯'来源于函数式编程. 指的是"对于一个函数而言, 给定相同的输入, 它总是返回相同的输出, 过程没有副作用, 没有额外的状态依赖".

对应到 React 组件中, 纯组件指的是 props(严格上说还有 state 和 context, 它们也是组件的输入)没有变化, 组件的输出就不会变动.

  <img src="/images/04/input-output.png" width="400" />

和相比 React 组件的输出输出模型而言, [Cyclejs](http://cyclejs.cn)对组件输入/输出的抽象则做的更加彻底，更加‘函数式’👇。它的组件就是一个普通的函数，只有'单向'的输入和输出:

  <img src="/images/04/cyclejs.png" width="400" />

函数式编程和组件式编程思想是一致的, 它们都是'组合'的艺术. 一个大的函数可以有多个职责单一函数组合而成, 一个组件也是如此. 我们将一个大的组件拆分为子组件, 对组件做更细粒度的控制, 保持它们的纯净性, 让它们的职责更单一, 更独立. 这带来的好处就是可复用性, 可测试性和可预测性.

纯组件对 React 的重要意义还有性能优化. 如果一个组件是一个纯组件, 如果'输入'没有变动, 那么这个组件就不需要重新渲染. 组件树越大, 纯组件带来的性能优化收益就越高.

我们可以很容易地保证一个底层组件的纯净性, 因为它本来就很简单. 对于一个复杂的组件树, 则需要花点心思进行构建, 所以才有了'状态管理'的概念, Redux 就是一个典型的解决方案, 在 Redux 的世界里*'一个复杂的组件树就是一颗状态树的映射'*, 只要状态树(需要依靠不可变数据来保证状态的可预测性)不变, 组件树就不变. Redux 推荐保持组件的纯净性, 由 Redux 和配套的异步处理工具来维护状态, 这样就将整个应用抽象成了一个"单一的数据流", 这是一种简单的"输入/输出"关系

  <img src="/images/04/redux.png" width="400" />

不管是 Cyclejs 还是 Redux，抽象是需要付出一点代价的，就比如 redux 代码可能会很罗嗦, 一个复杂的状态树， 如果缺乏良好的组织，真个应用会变得很难理解。

扩展:

- [Redesigning Redux](https://hackernoon.com/redesigning-redux-b2baee8b8a38)

#### 5️⃣ 按照 UI 划分为'布局组件'和'内容组件'

- 布局组件用于控制页面的布局，为内容组件提供占位符。通过 props 传入组件来进行填充. 比如`Grid`, `Layout`, `HorizontalSplit`
- 内容组件会包含一些内容，而不仅有布局。内容组件被布局组件约束在占位符内. 比如`Button`, `Label`, `Input`

例如下图, List/List.Item 就是布局组件，而 Input，Address 则是内容组件

  <img src="/images/04/layout-vs-content.png" lazyload width="600" />

将布局从内容组件中抽取出来，分离布局和内容，可以让两者更好维护，比如布局变动不会影响内容，内容组件可以被用于不同页面的布局。**组件应该是一个内聚的隔离单元**，它也是自包含的，组件不应该影响其外部的状态, 例如一个按钮不应该修改外部的布局, 另外也要避免影响全局的样式

### 目录划分

#### 1️⃣ 基本目录结构

关于项目目录结构的划分有两种流行的模式:

- `Rails-style/by-type`: 按照文件的类型划分为不同的目录，例如`components`、`constants`、 `typings`、`views`
- `Domain-style/by-feature`: 按照一个功能特性或与创建单独的文件夹，包含多种类型的文件或目录

实际的项目环境我们一般使用的是混合模式，下面是一个典型的 React 项目结构:

```shell
src/
  components/      # 🔴 项目通用的‘展示组件’
    Button/
      index.tsx    # 组件的入口, 导出组件
      Groups.tsx   # 子组件
      loading.svg  # 静态资源
      style.css    # 组件样式
    ...
    index.ts       # 到处所有组件
  containers/      # 🔴 包含'容器组件'和'页面组件'
    LoginPage/     # 页面组件, 例如登录
      components/  # 页面级别展示组件，这些组件不能复用与其他页面组件。
        Button.tsx # 组件未必是一个目录形式，对于一个简单组件可以是一个单文件形式. 但还是推荐使用目录，方便扩展
        Panel.tsx
      reducer.ts   # redux reduces
      useLogin.ts  # (可选)放置'逻辑', 按照👆分离逻辑和视图的原则，将逻辑、状态处理抽取到hook文件
      types.ts     # typescript 类型声明
      style.css
      logo.png
      message.ts
      constants.ts
      index.tsx
    HomePage/
    ...
    index.tsx      # 🔴应用根组件
  hooks/           # 🔴可复用的hook
    useList.ts
    usePromise.ts
  ...
  index.tsx        # 应用入口, 在这里使用ReactDOM对跟组件进行渲染
  stores.ts        # redux stores
  contants.ts      # 全局常量
```

这里使用`Rails-style`模式为不同**类型/职责**的文件划分不同的目录或通过文件名进行区分, 也使用`Domain-style`将不同**作用域**的文件/目录聚合在一起. 上面最为明显的就是`components`目录.

前端项目一般按照页面路由来拆分组件， 这些组件我们暂且称为‘页面组件’, 这些组件是和业务功能耦合的，而且每个页面之间具有一定的独立性. 这里将页面组件放置在`containers`, 如其名，这个目录原本是用来放置容器组件的，实际项目中通常是将‘容器组件’和‘页面组件’混合在了一起. 现阶段如果要实现纯粹的逻辑分离，我个人觉得还是应该抽取到 hook 中

#### 2️⃣ 多页应用的目录划分

对于大型应用可能有多个应用入口, 例如很多 electron 应用有多个 windows, 再比如很多应用处理 App 还有后台管理界面. 我一般会这样组织多页应用:

```shell
src/
  components/       # 共享组件
  containers/
    Admin/          # 后台管理页面
      components/   # 后台特定的组件库
      LoginPage/
      index.tsx
      ...
    App/
      components/  # App特定的组件库
      LoginPage/   # App页面
      index.tsx
      stores.ts    # redux stores
    AnotherApp/    # 另外一个App页面
  hooks/
  ...
  app.tsx          # 应用入口
  anotherApp.tsx   # 应用入口
  admin.tsx        # 后台入口
```

webpack 支持多页应用的构建, 我一般会将应用入口文件命名为`*.page.tsx`, 然后在 src 自动扫描匹配的文件作为入口.
利用 webpack 的[`SplitChunksPlugin`](https://webpack.docschina.org/plugins/split-chunks-plugin/)可以为自动多页应用抽取共享的模块, 这个对于功能差不多和有较多共享代码的多页应用是个很好的特性. 意味着资源被一起优化, 抽取共享模块, 有利于减少编译文件体积和浏览器缓存.

> [`html-webpack-plugin`](https://github.com/jantimon/html-webpack-plugin/blob/master/package.json)4.0 开始支持注入共享 chunk. 在此之前需要显式定义 SplitChunksPlugin 分离的 chunk.

#### 3️⃣ 多页应用的目录划分: lerna 模式

上面的方式, 所有页面都聚集在一个项目下面, 共享一样的依赖和 npm 模块. 这可能会带了一下问题:

1. 不能允许不同页面有不同版本的依赖
2. 对于毫无相关的应用, 这种组织方式会让代码变得混乱, 例如 App 和后台, 他们使用的技术栈, 组件库, 交互体验都可能相差较大, 而且容易造成命名冲突.
   例如后台和 App 都有自己的 Button 组件. 这时候放在根 components 则不太合适, 但很难对这种行为进行约束, 所以就有了类似的命名: Button, ButtonForAdmin....

这种场景可以利用[lerna](https://lernajs.io)或者 [yarn workspace](https://yarnpkg.com/zh-Hans/docs/workspaces) 机制, 将多页应用隔离在不同的 npm 模块下, 以 yarn workspace 为例:

```shell
package.json
yarn.lock
node_modules/      # 所有依赖都会安装在这里
share/             # 🔴 共享模块
  hooks/
  utils/
admin/             # 🔴 后台管理应用
  components/
  containers/
  index.tsx
  package.json     # 声明自己的模块以及share模块的依赖
app/               # 🔴 后台管理应用
  components/
  containers/
  index.tsx
  package.json     # 声明自己的模块以及share模块的依赖
```

#### 4️⃣ 跨平台应用

使用 ReactNative 可以将 React 衍生到移动原生应用的开发领域. 尽管也有[`react-native-web`](https://github.com/necolas/react-native-web)这样的解决方案, Web 和 Native 的 API 和功能可能会相差很大, 久而久之就会出现大量无法控制的填充代码，另外 react-native-web 也可能成为风险点。 一般按照下面风格来组织跨平台应用:

```shell
src/
  components/
    Button/
      index.tsx     # 🔴 ReactNative 组件
      index.web.tsx # 🔴 web组件
      loading.svg   # 静态资源
      style.css     # 组件样式
    ...
    index.ts
    index.web.ts
  containers/
    LoginPage/
      components/
      ....
      useLogin.ts   # 🔴 存放分离的逻辑，可以在React Native和Web组件中共享
      index.web.tsx
      index.tsx
    HomePage/
    ...
    index.tsx
  hooks/
    useList.ts
    usePromise.ts
  ...
  index.web.tsx        # web应用入口
  index.tsx            # React Native 应用入口
```

可以通过 webpack 的`resolve.extensions`来配置扩展名补全的优先级

#### 3️⃣ 跨平台的另外一种方式: taro

对于国内的开发者来说，跨平台可不只 Native 那么简单，我们还有各种各样的小程序、小应用。终端的**碎片化**让前端的开发工作越来越有挑战性.

Taro 就这样诞生了, Taro 基于 React 的标准语法(DSL)， 结合编译原理的思想，将一套代码转换为多种终端的目标代码, 并提供一套统一的内置组件库和 SDK 来抹平多端的差异

  <img src="/images/04/taro.png" width="400" />

因为 Taro 使用 React 的标准语法和 API，这使得我们按照原有的 React 开发约定和习惯来开发多端应用，且只保持一套代码. 但是不要忘了抽象都是有代价的。

> 可以查看 Taro 官方文档[了解更多](https://github.com/NervJS/taro) <br/> > [Flutter](https://github.com/flutter/flutter)是近期比较或的跨平台方案，但是跟本文主题无关

### 模块

#### 1️⃣ 创建严格的模块边界

下图是一个某页面的模块导入，相当混乱，这还算可以接受，笔者还见过上千行的组件，其中模块导入语句就占一百多行. 这有一部分原因是 Vscode 自动导入功能导致，更大的原因是这些模块缺乏组织。

  <img src="/images/04/imports.png" width="600" />

我觉得应该创建严格的模块边界，**一个模块只有一个统一的'出口'**。例如一个复杂的组件:

```shell
ComplexPage/
  components/
    Foo.tsx
    Bar.tsx
  constants.ts
  reducers.ts
  style.css
  types.ts
  index.tsx # 出口
```

我认为*一个‘目录’就是一个模块边界*. 你*不应该*这样子导入模块:

```typescript
import ComplexPage from '../ComplexPage';
import Foo from '../ComplexPage/components/Foo';
import Foo from '../ComplexPage/components/Bar';
import { XXX } from '../ComplexPage/components/constants';
import { User, ComplexPageProps } from '../ComplexPage/components/type';
```

一个模块/目录应该由一个‘出口’文件来统一管理模块的导出，限定模块的可见性. 比如上面的模块，`components/Foo`、 `components/Bar`, `constants.ts`这些文件其实是 ComplexPage 组件的'实现细节'. 这些是外部模块不应该去耦合， 但是目前并没有一个限定机制，只能依靠约定.

在前端项目中 index 文件最适合作为一个'出口'文件, 当导入一个目录时，模块查找器会查找该目录下是否存在的 index 文件. index 文件负责控制一个模块可见性:

```typescript
// 导入外部模块需要使用的类型
export * from './type'
export * from './constants'
export * from './reducers'

// 不暴露外部不需要关心的实现细节
// export * from './components/Foo'
// export * from './components/Bar'

// 模块的默认导出
import {default} from './ComplexPage'
```

现在导入语句可以更加简洁:

```typescript
import ComplexPage, { ComplexPageProps, User, XXX } from '../ComplexPage';
```

这条规则也可以用于组件库, 在 webpack 的 Tree-shaking 特性还不成熟之前， 我们都使用了各种各样的技巧来实现按需导入. 例如[`babel-plugin-import`](https://github.com/ant-design/babel-plugin-import)或导入子路径:

```typescript
import TextField from '~/components/TextField';
import SelectField from '~/components/SelectField';
import RaisedButton from '~/components/RaisedButton';
```

现在可以使用 Named import 直接导入，让 webpack 来帮你优化:

```typescript
import { TextField, SelectField, RaisedButton } from '~/components';
```

#### 2️⃣ `Named export` vs `default export`

这两种导出方式都有各自的适用场景，这里不会一棒子打死就不使用某种导出方式. 首先看一下 named export 有什么优点:

- 命名确定

  - 方便 Typescript 进行重构
  - 方便智能提醒和自动导入(auto-import)识别
  - 方便 reexport

    ```typescript
    // named
    export * from './named-export';

    // default
    export { default as Foo } from './default-export';
    ```

- 一个模块支持多个 named export

那么 default export 有什么优点:

- default export 一般代表‘模块本身’，当我们使用‘默认导入’导入一个模块时，开发者是自然而然知道这个默认导入的是一个什么对象。例如 react 导出的是一个 React 对象, LoginPage 导出的是一个登录页面, somg.png 导入的是一张图片. 这类模块总有一个确定的'主体对象'. 所以默认导入的名称和模块的名称一般是保持一致的(Typescript 的 auto-import 就是基于文件名). 当然'主体对象'是一种隐式的概念
- 当‘主体对象’明确的情况下，默认导出更加简洁。例如`lazy(import('./MyPage'))`

default export 也有一些缺点:

- 和其他模块机制(commonjs)互操作时比较难以理解. 例如我们会这样子导入默认模块`require('./xx').default`
- named import 优点就是 default export 的缺点

所以总结一下:

1. 对于'主体对象'明确的模块需要有默认导出, 例如页面组件，类
2. 对于'主体对象'不明确的模块不应该使用默认导出，例如组件库、utils(放置各种工具方法)、contants 常量

按照这个规则可以这样子组织 components 目录：

```shell
  components/
    Foo/
      Foo.tsx
      types.ts
      constants.ts
      index.ts         # 导出Foo组件
    Bar/
      Bar.tsx
      index.tsx
    index.ts           # 导出所有组件
```

对于 Foo 模块来说， 存在一个主体对象即 Foo 组件, 所以这里使用`default export`导出的 Foo 组件， 代码为:

```typescript
// 这三个文件全部使用named export导出
export * from './contants';
export * from './types';
export * from './Foo';

// 导入主体对象
export { Foo as default } from './Foo';
```

现在假设 Bar 组件依赖于 Foo:

```typescript
// components/Bar/Bar.tsx
import React from 'react';

// 导入Foo组件, 根据模块边界规则, 不能直接引用../Foo/Foo.tsx
import Foo from '../Foo';

export const Bar = () => {
  return (
    <div>
      <Foo />
    </div>
  );
};
```

对于`components`模块来说，它的所有子模块都是平等的，所以不存在一个主体对象，`default export`在这里不适用。 `components/index.ts`代码:

```typescript
// components/index.ts
export * from './Foo';
export * from './Bar';
```

#### 3️⃣ 避免循环依赖

**循环依赖是模块糟糕设计的一个表现**, 这时候你需要考虑拆分和设计模块文件, 例如

```typescript
// --- Foo.tsx ---
import Bar from './Bar';

export interface SomeType {}

export const Foo = () => {};
Foo.Bar = Bar;

// --- Bar.tsx ----
import { SomeType } from './Foo';
...
```

上面 Foo 和 Bar 组件就形成了一个简单循环依赖, 尽管它不会造成什么运行时问题. 解决方案就是将 SomeType 抽取到单独的文件:

```typescript
// --- types.ts ---
export interface SomeType {}

// --- Foo.tsx ---
import Bar from './Bar';
import {SomeType} from './types'

export const Foo = () => {};
...
Foo.Bar = Bar;

// --- Bar.tsx ----
import {SomeType} from './types'
...
```

#### 相对路径不要超过两级

### 导出

展示组件和容器组件, 展示组件避免耦合业务

### 导入

避免使用循环依赖

### 拆分

拆分为子函数
拆分为子组件

### 组件的识别

以 gzb-bn 为例

### 子组件

### 模块化

### 文档

### 扩展

- [Three Rules For Structuring (Redux) Applications](https://jaysoo.ca/2016/02/28/organizing-redux-application/#rule-2-create-strict-module-boundaries)
- [How To Scale React Applications](https://www.smashingmagazine.com/2016/09/how-to-scale-react-applications/)
- [Redux 常见问题：代码结构](http://cn.redux.js.org/docs/faq/CodeStructure.html)
- [export default considered harmful](https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html)
- [JavaScript 模块的循环加载](http://www.ruanyifeng.com/blog/2015/11/circular-dependency.html)