// CommonJS
const { num, incNum } = require('./c')

console.log('以下 CommonJS 执行结果：')
console.log('num 的原始值是： ', num)

incNum()
incNum()

console.log('incNum 执行两次后 num 值变为： ', num)

console.log('\n')

// ---------------------------- //
// ES6 modules
import { num as _num, incNum as _incNum} from './e'

console.log('以下 ES6 modules 执行结果：')
console.log('num 的原始值是： ', _num)

_incNum()
_incNum()

console.log('incNum 执行两次后 num 值变为： ', _num)

console.log('\n')