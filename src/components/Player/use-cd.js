import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
export default function useCD() {
  const $store = useStore();

  const cdRef = ref(null);
  const cdImageRef = ref(null);

  const playing = computed(() => $store.state["playerStore"].playing);
  const cdCls = computed(() => {
    return playing.value ? "playing" : "no-playing";
  });

  watch(playing, (state) => {
    if (!state) {
      // 当playing暂停时，需要记录此时渲染的角度，因为使用animation动画暂停时会重置
      syncTransform(cdRef.value, cdImageRef.value); // 同步角度
    }
  });

  function syncTransform(wrapper, inner) {
    const wrapperTransformStyle = getComputedStyle(wrapper).transform;
    const innnerTransformStyle = getComputedStyle(inner).transform;
    wrapper.style.transform = // 因为animation是相对于初始位置进行旋转的，所以为了避免突兀，还需要父元素的旋转角度，相当于旋转了两次
      wrapperTransformStyle === "none"
        ? innnerTransformStyle
        : wrapperTransformStyle.concat(" ", innnerTransformStyle);
  }

  return {
    cdRef,
    cdImageRef,
    cdCls,
  };
}
