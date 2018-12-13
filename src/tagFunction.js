export default function foo(strings, ...values) {
  var str = '';

  for (let i = 0; i < strings.length; i++) {
    if (i > 0) str += values[i - 1];
    str += strings[i];
  }
  return str;
}

let name = 'Hand';
let orderNumber = '123';
let total = 319.7;

let msg = foo`Hello, ${name}, your \
order (#${orderNumber}) was $${total}.`;
