<script setup lang="ts">
import Menu from "@/components/Menu.vue";
</script>
<template>
  <n-layout has-sider>
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      collapsed
      :show-trigger="false"
    >
      <Menu></Menu>
    </n-layout-sider>
    <n-layout-content class="layout">
      <router-view />
    </n-layout-content>
  </n-layout>
</template>

<style scoped lang="scss">
.layout {
  overflow: hidden;
  height: 100vh;
}
</style>
