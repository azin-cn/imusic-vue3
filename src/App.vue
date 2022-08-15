<template>
  <Header></Header>
  <Tab></Tab>
  <router-view :style="viewStyle" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <Player></Player>
</template>

<script setup>
import { computed } from "vue";
import { useMapState } from "@/utils";

import Header from "./components/Header";
import Tab from "./components/Tab";
import Player from "./components/Player";

const { playlist } = useMapState(["playlist"], "playerStore");

const viewStyle = computed(() => {
  const bottom = playlist.value.length ? "60px" : "0";
  return {
    bottom,
  };
});
</script>

<style lang="scss"></style>
