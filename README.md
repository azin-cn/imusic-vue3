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

