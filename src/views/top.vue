<template>
  <div class="top" v-loading="loading">
    <scroll class="top-content">
      <ul>
        <li class="item" v-for="item in topList" :key="item.id" @click="selectTop(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.pic" alt="" />
          </div>
          <ul class="song-list">
            <li class="song" v-for="(song, index) in item.songList" :key="song.id">
              <span>{{ index + 1 }}.</span>
              <span>{{ song.songName }}-{{ song.singerName }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedTop" />
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {
  name: "Top",
};
</script>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import storage from "good-storage";

import { getTopList } from "@/service/top";
import { CACHE_TOP_LIST } from "@/assets/js/constants";

import Scroll from "@/components/base/Scroll";
const $router = useRouter();

const topList = ref(null);
const selectedTop = ref(null);

const loading = computed(() => !topList.value?.length);

/** 获取数据 */
async function fetchData() {
  const result = await getTopList();
  topList.value = result.topList;
}

/** 选择排行榜 */
function selectTop(top) {
  storage.session.set(CACHE_TOP_LIST, top); //  保留当前被选中的数据，防止之后刷新丢失数据，多个组件使用类似的函数，可以封装成一个方法
  $router.push({
    path: `/top/${top.id}`,
  });
}

onMounted(() => {
  fetchData();
});
</script>

<style scoped lang="scss">
.top {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;

  .top-content {
    height: 100%;
    overflow: hidden;

    .item {
      display: flex;
      height: 100px;
      margin: 0 20px;
      padding-top: 20px;

      &:last-child {
        padding-bottom: 20px;
      }

      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }

      .song-list {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        height: 100px;
        padding: 0 20px;
        overflow: hidden;
        color: $color-text-d;
        font-size: $font-size-small;
        background: $color-highlight-background;

        .song {
          line-height: 26px;
          @include no-wrap();
        }
      }
    }
  }
}
</style>
