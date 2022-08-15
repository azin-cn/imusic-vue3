# imusic
搜索接口失效，所以搜索页面不完善。

## Project setup
```
npm install
```

### Compiles and hot-reloads for development & production
```
npm run serve
npm run build
```

## 项目记录

### 第三方UI库的使用
- BetterScroll

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
这是一个真实数据的mork，通过webpack的devServer的before函数进行测试，默认端口号是9002。当后端返回的数据不直接符合页面的需求时，应该将数据处理这一部分进行分离，如一般抽离到backend文件夹中，页面的生命周期发送请求获得预期的数据，页面发送请求部分不再处理复杂数据的逻辑。
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

后端请求的逻辑详情以及数据的处理请看/backend/router
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

### IndexList组件 - 难点
#### 1. 动态显式内容，吸顶效果
实现原理：获取区间高度，数组后面的元素是前面各元素的高度和+元素本身的高度，也就是距离父元素的高度，通过监听滚动获取滚动的高度，判断滚动高度于区间高度的位置关系，最后就可以得到需要对应的位置关系，也就是得到需要显示的内容。注意：高度数组中第一个应为0，代表第一个元素之前的内容，起始也就是空。

在此期间，ref的定义位置、计算的时机、提前push一个0、通过await等待下一个时刻的计算，这些都是细节。

#### 2. 吸顶效果，后续递推
不仅仅只是更换显式内容，还有后一个的标题栏顶替前一个的标题栏。

实现原理：前一个子元素的底部就是后一个子元素的顶部，所以当前元素底部距离父元素顶部的高度=下一个元素顶部距离父元素顶部的高度，如果此时的距离小于标题栏的高度，此时上一个标题栏就可以被顶上去了。

因为子元素高度数组中，提前push了一个0，子元素向后移动1，所以原有的数组元素-滚动高度变为：
当前元素底部距离父元素顶部的高度 = 下一个元素顶部距离父元素顶部的高度 = 下一个数组元素 - 滚动高度

### script setup 结合 mapState，mapActions等使用
- 每一个map绑定$store
```js
const [playSelectedSong] = Object.values(mapActions("playerStore", ["playSelectedSong"])).map(
  (it) => it.bind({ $store })
);
```

### debounce throttle 实现
- debounce 第一次是否运行
- throttle 最后一次是否运行

记录有趣的查找过程：
```js
watch(source, callback);
```
在watch的回调函数中，原有的回调函数：
```js
(y) => {
  // 当滚动变化时，开始判断到底应该显示什么内容
  for (let i = 0; i < heightsv.length - 1; i++) {
    if (y >= heightsv[i] && y <= heightsv[i + 1]) {
      // 如果滚动的高度大于前面元素的高度和，从小到大排序，之所以写成这样是为了性能优化，保证只有一次匹配的机会，即只渲染一次
      currIndex.value = i;
      distance.value = heightsv[i + 1] - y; // 距离顶部的高度
    }
  }
  // 不必要的重复渲染，每一次响应式更新都会导致layout
  // for (const h of heightsv) {
  //   // if (y >= h) {
  //   //   currIndex.value++;
  //   // }
  // }
}
```

因为回调过快，选择使用debounce来限制，所以回调函数写成：
```js
debounce((y) => {
  // 当滚动变化时，开始判断到底应该显示什么内容
  for (let i = 0; i < heightsv.length - 1; i++) {
    if (y >= heightsv[i] && y <= heightsv[i + 1]) {
      // 如果滚动的高度大于前面元素的高度和，从小到大排序，之所以写成这样是为了性能优化，保证只有一次匹配的机会，即只渲染一次
      currIndex.value = i;
      distance.value = heightsv[i + 1] - y; // 距离顶部的高度
    }
  }
}, 10)
```

看起来好像没有问题，还是原来的y参数，还是原来的回调函数。但是分析可以知道：在这个过程中，y参数已经不直接等于原有的y参数了，其在debounce中经过了一次转移，恰好位置又对上了。

通常我们并不会在意，会默认加了debounce后原函数还是执行一样的功能，在使用上是正确的，但是在实际中这种情况还是得非常小心，因为一不注意参数就错乱了。

分析其实很简单，debounce后的y参数之所以还能够收到callback参数的值，其实就是apply、call的原因；
- apply、call将debounce返回的函数传入的参数即arguments，重新按照顺序传入了原回调函数，所以原回调函数与debounce中传入的fn的功能是一样的。当然也可以使用剩余参数。
```js
......
return function () {
  const context = this;
  const args = arguments;
  timer = setTimeout(() => {
    timer = clearTimeout(timer);
    fn.apply(context, args);
  })
}
```

### 性能优化的手段
- 最好使用的是ref对象，而不是普通DOM元素对象
- 宏观上的并发：Promise.all()

### 项目开发技巧
- 视图展示时的数据处理应尽可能的简单，即视图调用函数得到合适的数据结构。处理数据结构与视图组件分离。

如：在视图组件中，只调用一个方法getSingerDetail，凑成视图组件需要的数据结构单独发放在一个函数或一个文件中，便能达到组件开发的目的。
```js
export function getSingerDetail(singer) {
  return get("/api/getSingerDetail", {
    mid: singer.mid,
  });
}
```

- 开发接口代理
前端项目如果需要迭代，一定要开发接口代理，代理接口的功能和视图组件与数据逻辑处理分离两者功能是类似的，目的都是形成单独的组件，不参与数据逻辑处理，由数据驱动页面展示，页面要求数据结构规范。接口代理可以很方便的进行切换，如视图组件中get请求方法，前端中的后端即数据逻辑请求中，可以使用post等方法。

- 重新组织数据结构
不仅仅需要重新组织前端的接口，前端的数据结构也需要重新组织，如一些具有时限的数据，url，pic等，可能随着时间就会过期，所以前端的数据结构一定要合理组织。

- 如何开发一个组件
开发一个组件，需要从多个方面去考虑，如需求的功能、拓展的方向、样式的交互，需要清晰的文档要求。注意：数据驱动页面显示，处理好数据流向和watch一些问题就很容易解决。必须要先明确组件的需求和数据的定义、流向，这样封装出来的组件才更具有通用性。**组件：数据+页面，规定好数据流向**

- Vue复杂组件使用hooks管理

- 通过数据驱动页面的显示，composition API 很容易进行数据交互，通过函数传递参数，需要注意不要结构对象，否则无法保持响应式功能。

- 在vue中进行dom访问、操作，一般需要在 **nextTick** 后才能够保证正确的环境，设置一个DOM时，注意访问DOM的时机是否正确

- 逻辑、边界的情况一定需要清楚，否则看似解决一个bug写出的代码又会引入另外一个bug，所以理清楚数据流向和DOM的更新时间才是解决bug的方式

- 通过optionsAPI封装一个组件，通过定义传入的数据来决定产生哪种类型的组件，通常定义为一个类型相同的组件类型。对于普通的optionsAPI组件来说，定义为一个组件方法进行复用或许更加的合适，因为optionsAPI是一个对象，如果时setup script 比较难以实现复用。

- 通过控制某一些属性来控制组件渲染不同的形式，普通的列表 || 排行的列表

- v-model的流向和props的修改，如何实现双向绑定过程，watch必须要是一个响应式对象 | getter |effect函数，props.value 形式是一个普通值对象。


### 常见JS技巧
- 向下取整： 1.22 | 0 === Math.floor(1.22)


### 常见的css技巧
- 显示区域的宽高比常使用margin、padding，因为margin、padding都是相对于父元素的宽度，在文档流中，子元素margin、padding百分比相对于父元素的content宽度；在脱离标准流中，子元素margin、padding百分比相对于外围第一个定位非static、initial、unset父元素的content+padding的宽度。
```css
width: 100%;
/* height: 0; */
padding-top: 70%; 
margin、padding都是相对于父元素的width，height相对于父元素的height。此时显示区域的比值就是10:7，这是常用的固定比值做法。
```

- overflow不能限制溢出到padding的内容，overflow: hidden; 可以使子元素溢出父元素外后隐藏。padding 是内边距，是元素的一部分，所以溢出到 padding 里不属于溢出父元素，overflow 就不会使之隐藏。即如果设置padding-top: 32px；即使设置overflow:hidden; height=0，高度还是padding-top；