import axios from "axios";

const ERR_OK = 0;
const BASE_URL = process.env.NODE_ENV === "production" ? "https://music.v3.azin.cn" : "/";

axios.defaults.baseURL = BASE_URL;

export function get(url, params) {
  return axios
    .get(url, {
      params,
    })
    .then((res) => {
      const { data } = res;
      // 封装的意义：方便后期的维护和拓展
      if (data.code === ERR_OK) {
        return data.result;
      }
    })
    .catch(console.log);
}
