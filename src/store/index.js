import { createStore, createLogger } from "vuex";
import { playerStore } from "./player-store";

const debug = process.env.NODE_ENV !== "production";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    playerStore,
  },
  strict: debug, // 严格模式，开发环境
  plugins: debug ? [createLogger()] : [],
});
