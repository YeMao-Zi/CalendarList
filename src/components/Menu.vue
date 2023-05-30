<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
import { computed, h } from "vue";
import {
  CalendarAssistant20Regular as CalendarIcon,
  CheckboxPerson20Regular as TodoBoxIcon,
  Apps20Regular as QuadrantIcon,
  // Settings20Regular as SettingsIcon,
  // Timer20Regular as TimerIcon,
} from "@vicons/fluent";

import { renderIcon } from "@/utils";
import logo from "@/assets/logo/Tu.png";

import type { MenuOption } from "naive-ui";

const routeInfo = useRoute();
const routeKey = computed(() => routeInfo.name);

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "home",
          },
        },
        { default: () => "日历视角" },
      ),
    icon: renderIcon(CalendarIcon),
    key: "home",
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "quadrant",
          },
        },
        { default: () => "时间四象限" },
      ),
    icon: renderIcon(QuadrantIcon),
    key: "quadrant",
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "todoBox",
          },
        },
        { default: () => "任务箱" },
      ),
    icon: renderIcon(TodoBoxIcon),
    key: "todoBox",
  },
];
</script>

<template>
  <section class="content">
    <div class="img">
      <img :src="logo" />
    </div>
    <n-menu
      collapsed
      :collapsed-width="64"
      :options="menuOptions"
      :value="routeKey"
    />
  </section>
</template>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  .img {
    display: flex;
    justify-content: center;
    img {
      width: 40px;
      height: 40px;
    }
  }
}
</style>
