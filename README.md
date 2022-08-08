# imusic

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

## 项目记录
### Scss
全局引入的是样式文件，若全局引入scss定义的变量|函数文件是无效的，组件引用scss定义的变量|函数|规则，有两种方案：
1. 组件单独引入scss变量文件
2. 配置scss-loader，给每个组件添加变量文件的导入语句。
```js
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
```

### 配置backend
这是一个真实数据的mork，通过webpack的devServer的before函数进行测试，默认端口号是9002，
- 将以下依赖加入packages.json中
```json
"dependencies"
  ......
  "compression": "^1.7.4",
  "cookie-parser": "^1.4.6",
  "express": "^4.18.1",
  "js-base64": "^3.7.2",
  "pinyin": "^2.11.1"
```

- vue.config.js加入配置，注意before被替换成onBeforeSetupMiddleware函数
```js
const registerRouter = require("./backend/router");
module.exports = defineConfig({
  ......
  devServer: {
    onBeforeSetupMiddleware({ app }) {
      registerRouter(app);
    },
  },
});
```
- 再次执行 `npm install`，然后重启项目

### 响应式
注意使用ref时是否还保持着响应式，如果将.value直接传入其他的函数是无法保持响应式的。setup中定义在顶层的变量|函数可以直接在模板中使用。如果希望数据是响应式的，那么还是要加上ref或reactive。

不要为了使用composition API而忽略options API，对于小型组件，optionsAPI 是最好的描述方式。

### 图片懒加载 vue-lazyload
插件提供了自定义指令，如果需要了解自定义指令，甚至于自定义指令的执行过程，可以详细的看看mini-vue的实现。