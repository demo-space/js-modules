# js-modules

## CommonJS

CommonJS 是 Node 包模块的规范，关键字有 `module`, `exports`, `require` 等，客户端环境也可以搭配一些打包工具来使用

我们一般用 `module.exports` 导出值（初始值是个空对象），然后用 `require` 来引用。`exports` 是 `module.exports` 的 [引用](https://nodejs.org/api/modules.html#modules_exports_shortcut)，**我们用 `require` 得到的永远是 `module.exports` 导出的值**

有时可以用 exports 代替 module.exports：

```js
// a.js
exports.name = 'fish'
exports.age = 10

// main.js
const a = require('./a')
console.log(a) // {name: "fish", age: 10}
```

但是，如果 exports 指向了新的地址，引用就失效了：

```js
// a.js
exports = 123

// main.js
const a = require('./a')
console.log(a) // {}
```

module.exports 可以导出对象：

```js
module.exports = {
  name: 'fish',
  age: 30
}

// or
module.exports.name = 'fish'
module.exports.age = 30
```

也可以简单导出一个值（可以类比 es6 的 export default）：

```js
module.exports = 123
```

**无论如何，其实都是导出一个值而已**

## es6 module

es6 module 详细用法可以参考 [这里](http://es6.ruanyifeng.com/#docs/module)

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量

如果你希望外部能够读取模块内部的某个变量，就必须使用 export 关键字输出该变量，而 import 命令接受一对大括号，里面指定要从其他模块导入的变量名。大括号里面的变量名，**必须与被导入模块对外接口的名称相同**。（当然，导入导出都可以用 as 设置别名）

```js
export const name = 'fish'
export const age = 30

// main.js
import { name, age } from './a'
```

模块文件也可以这样（**注意：这不是解构赋值**）：

```js
const name = 'fish'
const age = 30

export {
  name, 
  age
}
```

导入的时候也可以不使用大括号，而是整体加载：

```js
const name = 'fish'
const age = 30

export {
  name, 
  age
}

// main.js
import * as info from './a'
console.log(info.name, info.age) // fish 30
```

经常使用的还有个 [export default](http://es6.ruanyifeng.com/#docs/module#export-default-%E5%91%BD%E4%BB%A4) 命令，这样导入模块的时候便不用写大括号了

再次提醒，不要把 import/export 中 {} 和解构赋值混淆：

```js
const name = 'fish'
const age = 30

export default {
  name, age
}

// main.js
import { name } from './e'
console.log(name)
```

name 输出是 undefined，而不是 'fish'

## ES6 模块和 CommonJS 模块差异

它们有两个重大差异：

* CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用
* CommonJS 模块是运行时加载，ES6 模块是编译时输出接口

> 第二个差异是因为 CommonJS 加载的是一个对象（即 module.exports 属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值

可以运行下 demo，打印结果如下：

```
以下 CommonJS 执行结果：
main.js:7 num 的原始值是：  0
main.js:12 incNum 执行两次后 num 值变为：  0
main.js:14 

main.js:20 以下 ES6 modules 执行结果：
main.js:21 num 的原始值是：  0
main.js:26 incNum 执行两次后 num 值变为：  2
```

## ES6 加载 CommonJS

```js
const name = 'fish'
const age = 30

module.exports = {
  name, 
  age
}

// main.js
import info from './a'
import * as info from './a'
import { default as info } from './a'
```

经测试，以上三种方法都能拿到 info 对象（webpack4）

## CommonJS 加载 ES6 模块 

```js
const name = 'fish'
const age = 30

export {
  name, 
  age
}

// main.js
const info = require('./a')
console.log(info.name, info.age) // fish 30
```

以上代码，info 其实是一个 es6 module 对象（webpack4 下），但是依旧可以正常获取 name 和 age

需要注意的是用 CommonJS 加载 ES6 用 export default 导出的模块

```js
const name = 'fish'
const age = 30

export default {
  name, age
}

// main.js
const info = require('./a')
console.log(info.default) // {name: "fish", age: 30}
```

取值的时候需要用 .default 去取

