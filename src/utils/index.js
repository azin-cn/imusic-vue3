export { debounce, throttle } from "./debounce";
export { useMapState } from "./hooks";

export function shuffle(source) {
  const target = source.slice();
  for (let i = 0; i < target.length; i++) {
    const j = getRandomInt(i);
    swap(target, i, j);
  }
  return target;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

function swap(arr, i, j) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

export function formatTime(time = 0) {
  const minute = `${Math.floor(time / 60)}`.padStart(2, "0"); // 总长两位，用0填充不足
  const second = `${Math.floor(time % 60)}`.padStart(2, "0");
  return `${minute}:${second}`;
}
