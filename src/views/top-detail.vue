<template>
  <div class="top-detail">
    <MusicList :songs="songs" :loading="loading" :pic="pic" :title="title" rank />
  </div>
</template>

<script>
import { CACHE_TOP_LIST } from "@/assets/js/constants";
import { getTopDetail } from "@/service/top";
import createDetailComponent from "@/assets/js/createDetailComponent";
export default createDetailComponent("TopDetail", CACHE_TOP_LIST, getTopDetail);
</script>

<style scoped lang="scss">
.top-detail {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  background: $color-background;
}
</style>
