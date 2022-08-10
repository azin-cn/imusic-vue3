import { ref, computed, watch, nextTick } from "vue";

export default function useShortcut(props, groupRef) {
  // 在此处创建，在模板解析时被赋值，就能够拿到在Scroll组件中的暴露属性，即BetterScroll对象，狐疑理解组件导出的数据和组件实例两者的区别
  const scrollRef = ref(null);
  const ANCHOR_HEIGHT = ref(0);
  let scroll = null;

  watch(
    () => props.data,
    async () => {
      await nextTick(); // 等待一个时刻，也可以不用等待，因为Ref更新的时候自动出发了watch，就可以赋值了
      ANCHOR_HEIGHT.value =
        document.getElementsByClassName("shortcut")[0].children[0].children[0].clientHeight;
    }
  );

  watch(scrollRef, async () => {
    await nextTick(); // 等待一个时刻，也可以不用等待，因为Ref更新的时候自动出发了watch，就可以赋值了
    scroll = scrollRef.value.scroll;
  });

  const titles = computed(() => {
    // 获取titles，即快捷导航需要显示的内容序列
    return props.data.map((group) => {
      return group.title;
    });
  });

  // 通过data - index获取索引位置，利用bscroll通过的api，滚动到指定的位置，不再手动计算
  // 通过groupRef对象拿到子元素数组，通过bscroll的api滚动到指定的元素
  const start = {};
  function onShortcutTouchStart(e) {
    const index = e.target.dataset.index * 1;
    start.index = index;
    start.y = e.touches[0].pageY;
    scrollTo(index);
  }

  // 注意touchMove的实现与touchStart不一样，因为Move返回的target只是第一个出发的元素
  // 通过给定的坐标来实现，初始能够拿到一个坐标，move过程能够拿到实时的左边，最后通过坐标差距除于每个item的高度就能够得到差距多少个item
  // 最后通过e.target中的dataset获得初始触发的index，最后加上偏差即可
  function onShortcutTouchMove(e) {
    // const index = e.target.dataset.index * 1; // 初始触发元素的index，move过程中不会被改变
    const y = e.touches[0].pageY; // 当前被触发的对象的位置
    const diff = (y - start.y) / ANCHOR_HEIGHT.value;
    // 简单实现，不做正负分别判断
    const index = Math.round(start.index + diff); // 四舍五入 | 0可以表示向下取整
    scrollTo(index);
  }

  function scrollTo(index) {
    index = Math.max(0, Math.min(index, titles.value.length - 1)); // 判断最大最小值，防止越界报错
    const targetEl = groupRef.value.children[index];
    scroll.scrollToElement(targetEl, 0);
  }

  return {
    titles,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove,
  };
}
