<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList :data="singers" @select="selectSinger" />
    <!-- 通过这种方式传递数据给子路由组件 -->
    <router-view v-slot="{ Component }">
      <!-- 动态渲染 Component -->
      <transition appear name="slide">
        <component :is="Component" :singer="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {
  name: "Singer",
};
</script>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import storage from "good-storage";
import { CACHE_SINGER } from "@/assets/js/constants";
import IndexList from "@/components/base/IndexList";
import getSingerList from "@/service/singer";

const $router = useRouter();

const singers = ref([]);
const selectedSinger = ref(null);

onMounted(async () => {
  const result = await getSingerList();
  singers.value = result.singers;
});

function selectSinger(singer) {
  selectedSinger.value = singer; // 保留当前选中的singer，以防后面刷新丢失数据
  storage.session.set(CACHE_SINGER, singer);
  $router.push({
    path: `/singer/${singer.mid}`,
    params: {
      singer,
    },
  });
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
