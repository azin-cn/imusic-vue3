<template>
  <ul class="song-list">
    <li
      class="item"
      v-for="(item, index) in props.songs"
      :key="item.id"
      @click="selectItem(item, index)"
    >
      <div class="rank" v-if="props.rank">
        <span :class="getRankCls(index)">{{ getRankText(index) }}</span>
      </div>
      <div class="content">
        <h2 class="name">{{ item.name }}</h2>
        <p class="desc">{{ getDesc(item) }}</p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: "SongList",
};
</script>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  /** 歌曲列表 */
  songs: {
    type: Array,
    default: () => [],
  },
  /** 是否排行榜 */
  rank: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["select"]);

/** 详情描述 */
function getDesc(item) {
  return `${item.singer}-${item.album}`;
}

/** 排行图标 */
function getRankCls(index) {
  if (index <= 2) {
    return `icon icon${index}`;
  }
  return "text";
}

/** 排行文案 */
function getRankText(index) {
  if (index > 2) return index + 1;
}

/** 选择歌曲 */
function selectItem(song, index) {
  emit("select", { song, index });
}
</script>

<style scoped lang="scss">
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;

    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 20px;
      text-align: center;

      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;

        &.icon0 {
          @include bg-image("first");
        }

        &.icon1 {
          @include bg-image("second");
        }

        &.icon2 {
          @include bg-image("third");
        }
      }

      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }

    .content {
      flex: 1;
      overflow: hidden;
      line-height: 20px;

      .name {
        color: $color-text;
        @include no-wrap();
      }

      .desc {
        margin-top: 4px;
        color: $color-text-d;
        @include no-wrap();
      }
    }
  }
}
</style>
