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
使用ref时需要注意是否还保持着响应式，如果直接将counter.value传入其他的函数并进行修改是无法保持响应式的。setup script中定义在顶层的变量|函数可以直接在模板中使用。如果希望数据是响应式的，那么还是要加上ref或reactive。

不要为了使用composition API而忽略options API，对于小型组件，optionsAPI 是最好的描述方式。

### 图片懒加载 vue-lazyload
插件提供了自定义指令，如果需要了解自定义指令，甚至于自定义指令的执行过程，可以详细的看看mini-vue的实现。

### v-loading 自定义指令的实现
自定义指令目的通常是操作DOM。如果需要自定义一个loading组件，并且在使用时可以不用自己导入，减轻负担，那么此时就可以使用自定义指令。

vue自定义指令封装成一个对象，指令对象需要具有特殊的属性，如mounted、updated等，vue会在特定的时刻回调指令对象的特定属性方法。

全局注册
用 Vue.directive() 方法来进行注册, Vue.directive()有两个参数，指令名称和指令对象

局部注册
在相应的组件中，optionsAPI的directives属性定义
- inserted方法 - 指令所在标签, 被插入到网页上触发(一次)
- update方法 - 指令对应数据/标签更新时, 此方法执行
- ......
```js
directives: {
  loading: {
    inserted() {}.
    updated() {}
  }
}
```

vue3更新了自定义指令的某些属性名称，如inserted改为mounted，全局注册：Vue -> app.directive('focus', {})，

https://www.runoob.com/vue3/vue3-custom-directive.html


常用的属性钩子函数
- mounted : 在绑定元素的父组件被挂载后调用。
- updated: 在包含组件的 VNode 及其子组件的 VNode 更新后调用。
- beforeUnmount: 当指令与在绑定元素父组件卸载之前时，只调用一次。
- unmounted: 当指令与元素解除绑定且父组件已卸载时，只调用一次。
- ......
钩子函数参数
- el 指令绑定到的元素。这可用于直接操作 DOM。
- binding 是一个对象，包含以下属性：
  - instance：使用指令的组件实例。
  - value：传递给指令的值。例如，在 v-my-directive="1 + 1" 中，该值为 2。
  - oldValue：先前的值，仅在 beforeUpdate 和 updated 中可用。值是否已更改都可用。
  - arg：参数传递给指令 (如果有)。例如在 v-my-directive:foo 中，arg 为 "foo"。
  - ......
- vnode 作为 el 参数收到的真实 DOM 元素的蓝图VNode。
- prevNode 上一个虚拟节点，仅在 beforeUpdate 和 updated 钩子中可用。