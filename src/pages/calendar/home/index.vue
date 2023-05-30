<template>
  <nav>
    <n-button size="small" round @click="handleCreateEvent">
      <template #icon>
        <n-icon><AddIcon /></n-icon>
      </template>
      创建
    </n-button>
    <n-date-picker v-model:value="currentTime" size="small" type="month" />
    <n-button size="small" circle @click="handleTime('LAST')">
      <template #icon>
        <n-icon class="text-base">
          <LeftIcon />
        </n-icon>
      </template>
    </n-button>
    <n-button size="small" circle @click="handleTime('NEXT')">
      <template #icon>
        <n-icon class="text-base">
          <RightIcon />
        </n-icon>
      </template>
    </n-button>
    <n-button size="small" round @click="handleTime('CURRENT')">今天</n-button>
    <ChangeTheme />
  </nav>
  <WeekList />
  <DateContent ref="dateContentRef" :current-time="currentTime" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import dayjs from "dayjs";
import {
  ChevronLeft20Filled as LeftIcon,
  ChevronRight20Filled as RightIcon,
  Add20Regular as AddIcon,
} from "@vicons/fluent";

import ChangeTheme from "@/components/ChangeTheme.vue";
import WeekList from "./components/Calendar/WeekList.vue";
import DateContent from "./components/Calendar/DateContent.vue";

import type { SelectOptions } from "@/types/components/calendar";

const currentTime = ref<number>(dayjs().valueOf());

const dateContentRef = ref<InstanceType<typeof DateContent>>();

const handleCreateEvent = (event: MouseEvent) => {
  event.stopPropagation();

  // if (dateContentRef.value?.popoverInfo.isPopoverShow) {
  dateContentRef.value?.setInitialPopoverStatus();
  // } else {
  console.log(dayjs(currentTime.value).format("YYYY-MM-DD"));
  dateContentRef.value?.createEventByTime(
    dayjs(currentTime.value).format("YYYY-MM-DD"),
  );
  // }
};

const handleTime = (type: SelectOptions) => {
  switch (type) {
    case "LAST":
      currentTime.value = dayjs(currentTime.value).subtract(1, "M").valueOf();
      break;
    case "NEXT":
      currentTime.value = dayjs(currentTime.value).add(1, "M").valueOf();
      break;
    case "CURRENT":
      currentTime.value = dayjs().valueOf();
      break;
  }
};
</script>

<style lang="scss" scoped>
nav {
  display: flex;
  justify-content: end;
  align-items: center;
  padding-right: 10px;
  gap: 10px;
  height: 40px;
}
</style>
