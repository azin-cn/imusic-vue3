import { onMounted, onUnmounted, ref } from "vue";
import BScroll from "@better-scroll/core";
import PullDown from "@better-scroll/pull-down";
import ObserveDOM from "@better-scroll/observe-dom";

BScroll.use(ObserveDOM).use(PullDown);

export default function useScroll(wrapperRef, options, emit) {
  const scroll = ref(null);
  onMounted(() => {
    const sval = (scroll.value = new BScroll(wrapperRef.value, {
      // pullDownRefresh: true,
      observeDOM: true, // 开启 observe-dom 插件
      ...options,
    }));

    if (options.probeType > 0) {
      // 通过自定义事件，emit发送
      sval.on("scroll", (pos) => emit("scroll", pos));
    }
  });

  onUnmounted(() => {
    scroll.value.destroy();
  });

  return { scroll };
}
