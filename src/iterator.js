export const obj = {
  *[Symbol.iterator]() {
    for (let i = this.start; i < this.end; i++) {
      yield this.values[i];
    }
  },
  values: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26],
  start: 4,
  end: 13
};

var vals = [...obj];
console.log(vals);

const number = {
  *[Symbol.iterator]({ start = 0, step = 1, end = 100 } = {}) {
    for (let i = start; i <= end; i = i + step) {
      yield i;
    }
  }
};

for (let num of number) {
  console.log(num);
}

for (let num of number[Symbol.iterator]({ start: 3, step: 4, end: 30 })) {
  console.log(num);
}
