import { computed } from "vue";
import { useStore } from "vuex";
import { playerStoreType, SET_FAVORITE_LIST } from "@/store/player-store";

import { FAVORITE_LIST } from "@/assets/js/constants";
import { save, remove } from "@/assets/js/store-array";

/**
 * 需要实现的功能：取消/收藏歌曲-favoriteList，动作交互
 */
export default function useFavorite() {
  const $store = useStore();
  const favoriteList = computed(() => $store.state["playerStore"].favoriteList);

  function toggleFavorite(song) {
    let list = [];
    if (isFavorite(song)) {
      // 原喜欢、现切换 remove
      list = remove(FAVORITE_LIST, (item) => item.id === song.id);
    } else {
      // append save
      list = save(FAVORITE_LIST, song, (item) => song.id === item.id); // 保存成功的条件是源列表不包含，判断是否含有
    }
    $store.commit(playerStoreType(SET_FAVORITE_LIST), list);
  }

  function getFavoriteIcon(song) {
    return isFavorite(song) ? "icon-favorite" : "icon-not-favorite";
  }

  function isFavorite(song) {
    return favoriteList.value.some((fav) => fav.id === song.id);
  }

  return {
    toggleFavorite,
    getFavoriteIcon,
  };
}
