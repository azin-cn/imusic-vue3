<template>
  <teleport to="body">
    <transition name="list-fade">
      <div class="play-list" v-show="visible && playlist.length" @click="hide">
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="modeIcon" @click="changeMode"></i>
              <span class="text">{{ modeText }}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <Scroll ref="scrollRef" class="list-content">
            <transition-group ref="listRef" name="list" tag="ul">
              <li
                class="item"
                v-for="item in sequenceList"
                :key="item.id"
                @click="selectItem(item)"
              >
                <i class="current" :class="getCurrentIcon(item)"></i>
                <span class="text">{{ item.name }}</span>
                <span class="favorite" @click.stop="toggleFavorite(item)">
                  <i :class="getFavoriteIcon(item)"></i>
                </span>
                <span class="delete" @click.stop="removeSong(item)" :class="{ disable: removing }">
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </Scroll>
          <div class="list-add">
            <div class="add" @click="showAddSong">
              <i class="icon-add"></i>
              <span class="text">添加歌曲到队列</span>
            </div>
          </div>
          <div class="list-footer" @click="hide">
            <span>关闭</span>
          </div>
        </div>
        <!-- <confirm
          ref="confirmRef"
          text="是否清空播放列表？"
          confirm-btn-text="清空"
          @confirm="confirmClear"
        />
        <add-song ref="addSongRef" /> -->
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: "PlayList",
};
</script>

<script setup>
import { defineExpose, computed, nextTick, ref, reactive, watch } from "vue";
import { useStore } from "vuex";
// import { promiseTimeout } from "@vueuse/core";
// import Confirm from "@/components/base/confirm/index.vue";
// import AddSong from "@/components/add-song/index.vue";
import { useMapState } from "@/utils";

import { playerStoreType, SET_CURRENT_INDEX, SET_PLAYING } from "@/store/player-store";
import Scroll from "@/components/base/Scroll";
import useMode from "./use-mode";
import useFavorite from "./use-favorite";

const $store = useStore();
const visible = ref(false);
const removing = ref(false);
const scrollRef = ref(null);
const listRef = ref(null);
const confirmRef = ref(null);
const addSongRef = ref(null);

const { playlist, sequenceList } = useMapState(["playlist", "sequenceList"], "playerStore");
const currentSong = computed(() => $store.getters["playerStore/currentSong"]);

const { modeIcon, modeText, changeMode } = useMode();
const { getFavoriteIcon, toggleFavorite } = useFavorite();

/** 显示 */
async function show() {
  visible.value = true;
  await nextTick();
  refreshScroll();
  scrollToCurrent();
}

/** 隐藏 */
function hide() {
  visible.value = false;
}

/** 当前播放 icon */
function getCurrentIcon(song) {
  if (song.id === currentSong.value.id) {
    return "icon-play";
  }
}

/** 刷新 */
function refreshScroll() {
  scrollRef.value?.scroll.refresh();
}

/** 滚动到当前播放位置 */
function scrollToCurrent() {
  const index = sequenceList.value.findIndex((item) => currentSong.value.id === item.id);
  if (index === -1) return;
  const target = listRef.value.$el.children[index];
  scrollRef.value?.scroll.scrollToElement(target, 300);
}

/** 选中某项歌曲 */
function selectItem(song) {
  const index = playlist.value.findIndex((item) => song.id === item.id);
  $store.commit(playerStoreType(SET_CURRENT_INDEX), index);
  $store.commit(playerStoreType(SET_PLAYING), true);
}

/** 移除歌曲 */
async function removeSong(song) {
  if (removing.value) return;
  removing.value = true;
  await $store.dispatch("playerStore/removeSong", { song });
  if (!playlist.value.length) hide();
  // await promiseTimeout(300);
  removing.value = false;
}

/** 显示确认弹框 */
function showConfirm() {
  confirmRef.value.show();
}

/** 清空播放列表  */
function confirmClear() {
  $store.dispatch("playerStore/clearSongList");
  hide();
}

/** 添加歌曲 */
function showAddSong() {
  addSongRef.value.show();
}

/** 监听当前歌曲，切换当前的scrollTo */
watch(currentSong, async (newSong) => {
  if (!visible.value || !newSong.id) return;
  await nextTick();
  scrollToCurrent();
});

defineExpose({
  show,
});
</script>

<style scoped lang="scss">
.play-list {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 200;
  background-color: $color-background-d;

  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  .list-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;

    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          color: $color-theme-d;
          font-size: 24px;
        }

        .text {
          flex: 1;
          color: $color-text-l;
          font-size: $font-size-medium;
        }

        .clear {
          @include extend-click();

          .icon-clear {
            color: $color-text-d;
            font-size: $font-size-medium;
          }
        }
      }
    }

    .list-content {
      max-height: 240px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;

        .current {
          flex: 0 0 20px;
          width: 20px;
          color: $color-theme-d;
          font-size: $font-size-small;
        }

        .text {
          flex: 1;
          color: $color-text-d;
          font-size: $font-size-medium;
          @include no-wrap();
        }

        .favorite {
          margin-right: 15px;
          color: $color-theme;
          font-size: $font-size-small;
          @include extend-click();

          .icon-favorite {
            color: $color-sub-theme;
          }
        }

        .delete {
          color: $color-theme;
          font-size: $font-size-small;
          @include extend-click();

          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }

    .list-add {
      width: 140px;
      margin: 20px auto 30px;

      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        color: $color-text-l;
        border: 1px solid $color-text-l;
        border-radius: 100px;

        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }

        .text {
          font-size: $font-size-small;
        }
      }
    }

    .list-footer {
      color: $color-text-l;
      font-size: $font-size-medium-x;
      line-height: 50px;
      text-align: center;
      background: $color-background;
    }
  }
}
</style>
