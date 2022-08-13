<template>
  <Header></Header>
  <Tab></Tab>
  <router-view />
  <Player></Player>
</template>

<script setup>
import Header from "./components/Header";
import Tab from "./components/Tab";
import Player from "./components/Player";
</script>

<style lang="scss"></style>
