import storage from "good-storage";

export function saveSessionStorage(key, value) {
  storage.session.set(key, value);
}
