<template>
  <div class="recommend" v-loading:[loadingText]="loading">
    <Scroll class="wrapper">
      <div class="container">
        <div class="slider-wrapper">
          <Slider v-if="sliders.length" :sliders="sliders" />
        </div>
        <div class="recommend-list">
          <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="item in albums" :key="item.id" @click="selectAlbum(item)">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.pic" alt="" />
              </div>
              <div class="text">
                <h2 class="name">{{ item.username }}</h2>
                <p class="title">{{ item.title }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>

    <!-- 通过这种方式传递数据给子路由组件 -->
    <router-view v-slot="{ Component }">
      <!-- 动态渲染 Component -->
      <transition appear name="slide">
        <component :is="Component" :data="selectedAlbum" />
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {
  name: "Recom",
};
</script>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";

import Scroll from "@/components/base/WrapperScroll";
import Slider from "@/components/base/Slider";

import { getRecom } from "@/service/recom";
import { CACHE_ALBUM } from "@/assets/js/constants";
import storage from "good-storage";

const $router = useRouter();
const loadingText = "正在加载...";
const sliders = ref([]),
  albums = ref([]);
const loading = computed(() => !albums.value.length);
const selectedAlbum = ref(null);

onMounted(async () => {
  let result = await getRecom();
  sliders.value = result.sliders;
  albums.value = result.albums;
});

function selectAlbum(album) {
  selectedAlbum.value = album; // 保留当前选中的singer，以防后面刷新丢失数据
  storage.session.set(CACHE_ALBUM, album);
  $router.push({
    path: `/recom/${album.id}`,
  });
}
</script>

<style scoped lang="scss">
.recommend {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
  overflow: scroll;
  .wrapper {
    overflow: hidden;
    height: 100%;

    .slider-wrapper {
      overflow: hidden;
      position: relative; // slide组件相对于此定位
      width: 98%;
      margin: 6px auto;
      border-radius: 12px;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        color: $color-theme;
        font-size: $font-size-medium;
        line-height: 65px;
        text-align: center;
      }

      .item {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          font-size: $font-size-medium;
          line-height: 20px;
        }

        .name {
          margin-bottom: 10px;
          color: $color-text;
        }

        .title {
          color: $color-text-d;
        }
      }
    }
  }
}
</style>
