import foo from './src/tagFunction';
import * as abc from './src/iterator';
import { me, assistant } from './src/modern-async-js/generator';
// import { fetchCurrentCity } from './src/modern-async-js/operation';
let name = 'Hand';
let orderNumber = '123';
let total = 319.7;

let msg = foo`Hello, ${name}, your \
order (#${orderNumber}) was $${total}.`;

console.log(msg);

// const operation = fetchCurrentCity();
// operation.setCallBacks(
//   result => console.log(result),
//   error => console.log(error)
// );

const meGenerator = me();
assistant(meGenerator)
  .catch(function rejectionReaction(err) {
    console.log('recover from error: ' + err);
  })
  .then(`Assistant is done`);
