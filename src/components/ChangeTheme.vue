<template>
  <n-button text @click="handleTheme">
    <template #icon>
      <n-icon size="28">
        <SunnyIcon v-if="theme !== 'dark'" />
        <MoonIcon v-else />
      </n-icon>
    </template>
  </n-button>
</template>

<script lang="ts" setup>
import {
  WeatherSunny20Regular as SunnyIcon,
  WeatherMoon20Regular as MoonIcon,
} from "@vicons/fluent";

import { storeToRefs } from "pinia";
import useStore from "@/stores";

const { useGlobalStore } = useStore();
const { theme } = storeToRefs(useGlobalStore);
const handleTheme = () => {
  const settheme = theme.value === "dark" ? null : "dark";
  useGlobalStore.handleTheme(settheme);
};
</script>

<style lang="scss" scoped></style>
