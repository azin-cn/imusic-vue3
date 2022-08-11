import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VueLazyload from "vue-lazyload";

// 全局引入样式文件，此处引入变量|函数定义文件是无效的，对于scss定义的变量|函数|规则，配置scss-loader，如果不配置loader，那么需要使用scss定义的变量需要导入相应的scss文件
import "@/assets/scss/index.scss";

// 引入自定义指令
import loadingDirective from "@/components/base/Loading/directive";
import noResultDirective from "@/components/base/NoResult/directive";

createApp(App)
  .use(store)
  .use(router)
  .use(VueLazyload, {
    // require webpack支持的语法
    loading: require("@/assets/images/default.jpeg"),
  })
  .directive("loading", loadingDirective)
  .directive("no-result", noResultDirective)
  .mount("#app");
