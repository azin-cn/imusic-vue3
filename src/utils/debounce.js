/**
 * debounce的判断条件应该是判断timer存在，最后一次才能执行，
 * 如果条件是判断timer不存在，那么需要注意自己的写法最后一次是否会执行。可以提供第一次是否立即执行
 * throttle是否是最后一次执行并不能固定的确定，可以提供一个渲染确定是否需要最后一次执行，通过debounce特性控制timer最后一次执行，如throttle调用debounce，debounce的delay为interval+1就能够保证最后一次运行
 * @param {*} fn
 * @param {*} delay
 * @param {*} callback
 * @returns
 */

export function debounce(
  fn,
  delay = 300,
  options = {
    callback: (result) => result,
  }
) {
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
      Promise.resolve(fn.apply(context, args)).then(options.callback);
    }, delay);
  };
}

export function throttle(
  fn,
  interval = 300,
  options = {
    callback: (result) => result,
  }
) {
  let timer = Date.now();
  return function execute() {
    const curr = Date.now();
    if (curr - timer < interval) return;

    timer = curr;
    const context = this;
    const args = arguments;
    Promise.resolve(fn.apply(context, args)).then(options.callback);
  };
}
