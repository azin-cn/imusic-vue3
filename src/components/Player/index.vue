<template>
  <div class="player">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.pic" alt="" />
        </div>

        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back" />
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>

        <div
          class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <div class="middle-l" :style="middleLStyle">
            <div ref="cdWrapperRef" class="cd-wrapper">
              <div ref="cdRef" class="cd">
                <img ref="cdImageRef" class="image" :class="cdCls" :src="currentSong.pic" alt="" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric || "WoW" }}</div>
            </div>
          </div>

          <Scroll class="middle-r" :style="middleRStyle" ref="lyricScrollRef">
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p
                  class="text"
                  :class="{ current: currentLineNum === index }"
                  v-for="(line, index) in currentLyric.lines"
                  :key="index"
                >
                  {{ line.txt }}
                </p>
              </div>
              <div class="pure-music">
                <p>{{ pureMusicLyric }}</p>
              </div>
            </div>
          </Scroll>
        </div>

        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="currentShow === 'cd' ? 'active' : ''" />
            <span class="dot" :class="currentShow === 'lyric' ? 'active' : ''" />
          </div>
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(song.currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar
                ref="barRef"
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
              />
            </div>
            <span class="time time-r">{{ formatTime(currentSong.duration) }}</span>
          </div>

          <!-- 操作 -->
          <div class="operators">
            <div class="icon i-left">
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlay"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 迷你播放器 -->
    <MiniPlayer :progress="progress" :toggle-play="togglePlay" :playingLyric="playingLyric" />
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    />
  
  </div>
</template>

<script>
export default {
  name: "Player",
};
</script>

<script setup>
import { ref, reactive, computed, watch, nextTick } from "vue";
import { useStore } from "vuex";
import {
  playerStoreType,
  SET_PLAYING,
  SET_CURRENT_INDEX,
  SET_FULL_SCREEN,
} from "@/store/player-store";

import { useMapState, formatTime } from "@/utils";
import { PLAYER_MODE } from "@/assets/js/constants";

import Scroll from "@/components/base/Scroll";
import ProgressBar from "./progress-bar";
import MiniPlayer from "./mini-player.vue";

import useMode from "./use-mode";
import useFavorite from "./use-favorite";
import useCD from "./use-cd";
import useLyric from "./use-lyric";
import useMiddle from "./use-middle";
import useAnimation from "./use-animation";

// 初始状态
const audioRef = ref(null);
const barRef = ref(null);
const song = reactive({
  ready: false,
  currentTime: 0,
});

// hooks
const { modeIcon, changeMode } = useMode();
const { toggleFavorite, getFavoriteIcon } = useFavorite();
const { cdRef, cdImageRef, cdCls } = useCD();
const {
  lyricScrollRef,
  lyricListRef,
  currentLyric,
  currentLineNum,
  pureMusicLyric,
  playingLyric,
  playLyric,
  stopLyric,
} = useLyric(song);

const {
  currentShow,
  middleLStyle,
  middleRStyle,
  onMiddleTouchStart,
  onMiddleTouchMove,
  onMiddleTouchEnd,
} = useMiddle();

const { cdWrapperRef, enter, afterEnter, leave, afterLeave } = useAnimation();

// vuex
const $store = useStore();
const { fullScreen, playing, currentIndex, playerMode, playlist } = useMapState(
  ["fullScreen", "playing", "currentIndex", "playerMode", "playlist"],
  "playerStore"
);
const currentSong = computed(() => $store.getters["playerStore/currentSong"]);

// computed
const playIcon = computed(() => (playing.value ? "icon-pause" : "icon-play"));
const disableCls = computed(() => (song.ready ? "" : "disable"));
const progress = computed(() => song.currentTime / currentSong.value.duration); // 进度，0-1
let progressChanging = false;

// 播放入口，当currentSong发生变化时，自动播放
watch(currentSong, (newSong) => {
  if (!newSong.id || !newSong.url) {
    // 如果不存在songid和songurl，不合法
    return;
  }
  song.currentTime = 0; // 重置为0
  song.ready = false; // 播放时重置为false
  const audio = audioRef.value;
  audio.src = newSong.url;
  audio.play();
  $store.commit(playerStoreType(SET_PLAYING), true);
});

watch(playing, (state) => {
  if (!song.ready) {
    // 缓冲时间
    return;
  }
  const audio = audioRef.value;
  if (state) {
    audio.play();
    playLyric();
    return;
  }
  audio.pause();
  stopLyric();
});

/** 播放/暂停 */
function togglePlay() {
  if (!song.ready) return;
  $store.commit(playerStoreType(SET_PLAYING), !playing.value);
}

/** 上一首 */
function prev() {
  const list = playlist.value;
  if (!song.ready || !list.length) return;
  // 如果只有一首，改变currentIndex是不会发生数据变动的，都是0
  if (list.length === 1) {
    loop();
    return;
  }

  let index = currentIndex.value - 1;
  if (index === -1) {
    // 最后一首歌
    index = list.length - 1;
  }
  // currentSong具有watch，切换currentIndex自动开始播放
  $store.commit(`playerStore/${SET_CURRENT_INDEX}`, index);
}

/** 下一首 */
function next() {
  const list = playlist.value;
  if (!song.ready || !list.length) return;
  // 如果只有一首，改变currentIndex是不会发生数据变动的，都是0
  if (list.length === 1) {
    loop();
    return;
  }

  let index = currentIndex.value + 1;
  if (index === list.length) {
    index = 0;
  }
  // currentSong具有watch，切换currentIndex自动开始播放
  $store.commit(playerStoreType(SET_CURRENT_INDEX), index);
}

/** 循环播放 */
function loop() {
  const audio = audioRef.value;
  audio.currentTime = 0; // 必须要重置为0，否则audio对象不会播放
  audio.play();
  $store.commit(playerStoreType(SET_PLAYING), true);
}

/** 如果被动的暂停：如计算机休眠等，引起播放器暂停此时应该设置状态为false */
function pause() {
  $store.commit(`playerStore/${SET_PLAYING}`, false);
}

/** 音频可以播放 */
function ready() {
  if (song.ready) return;
  song.ready = true;
  playLyric(); // use-lyric 中，当歌曲准备好以后开始播放，ready，通过currentTime确定
}

/** 加载错误 */
function error() {
  song.ready = false;
}

/** 播放结束 */
function end() {
  song.currentTime = 0;
  if (playerMode.value === PLAYER_MODE.loop) {
    loop();
  } else {
    next();
  }
}

/** 更新时间 */
function updateTime(e) {
  if (progressChanging) return; // 拖动进度条的优先级更高
  // song.currentTime = audioRef.value.currentTime;
  song.currentTime = e.target.currentTime; // 两种方式都可以获取currentTime
}

/** 进度条拖动 */
function onProgressChanging(progress) {
  progressChanging = true;
  song.currentTime = currentSong.value.duration * progress;
  playLyric(); // 一直在同步位置
  stopLyric(); // 同步位置后停止
}

/** 进度条拖动结束 */
function onProgressChanged(progress) {
  progressChanging = false;
  audioRef.value.currentTime = song.currentTime = currentSong.value.duration * progress;
  if (!playing.value) {
    // 如果暂停状态，设置为true
    $store.commit(playerStoreType(SET_PLAYING), true);
  }
  playLyric(); // 恢复播放，开始播放歌词
}

/** 退出全屏 */
function goBack() {
  $store.commit(`playerStore/${SET_FULL_SCREEN}`, false);
}

/** 监听全屏状态设置进度条 */
watch(fullScreen, async (newFullScreen) => {
  if (!newFullScreen) return;
  await nextTick(); // setOffset内部访问了DOM，所以需要等待一个时刻才能够保证拿到正确的数据
  barRef.value.setOffset(progress.value);
});
</script>

<style scoped lang="scss">
.player {
  .normal-player {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    background: $color-background;

    .background {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }

      .icon-back {
        display: block;
        padding: 9px;
        color: $color-theme;
        font-size: $font-size-large-x;
        transform: rotate(-90deg);
      }

      .title {
        width: 70%;
        margin: 0 auto;
        color: $color-text;
        font-size: $font-size-large;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
      }

      .subtitle {
        color: $color-text;
        font-size: $font-size-medium;
        line-height: 20px;
        text-align: center;
      }
    }

    .middle {
      position: fixed;
      top: 80px;
      bottom: 170px;
      width: 100%;
      font-size: 0;
      white-space: nowrap;

      .middle-l {
        position: relative;
        display: inline-block;
        width: 100%;
        height: 0;
        padding-top: 80%;
        vertical-align: top;

        .cd-wrapper {
          position: absolute;
          top: 0;
          left: 10%;
          box-sizing: border-box;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;

            img {
              position: absolute;
              top: 0;
              left: 0;
              box-sizing: border-box;
              width: 100%;
              height: 100%;
              border: 10px solid rgb(255 255 255 / 10%);
              border-radius: 50%;
            }

            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            color: $color-text-l;
            font-size: $font-size-medium;
            line-height: 20px;
          }
        }
      }

      .middle-r {
        display: inline-block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        vertical-align: top;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            color: $color-text-l;
            font-size: $font-size-medium;
            line-height: 32px;

            &.current {
              color: $color-text;
            }
          }

          .pure-music {
            padding-top: 50%;
            color: $color-text-l;
            font-size: $font-size-medium;
            line-height: 32px;
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        font-size: 0;
        text-align: center;

        .dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin: 0 4px;
          vertical-align: middle;
          background: $color-text-l;
          border-radius: 50%;

          &.active {
            width: 20px;
            background: $color-text-ll;
            border-radius: 5px;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;

        .time {
          flex: 0 0 40px;
          width: 40px;
          color: $color-text;
          font-size: $font-size-small;
          line-height: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;

      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }

    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
