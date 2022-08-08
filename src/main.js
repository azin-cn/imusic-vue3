import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VueLazyload from "vue-lazyload";

// 全局引入样式文件，此处引入变量|函数定义文件是无效的，对于scss定义的变量|函数|规则，配置scss-loader，如果不配置loader，那么需要使用scss定义的变量需要导入相应的scss文件
import "@/assets/scss/index.scss";

createApp(App)
  .use(VueLazyload, {
    // require webpack支持的语法
    loading: require("@/assets/images/default.jpeg"),
  })
  .use(store)
  .use(router)
  .mount("#app");
