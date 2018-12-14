import foo from './src/tagFunction';
import * as abc from './src/iterator';
import { fetchCurrentCity } from './src/modern-async-js/operation';
let name = 'Hand';
let orderNumber = '123';
let total = 319.7;

let msg = foo`Hello, ${name}, your \
order (#${orderNumber}) was $${total}.`;

console.log(msg);

const operation = fetchCurrentCity();
operation.setCallBacks(
  result => console.log(result),
  error => console.log(error)
);
