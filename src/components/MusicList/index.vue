<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div ref="bgImageRef" class="bg-image" :style="bgImageStyle">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div class="play-btn" v-show="songs.length">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle" />
    </div>

    <Scroll
      class="list"
      :style="scrollStyle"
      :probe-type="3"
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <SongList :songs="songs" :rank="rank" @select="selectItem" />
      </div>
    </Scroll>
  </div>
</template>

<script>
export default {
  name: "MusicList",
};
</script>

<script setup>
import { defineProps, onMounted, ref, reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
import Scroll from "@/components/base/Scroll";
import SongList from "@/components/base/SongList";

import { throttle } from "@/utils";

const { songs, title, rank, loading, noResultText, ...props } = defineProps({
  /** 歌曲列表 */
  songs: {
    type: Array,
    default: () => [],
  },
  /** 标题 */
  title: {
    type: String,
    default: "",
  },
  /** 头图 */
  pic: {
    type: String,
    default: "",
  },
  /** 加载状态 */
  loading: {
    type: Boolean,
    default: true,
  },
  /** 无歌曲文案 */
  noResultText: {
    type: String,
    default: "抱歉，没有找到可播放的歌曲",
  },
  /** 是否排行榜 */
  rank: {
    type: Boolean,
    default: false,
  },
});

const $router = useRouter();
const HEAD_HEIGHT = 40;
const bgImageRef = ref(null);

const state = reactive({
  imageHeight: 0,
  scrollY: 0,
  maxTranslateY: 0,
});

onMounted(() => {
  state.imageHeight = bgImageRef.value.clientHeight;
  state.maxTranslateY = state.imageHeight - HEAD_HEIGHT; // 能够滚动的最大距离就是图片高度减去HEAD高度
});

const noResult = computed(() => {
  return !loading && !songs.length; // 加载完成 | 数据长度为0
});

/** 头图样式 */
const bgImageStyle = computed(() => {
  const { scrollY, maxTranslateY } = state;

  let zIndex = 0;
  let paddingTop = "70%";
  let height = "0";

  let scale = 1;
  let translateZ = 2;

  if (scrollY > maxTranslateY) {
    // 如果滚动的高度大于最大的高度，此时开始限制，此时不能设置为等于，如果等于那么高度就不会变化
    zIndex = 10;
    paddingTop = 0;
    height = `${HEAD_HEIGHT}px`;
  }

  if (scrollY < 0) {
    scale = -scrollY / 50;
    if (scale < 1) {
      scale = 1;
    }
  }

  return {
    zIndex,
    paddingTop,
    height,
    backgroundImage: `url(${props.pic})`,
    transform: `scale(${scale})  translateZ(${translateZ}px)`,
  };
});

/** 播放按钮样式 */
const playBtnStyle = computed(() => {
  const { scrollY, maxTranslateY } = state;
  let display = "";
  if (scrollY >= maxTranslateY) display = "none";
  return {
    display,
  };
});

/** 毛玻璃样式 */
const filterStyle = computed(() => {
  const { maxTranslateY, imageHeight, scrollY } = state;
  let blur = 0;
  if (scrollY >= 0) {
    blur = Math.min(maxTranslateY / imageHeight, scrollY / imageHeight) * 20;
  }
  return {
    backdropFilter: `blur(${blur}px)`,
  };
});

/** 滚动组件样式 */
const scrollStyle = computed(() => {
  return {
    top: `${state.imageHeight}px`,
  };
});

/** 返回 */
function goBack() {
  $router.back();
}

// /** 随机播放 */
// function random() {
//   store.dispatch("randomPlay", { list: props.songs });
// }

/** 监听滚动 */
const onScroll = throttle((pos) => {
  state.scrollY = -pos.y;
}, 10);

/** 歌曲选择 */
// function selectItem({ song, index }) {
//   store.dispatch("selectPlay", { list });
// }
</script>

<style scoped lang="scss">
.music-list {
  position: relative;
  height: 100%;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);

    .icon-back {
      display: block;
      padding: 10px;
      color: $color-theme;
      font-size: $font-size-large-x;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 20;
    width: 80%;
    color: $color-text;
    font-size: $font-size-large;
    line-height: 40px;
    text-align: center;
    transform: translateZ(2px);
    @include no-wrap();
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%; // overflow无法限制, margin、padding都是相对于父元素的width，height相对于父元素的height。此时显示区域的比值就是10:7，这是常用的比值区域的做法。
    background-size: cover;
    transform-origin: top;
    transition: transfrom 0.6s cubic-bezier(0.62, 0.28, 0.44, 0.84);

    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;

      .play-btn {
        box-sizing: border-box;
        width: 135px;
        margin: 0 auto;
        padding: 7px 0;
        color: $color-theme;
        font-size: 0;
        text-align: center;
        border: 1px solid $color-theme;
        border-radius: 100px;
      }

      .icon-play {
        display: inline-block;
        margin-right: 6px;
        font-size: $font-size-medium-x;
        vertical-align: middle;
      }

      .text {
        display: inline-block;
        font-size: $font-size-small;
        vertical-align: middle;
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgb(7 17 27 / 40%);
    }
  }

  .list {
    position: absolute;
    bottom: 0;
    z-index: 0;
    width: 100%;

    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
