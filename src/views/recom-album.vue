<template>
  <div class="recom-album">
    <MusicList :songs="songs" :loading="loading" :pic="pic" :title="title" />
  </div>
</template>

<script>
import createDetailComponent from "@/assets/js/createDetailComponent";
import { CACHE_ALBUM } from "@/assets/js/constants";
import { getAlbumDetail } from "@/service/recom";
export default createDetailComponent("RecomAlbum", CACHE_ALBUM, getAlbumDetail);
</script>

<style scoped lang="scss">
.recom-album {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  background: $color-background;
}
</style>
