<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Scroll",
};
</script>

<script setup>
import { ref, defineProps } from "vue";
import useScroll from "./use-scroll";

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

const rootRef = ref(null);
useScroll(rootRef, props, emit);
</script>

<style lang="scss" scoped></style>
