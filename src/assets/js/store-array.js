import storage from "good-storage";

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare);
  if (index > -1) return;
  arr.unshift(val);
  if (arr.length > maxLen) {
    arr.pop(); // 栈结构，保存最新的maxLen
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare);
  if (index === -1) {
    return;
  }
  arr.splice(index, 1);
}

export function save(key, value, compare, maxLen) {
  const localdata = storage.get(key, []);
  insertArray(localdata, value, compare, maxLen);
  storage.set(key, localdata);
  return localdata;
}

export function remove(key, compare) {
  const localdata = storage.get(key, []);
  deleteFromArray(localdata, compare);
  storage.set(key, localdata);
  return localdata;
}

export function load(key) {
  return storage.get(key, []);
}
