<script setup lang="ts">
import { zhCN, dateZhCN, darkTheme } from "naive-ui";
import { computed } from "vue";
import useStore from "@/stores/index";

const globalStore = useStore().useGlobalStore;

const theme = computed(() => (globalStore.theme === "dark" ? darkTheme : null));
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="theme">
    <n-message-provider>
      <n-dialog-provider>
        <router-view />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
