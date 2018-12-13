import foo from './src/tagFunction';

let name = 'Hand';
let orderNumber = '123';
let total = 319.7;

let msg = foo`Hello, ${name}, your \
order (#${orderNumber}) was $${total}.`;

console.log(msg);
