<template>
  <div class="search">
    <div class="search-input-wrapper">
      <!-- 使用v-model，vue3自动传入一个属性modelValue -->
      <SearchInput v-model="query" />
    </div>
    <Scroll ref="scrollRef" class="search-content" v-no-result:[noResultText]="true">
      <div>
        <!-- <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="item in hotKeys" :key="item.id" @click="addQuery(item.key)">
              <span>{{ item.key }}</span>
            </li>
          </ul>
          <p v-if="!hotKeys.length" class="item">暂无热搜 | 获取失败</p>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearch" />
          <confirm
            ref="confirmRef"
            text="是否清空所有搜索历史"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          />
        </div> -->
      </div>
    </Scroll>
    <!-- <div class="search-result" v-show="query">
      <Suggest :query="query" @select-singer="selectSinger" @select-song="selectSong" />
    </div>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view> -->
  </div>
</template>

<script>
export default {
  name: "Search",
};
</script>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import { CACHE_SINGER } from "@/assets/js/constants";
import { saveSessionStorage } from "@/assets/js/cache";
import { getHotKeys } from "@/service/search";

import SearchInput from "@/components/Search/search-input.vue";
import Scroll from "@/components/base/Scroll";
import Suggest from "@/components/Search/suggest";
// import SearchList from "@/components/base";
import Confirm from "@/components/base/Confirm";

const $router = useRouter();
const $store = useStore();

const query = ref("");
const hotKeys = ref("");
const selectedSinger = ref(null);
const scrollRef = ref(null);
const confirmRef = ref(null);

const noResultText = "抱歉，无法搜索";

const searchHistory = computed(() => "");

// hooks
// const { saveSearch, deleteSearch, clearSearch } = useSearchHistory();

/** 获取热门搜索 */
async function fetchHotKeys() {
  try {
    const result = await getHotKeys();
    hotKeys.value = result.hotKeys;
  } catch (e) {
    console.log("hotKeys 获取失败");
  }
}

/** 添加搜索参数 */
function addQuery(target) {
  query.value = target.trim();
}

/** 选中歌手 */
function selectSinger(singer) {
  selectedSinger.value = singer;
  // saveSearch(query.value);
  // saveSessionStorage(CACHE_SINGER, singer);

  // router.push({
  //   path: `/search/${singer.mid}`,
  // });
}

/** 选中歌曲 */
function selectSong(song) {
  // saveSearch(query.value);
  // store.dispatch("addSong", song);
}

/** 显示删除弹框 */
function showConfirm() {
  confirmRef.value.show();
}

/** 强制刷新 */
function refreshScroll() {
  scrollRef.value.scroll.refresh();
}

watch(
  () => query,
  async (newQuery) => {
    if (newQuery) return;
    await nextTick();
    refreshScroll();
  }
);

onMounted(() => {
  fetchHotKeys();
});
</script>

<style scoped lang="scss">
.search {
  position: fixed;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  width: 100%;

  .search-input-wrapper {
    margin: 20px;
  }

  .search-content {
    flex: 1;
    overflow: hidden;

    .hot-keys {
      margin: 0 20px 20px;

      .title {
        margin-bottom: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }

      .item {
        display: inline-block;
        margin: 0 20px 10px 0;
        padding: 5px 10px;
        color: $color-text-d;
        font-size: $font-size-medium;
        background: $color-highlight-background;
        border-radius: 6px;
      }
    }

    .search-history {
      position: relative;
      margin: 0 20px;

      .title {
        display: flex;
        align-items: center;
        height: 40px;
        color: $color-text-l;
        font-size: $font-size-medium;

        .text {
          flex: 1;
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
  }

  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
