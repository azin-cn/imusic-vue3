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
});
