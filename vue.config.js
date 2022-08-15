const { defineConfig } = require("@vue/cli-service");
const registerRouter = require("./backend/router");
module.exports = defineConfig({
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `,
      },
    },
  },
  devServer: {
    onBeforeSetupMiddleware({ app }) {
      registerRouter(app);
    },
  },
  productionSourceMap: false,
  // publicPath: "./", 默认
  // assetsDir: "static",

    // 设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性
    crossorigin: undefined,
});
