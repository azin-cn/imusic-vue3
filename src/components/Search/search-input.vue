<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <input class="input-inner" v-model="query" :placeholder="placeholder" type="text" />
    <i v-show="query" class="icon-dismiss" @click="clear"></i>
  </div>
</template>

<script>
export default {
  name: "SearchInput",
};
</script>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import { debounce } from "@/utils/debounce";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "搜索歌曲，歌手",
  },
});

const emit = defineEmits(["update:modelValue"]);

const inputRef = ref(null);
const query = ref(props.modelValue);

const demit = debounce((newQuery) => {
  console.log(newQuery);
  emit("update:modelValue", newQuery.trim());
}, 300);
watch(query, demit);

watch(
  // 监听外部传值，此时需要一个函数包裹
  () => props.modelValue,
  (value) => {
    query.value = value;
  }
);

/** 清空 */
function clear() {
  query.value = "";
}
</script>

<style scoped lang="scss">
.search-input {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  padding: 0 6px;
  background: $color-highlight-background;
  border-radius: 6px;

  .icon-search {
    color: $color-text-d;
    font-size: 24px;
  }

  .input-inner {
    flex: 1;
    margin: 0 5px;
    color: $color-text;
    font-size: $font-size-medium;
    line-height: 18px;
    background: $color-highlight-background;
    outline: 0;

    &::placeholder {
      color: $color-text-d;
    }
  }

  .icon-dismiss {
    color: $color-text-d;
    font-size: 16px;
  }
}
</style>
