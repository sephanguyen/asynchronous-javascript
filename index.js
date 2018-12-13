import foo from './src/tagFunction';
import * as abc from './src/iterator';
let name = 'Hand';
let orderNumber = '123';
let total = 319.7;

let msg = foo`Hello, ${name}, your \
order (#${orderNumber}) was $${total}.`;

console.log(msg);
