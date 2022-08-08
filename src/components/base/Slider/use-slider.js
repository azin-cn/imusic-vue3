import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";

import { onMounted, onUnmounted, ref } from "vue";

// 注册插件
BScroll.use(Slide);

export default function useSlider(wrapperRef /* 容器ref */) {
  const slider = ref(null); // 或直接使用reactive，但是reactive是深层次的
  const curr = ref(0);

  onMounted(() => {
    const sval = (slider.value = new BScroll(wrapperRef.value, {
      click: true,
      scrollX: true,
      scrollY: false,
      momentum: false,
      bounce: false,
      probeType: 2,
      slide: true,
    }));
    sval.on("slideWillChange", (page) => {
      curr.value = page.pageX; // 表示横坐标的页码
    });
  });

  onUnmounted(() => {
    slider.value.destroy();
  });

  return { slider, curr };
}
