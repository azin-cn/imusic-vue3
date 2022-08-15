<template>
  <Scroll
    ref="scrollRef"
    :click="click"
    :probe-type="probeType"
    @scroll="
      (e) => {
        emit('scroll', e);
      }
    "
  >
    <slot></slot>
  </Scroll>
</template>

<script>
export default {
  name: "WrapperScroll",
};
</script>

<script setup>
import { ref, computed, watch, nextTick, defineExpose } from "vue";

import { useMapState } from "@/utils";

import Scroll from "../Scroll";

const props = defineProps({
  click: {
    type: Boolean,
    default: true,
  },
  probeType: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits(["scroll"]);

const scrollRef = ref(null);
const scroll = computed(() => scrollRef.value.scroll);
const { playlist } = useMapState(["playlist"], "playerStore");

// 如果不是全屏状态，并且当前的playlist有值，即显示mini-player，相应的list应该增加bottom，这里利用技巧，将bottom放在app中添加
// 思想就是：由于mini-player的原因，导致被遮挡，被遮挡的有recom、singer-list、song-list。song-list单独添加bottom，recom、singer-list在app中进行添加
watch(playlist, async (list) => {
  // keep-alive时才生效
  if (list.length) {
    await nextTick();
    scroll.value.refresh();
  }
});

defineExpose({
  scroll,
});
</script>

<style scoped lang="scss"></style>
