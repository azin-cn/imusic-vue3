function localStorageGet(key) {
  return localStorage.getItem(key);
}

function localStorageSet(key, value) {
  localStorage.setItem(key, value); // 监听是否成功
}

function get(key, defaultValue) {
  // const value =
  return JSON.parse();
}

function set(key, value) {
  if (typeof value === "function") {
    throw new Error("cannot set value, which is a function");
  }
}

const storage = {
  session: {},
  get,
  set,
};

export default storage;
