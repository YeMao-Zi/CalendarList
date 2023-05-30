<template>
  <n-popconfirm
    :show-icon="false"
    placement="bottom-start"
    :show-arrow="false"
    @positive-click="handleSave"
  >
    <template #trigger>
      <n-button size="small" quaternary type="info">
        <n-icon :size="24">
          <CalendarIcon />
        </n-icon>
        <span style="margin-left: 10px">
          {{ date.startTimeText }}
        </span>
        <span v-if="date.startTimeText !== date.endTimeText">
          <span style="margin: 0 10px">至</span>
          <span>{{ date.endTimeText }}</span>
        </span>
      </n-button>
    </template>

    <n-date-picker
      v-model:value="timeInfo"
      :to="false"
      type="daterange"
      panel
      :actions="null"
      clearable
    />
  </n-popconfirm>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import { ref, reactive, computed } from "vue";
import { CalendarLtr20Regular as CalendarIcon } from "@vicons/fluent";

const props = defineProps<{
  startTime: string;
  endTime: string;
  eventId?: number;
  disabled?: boolean;
}>();

const emits = defineEmits<{
  (e: "change", time: { startTime: string; endTime: string }): void;
}>();

const date = computed(() => {
  return {
    startTimeText: handleTimeFormat(props.startTime),
    endTimeText: handleTimeFormat(props.endTime),
  };
});

const timeInfo = ref([dayjs().valueOf(), dayjs().valueOf()]);

const handleTimeFormat = (time: number | string): string => {
  return dayjs(time).format("YYYY-MM-DD");
};

const handleSave = () => {
  emits("change", {
    startTime: handleTimeFormat(timeInfo.value[0]),
    endTime: handleTimeFormat(timeInfo.value[1]),
  });
};
</script>

<style lang="scss" scoped></style>
