function debounce(fn, delay = 300, callback = (result) => result) {
  let timer;
  return function execute() {
    if (timer) {
      // 应该判断timer存在，如果判断不存在会有一个漏洞：最后一次不能执行
      timer = clearTimeout(timer);
    }
    const context = this;
    const args = arguments;
    timer = setTimeout(() => {
      timer = clearTimeout(timer);
      Promise.resolve(fn.apply(context, args)).then(callback);
    }, delay);
  };
}

function throttle(fn, interval = 300, callback = (result) => result) {
  let timer;
  return function execute() {
    if (timer) return;

    const context = this;
    const args = arguments;
    timer = setTimeout(() => {
      timer = clearTimeout(timer); // 执行完成后，销毁并复制为undefined
      Promise.resolve(fn.apply(context, args)).then(callback);
    }, interval);
  };
}

let i = 0;
const d = throttle(
  () => {
    console.log("++++++++", i);
    return i;
  },
  200,
  (res) => {
    console.log("res", res);
  }
);
// let timer = setInterval(() => {
//   i++;
//   console.log(i);
//   d();
//   if (i === 11) {
//     clearTimeout(timer);
//   }
// }, 100);

console.log(Date.now());

console.log((1.22 & 1) === Math.floor(1.22));
