/**
 * vue自定义指令封装成一个对象，指令对象需要具有特殊的属性，如mounted、updated等
 * vue会在特定的时刻回调指令对象的特定属性方法。
 *
 * 全局注册
 * 用 Vue.directive() 方法来进行注册, 任意.vue文件里都可以直接用v-foo指令
 * Vue.directive()有两个参数，一个是指令名称，另外一个是指令对象，指令对象具有三个钩子函数。
 * 钩子函数：bind(绑定事件触发)、inserted(节点插入DOM时触发)、update(组件内相关更新)
 *
 * 局部注册
 * 在相应的组件中，optionsAPI的directives属性定义
 * 注意: inserted方法 - 指令所在标签, 被插入到网页上触发(一次)
 *       update方法 - 指令对应数据/标签更新时, 此方法执行
 * directives: {
 *   loading: {
 *     inserted() {}.
 *     updated() {}
 *   }
 * }
 *
 * vue3更新了自定义指令的某些属性名称，如inserted改为mounted，全局注册：Vue -> app.directive('focus', {})，
 * https://www.runoob.com/vue3/vue3-custom-directive.html
 *
 * 常用的属性钩子函数
 * mounted : 在绑定元素的父组件被挂载后调用。
 * updated: 在包含组件的 VNode 及其子组件的 VNode 更新后调用。
 * beforeUnmount: 当指令与在绑定元素父组件卸载之前时，只调用一次。
 * unmounted: 当指令与元素解除绑定且父组件已卸载时，只调用一次。
 * ......
 *
 * 钩子函数参数
 * el 指令绑定到的元素。这可用于直接操作 DOM。
 * binding 是一个对象，包含以下属性：
 *   instance：使用指令的组件实例。
 *   value：传递给指令的值。例如，在 v-my-directive="1 + 1" 中，该值为 2。
 *   oldValue：先前的值，仅在 beforeUpdate 和 updated 中可用。值是否已更改都可用。
 *   arg：参数传递给指令 (如果有)。例如在 v-my-directive:foo 中，arg 为 "foo"。
 *   ......
 * vnode 作为 el 参数收到的真实 DOM 元素的蓝图。
 * prevNode 上一个虚拟节点，仅在 beforeUpdate 和 updated 钩子中可用。
 *
 */

/**
 * 开发自定义指令，需要明确指令需求即要求指令做什么
 * v-loading 为true时（加载）将Loading组件挂载到容器内，false时（卸载）移除组件
 */
import { createApp } from "vue";
import Loading from "./index";

// 除了可以使用createApp外，可以在main.js入口中使用已经创建好的app对象。
// Vue开发中app对象不是唯一的，只是表明创建了一个vnode
// 并不代表一定会挂载到id=app的根组件上，因为最后是一个mount方法决定挂载的位置

export const directive = {
  mounted(el, binding) {
    const app = createApp(Loading);
    const instance = app.mount(document.createElement("div")); // 一个组件实例VNode，此时$el属性就表示真实DOM元素对象
    el.$instance = instance; // 保留在真实el上

    const title = binding.arg; // 通过自定义指令传参
    if (typeof title !== "undefined") {
      instance.setTitle(title); // 记住，这就是组件实例，可以直接调用组件实例的方法
    }

    if (binding.value) {
      _appendChild(el);
    }
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      // 需要进行判断，如两次都可能时true，此时就不需要更新
      binding.value ? _appendChild(el) : _removeChild(el);
    }
  },
};

let hasPosition = false;

function _appendChild(el) {
  const style = getComputedStyle(el);
  // loading定位组件是一个absolute组件，所以需要外层的定位
  if (["relative", "absolute", "fixed", "sticky"].indexOf(style.position) === -1) {
    el.style.position = "relative";
    hasPosition = true;
  }
  el.appendChild(el.$instance.$el); // 将VNode中的$el真实DOM挂载到el上
}

function _removeChild(el) {
  if (!hasPosition) {
    el.style.position = "";
  }
  el.removeChild(el.$instance.$el);
}

export default directive;
