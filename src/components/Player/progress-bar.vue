<template>
  <div class="progress-bar" ref="progressBarRef" @click="onClick">
    <div class="bar-inner">
      <div ref="progressRef" class="progress" :style="progressStyle"></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
};
</script>

<script setup>
import { defineProps, defineEmits, ref, computed, watch } from "vue";
import { useStore } from "vuex";
const props = defineProps({
  /** 进度，从0-1 */
  progress: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits(["progress-changing", "progress-changed"]);

const $store = useStore();
const progressBtnWidth = 16;
const progressBarRef = ref(null);
const progressRef = ref(null);
const offset = ref(0); // 偏移量
const touch = {
  x: 0, // 当前位置
  beginWidth: 0, // 进度条的初始宽度，已播放时长宽度
};

const progressStyle = computed(() => `width:${offset.value}px`);
const btnStyle = computed(() => `transform:translate3d(${offset.value}px,0,0)`);
const fullScreen = computed(() => $store.state["playerStore"].fullScreen);

watch(
  // 不适用computed，因为computed加载时就会执行一次
  () => props.progress,
  (newProgress) => {
    setOffset(newProgress);
  }
);

/** 设置偏移量 */
function setOffset(progress) {
  const barWidth = progressBarRef.value.clientWidth - progressBtnWidth;
  offset.value = barWidth * progress;
}

/** 开始拖动 */
function onTouchStart(e) {
  touch.x = e.touches[0].pageX;
  touch.beginWidth = progressRef.value.clientWidth; // 已播放时长宽度
}

/** 正在拖动 */
function onTouchMove(e) {
  const delta = e.touches[0].pageX - touch.x; // 偏移量
  const tempWidth = touch.beginWidth + delta; // 进度条宽度 + 偏移量
  const barWidth = progressBarRef.value.clientWidth - progressBtnWidth; // 拖动区域的真实长度，需要减去btn的宽度
  const progress = Math.min(1, Math.max(tempWidth / barWidth, 0));
  offset.value = barWidth * progress;
  emit("progress-changing", progress);
}

/** 结束拖动 */
function onTouchEnd(e) {
  const barWidth = progressBarRef.value.clientWidth - progressBtnWidth;
  const progress = progressRef.value.clientWidth / barWidth;
  emit("progress-changed", progress);
}

/** 点击 */
function onClick(e) {
  const rect = progressBarRef.value.getBoundingClientRect(); // 计算left、right等值
  const offsetWidth = e.pageX - rect.left;
  const barWidth = progressBarRef.value.clientWidth - progressBtnWidth;
  const progress = offsetWidth / barWidth;
  emit("progress-changed", progress);
}

defineExpose({
  setOffset,
});
</script>

<style scoped lang="scss">
.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgb(0 0 0 / 30%);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      top: -13px;
      left: -8px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        background: $color-theme;
        border: 3px solid $color-text;
        border-radius: 50%;
      }
    }
  }
}
</style>
