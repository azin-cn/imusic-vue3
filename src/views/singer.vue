<template>
  <div class="singer" v-loading="!singerList.length"><IndexList :data="singerList" /></div>
</template>

<script>
export default {
  name: "Singer",
};
</script>

<script setup>
import { ref, onMounted } from "vue";
import IndexList from "@/components/base/IndexList";
import getSingerList from "@/service/singer";

const singerList = ref([]);
onMounted(async () => {
  const result = await getSingerList();
  singerList.value = result.singers;
});
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
