<template>
  <div class="header">
    <span class="icon" />
    <h1 class="text">
      IMusic
    </h1>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Header'
})
</script>

<style lang='scss' scoped>
.header {
  height: 44px;
  text-align: center;
  color: $color-theme;
  font-size: 0;

  .icon {
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    margin-right: 9px;
    width: 30px;
    height: 32px;
    background-size: 30px 32px;
    @include bg-image('logo');
  }

  .text {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: $font-size-large;
  }
}
</style>
