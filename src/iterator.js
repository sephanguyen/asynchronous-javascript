export const obj = {
  [Symbol.iterator]() {
    let idx = this.start;
    let end = this.end;
    let it = {
      next: () => {
        if (idx <= end) {
          const value = this.values[idx];
          idx++;
          return { value, done: idx > end };
        }
        return { done: true };
      }
    };
    return it;
  },
  values: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26],
  start: 4,
  end: 13
};

var vals = [...obj];
console.log(vals);
