import { ref, watch, nextTick, computed } from "vue";
import { debounce, throttle } from "@/utils";

// 组件的渲染都是在下一个时刻，所以等待下一个时刻进行计算就能够拿到正确的高度
export default function useFixed(props) {
  const groupRef = ref(null); // 滚动的元素ref对象，即container，最终返回交给父组件使用，但是需要此处生成
  const heights = ref([]); // 子元素高度数组，定义为一个累加的数组，即C元素等于前面的A、B元素高度和+C本身的高度
  const heightsv = heights.value;
  const scrollY = ref(0);
  const currIndex = ref(0);
  const fixedTitle = computed(() => {
    const currGroup = props.data[currIndex.value];
    return currGroup ? currGroup.title : "";
  });

  watch(
    () => props.data, // 监听源
    async () => {
      await nextTick(); // 因为calc中的groupRef只有等到vue渲染完成后才能拿到，所以需要等待一个nextTick
      calc();
    }
  );

  watch(
    scrollY,
    debounce((y) => {
      // 当滚动变化时，开始判断到底应该显示什么内容
      for (let i = 0; i < heightsv.length - 1; i++) {
        if (y >= heightsv[i] && y <= heightsv[i + 1]) {
          // 如果滚动的高度大于前面元素的高度和，从小到大排序，之所以写成这样是为了性能优化，保证只有一次匹配的机会，即只渲染一次
          currIndex.value = i;
        }
      }

      // 不必要的重复渲染
      // for (const h of heightsv) {
      //   // if (y >= h) {
      //   //   currIndex.value++;
      //   // }
      // }
    }, 100)
  );

  // 计算子元素的高度，首次加载运行时，groupRef为null，需要等待下一个时刻nextTick挂载完成后再运行
  function calc() {
    const children = groupRef.value.children; // 通过ref对象.value拿到dom元素，接着拿到子元素
    heightsv.length = 0; // 每次组件更新，重新计算，设置heights=[]

    let height = 0; // 滚动的高度
    heightsv.push(height); //0 目的是再0-1之间，即表示第一个元素之前

    for (const child of children) {
      height += child.clientHeight; // 数组的元素值是前面的元素高度和+本身的高度
      heightsv.push(height);
      console.log(height);
    }
  }

  function onScroll(pos) {
    scrollY.value = -pos.y;
  }

  return {
    groupRef,
    onScroll,
    fixedTitle,
  };
}
