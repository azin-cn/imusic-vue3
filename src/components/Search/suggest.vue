<template>
  <div
    ref="rootRef"
    class="suggest"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer" @click="selectSinger(singer)">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li class="suggest-item" v-for="item in songs" :key="item.id" @click="selectSong(item)">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ item.singer }}-{{ item.name }}</p>
        </div>
      </li>
      <!-- <li class="suggest-item" v-loading:[loadingText]="pullUpLoading"></li> -->
    </ul>
  </div>
</template>

<script>
export default {
  name: "Suggest",
};
</script>

<script setup>
import { defineProps, defineEmits, computed, nextTick, ref, watch } from "vue";
import { search } from "@/service/search";
import { processSongs } from "@/service/song";
// import { usePullUpLoad } from "./use-pull-up-load";

const props = defineProps({
  /** 搜素参数 */
  query: {
    type: String,
    default: "",
  },
  /** 显示歌手 */
  showSinger: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["select-song", "select-singer"]);

const singer = ref(null);
const songs = ref([]);
const hasMore = ref(true);
const page = ref(1);
const loadingText = "";
const noResultText = "抱歉，暂无搜索结果";
const manualLoading = ref(false);

const loading = computed(() => !singer.value && !songs.value.length);
const noResult = computed(() => !singer.value && !songs.value.length && !hasMore.value);
const pullUpLoading = computed(() => isPullUpLoad.value && hasMore.value);
const preventPullUpLoad = computed(() => loading.value || manualLoading.value);

// hooks
// const { isPullUpLoad, rootRef, scroll } = usePullUpLoad({
//   fetchData: searchMore,
//   preventPullUpLoad,
// });

/** 首次请求 */
async function searchFirst() {
  if (!props.query) return;

  // debugger;
  // 每一次新的搜索都需要重置
  page.value = 1;
  songs.value = [];
  singer.value = null;
  hasMore.value = true;
  const { showSinger, query } = props;

  try {
    const result = await search({
      query,
      showSinger,
      page: page.value,
    });
    singer.value = result.singer;
    hasMore.value = result.hasMore;
    songs.value = await processSongs(
      typeof result.songs === "object" && result.songs instanceof Array ? result.songs : []
    );
  } catch (error) {
    console.log(error);
  }

  await nextTick();
  await makeItScrollable();
}

/** 请求更多 */
async function searchMore() {
  // if (!hasMore.value || !props.query) return;
  // page.value++;
  // const { query, showSinger } = props;
  // const result = await search({
  //   query,
  //   showSinger,
  //   page: page.value,
  // });
  // hasMore.value = result.hasMore;
  // songs.value = songs.value.concat(await processSongs(result.songs));
  // await nextTick();
  // await makeItScrollable();
}

/** 手动控制加载 */
async function makeItScrollable() {
  if (scroll.value && scroll.value.maxScrollY >= -1) {
    manualLoading.value = true;
    await searchMore();
    manualLoading.value = false;
  }
}

/** 选择歌手 */
function selectSinger(singer) {
  emit("select-singer", singer);
}

/** 选择歌曲 */
function selectSong(song) {
  emit("select-song", song);
}

watch(
  () => props.query,
  async (newQuery) => {
    if (!newQuery) return;
    searchFirst().then((res) => {}, console.error);
  }
);
</script>

<style scoped lang="scss">
.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;

      .icon {
        flex: 0 0 30px;
        width: 30px;

        [class^="icon-"] {
          color: $color-text-d;
          font-size: 14px;
        }
      }

      .name {
        flex: 1;
        overflow: hidden;
        color: $color-text-d;
        font-size: $font-size-medium;

        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
