<template>
  <div class="loading">
    <div class="loading-content">
      <img width="24" height="24" :src="state.images" alt="" />
      <p class="desc">{{ state.title }}</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, defineExpose } from "vue";
export default defineComponent({
  name: "Loading",
});
</script>

<script setup>
import { defineComponent, inject, reactive } from "vue";
import images from "./loading.gif";

/* 状态 */
const state = reactive({
  title: "正在载入...",
  images: inject("images", images),
});

/** 设置标题 */
function setTitle(title) {
  state.title = title;
}

defineExpose({
  setTitle, // 导出给其他组件使用
});
</script>

<style scoped lang="scss">
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);

  .loading-content {
    text-align: center;

    .desc {
      color: $color-text-l;
      font-size: $font-size-small;
      line-height: 20px;
    }
  }
}
</style>
