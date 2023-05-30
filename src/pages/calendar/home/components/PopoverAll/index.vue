<script lang="ts" setup>
import { computed, inject, toRefs, watch } from "vue";
import { storeToRefs } from "pinia";
import { useDrop } from "vue3-dnd";
import dayjs from "dayjs";
import { Dismiss20Regular as CloseIcon } from "@vicons/fluent";
import useStore from "@/stores";
import { CalendarKey, DragEventTypeEnum } from "@/types/components/calendar";
import type { CalendarEventInfo } from "@/types/components/calendar";

import Event from "./Event.vue";

const { useCalendarStore } = useStore();

const { weekList } = storeToRefs(useCalendarStore);

const calendarInject = inject(CalendarKey);

const props = defineProps<{
  dateInfo: { dateIndex: number; fullTime: string } | null;
  eventList: CalendarEventInfo[] | null;
}>();

const emits = defineEmits<{
  (e: "close"): void;
}>();

const [collect, drop] = useDrop({
  accept: [DragEventTypeEnum.EVENT],
  drop: () => {
    if (props.dateInfo) {
      return {
        // drag 侧可以通过 monitor.getDropResult() 拿到该值
        dropTime: props.dateInfo.fullTime,
        dateIndex: props.dateInfo.dateIndex,
      };
    }
  },
  collect: (monitor) => ({
    isOver: monitor.isOver(),
  }),
});

const timeTitle = computed(() => {
  if (props.dateInfo) {
    const { fullTime } = props.dateInfo;
    let currentDay = dayjs(fullTime).day();
    return `${dayjs(fullTime).format("MM月DD日")} ${
      weekList.value[currentDay]
    }`;
  }
  return "";
});

const handleClose = () => {
  emits("close");
};
</script>

<template>
  <div :ref="drop">
    <header>
      <div class="title">{{ timeTitle }}</div>
      <n-button size="tiny" quaternary>
        <n-icon class="cursor-pointer" @click="handleClose">
          <CloseIcon />
        </n-icon>
      </n-button>
    </header>
    <n-scrollbar
      class="scrollbar"
      style="
        max-height: 185px;
        padding: 0px 5px 5px 5px;
        box-sizing: border-box;
      "
    >
      <!-- 套一层 template，因为事件中有 null 值作为占位元素 -->
      <template v-for="eventItem in eventList">
        <Event
          v-if="eventItem"
          :key="eventItem.id"
          :event-info="eventItem"
          :date-info="dateInfo!"
        />
      </template>
    </n-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  .title {
    color: #18a058;
    font-weight: 700;
  }
}
.cursor-pointer {
  color: red;
  cursor: pointer;
}
</style>
