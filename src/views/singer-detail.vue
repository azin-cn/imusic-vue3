<template>
  <div class="singer-detail">
    <MusicList :songs="songs" :loading="loading" :pic="pic" :title="title" />
  </div>
</template>

<script>
export default {
  name: "SingerDetail",
};
</script>

<script setup>
import { defineProps, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import storage from "good-storage";

import { CACHE_SINGER } from "@/assets/js/constants";
import MusicList from "@/components/MusicList";
import { getSingerDetail, processSongsUrl } from "@/service/singer";

const { singer } = defineProps({
  singer: {
    type: Object,
    default: () => ({}),
  },
});

const songs = ref([]);
const loading = ref(true);
const computedSinger = computed(() => {
  const cacheSinger = storage.session.get(CACHE_SINGER);
  if (!singer && !cacheSinger) {
    //如果两个都不存在，返回上一级路由
    useRouter().go(-1);
    return;
  }
  return singer || cacheSinger; // 如果singer存在则使用singer，如果不存在即刷新时，使用缓存singer
});

const pic = computed(() => computedSinger.value.pic);
const title = computed(() => computedSinger.value.name);

(async () => {
  // setup函数执行时发送请求
  const singer = computedSinger.value;
  let result = await getSingerDetail(singer);
  songs.value = await processSongsUrl(result.songs);
  loading.value = false;
})();
</script>

<style scoped lang="scss">
.singer-detail {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  background: $color-background;
}
</style>
