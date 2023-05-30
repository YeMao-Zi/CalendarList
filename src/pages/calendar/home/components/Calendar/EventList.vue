<template>
  <div v-if="eventList?.length" ref="eventContainerRef" class="event-container">
    <template
      v-for="(eventInfo, eventIndex) in eventList"
      :key="eventInfo.id ?? eventIndex"
    >
      <template v-if="eventIndex < showMaxCount - 2">
        <div class="eventInfo" @click="handleClick($event, eventInfo!)">
          <Forward
            v-if="!eventInfo?.hasLast"
            :event-info="eventInfo"
            :date-info="dateInfo"
          ></Forward>
          <Event :event-info="eventInfo" :date-info="dateInfo"></Event>
          <Backward
            v-if="!eventInfo?.hasNext"
            :event-info="eventInfo"
            :date-info="dateInfo"
          ></Backward>
        </div>
      </template>
    </template>
    <div
      v-if="eventList?.length > showMaxCount - 2"
      class="moreInfo"
      @click="getMoreEvent"
    >
      <n-button secondary size="tiny" type="primary">
        更多 {{ eventList?.length - showMaxCount + 2 }} 项
      </n-button>
    </div>
  </div>
  <!-- <New v-else></New> -->
</template>

<script lang="ts" setup>
import { ref, inject, computed, onMounted } from "vue";
import dayjs from "dayjs";
import Forward from "./Forward.vue";
import Event from "./Event.vue";
import Backward from "./Backward.vue";
import New from "./New.vue";

import {
  CalendarInfoType,
  CalendarEventInfo,
  EventType,
} from "@/types/components/calendar";
import { PopoverKey } from "@/types/components/popover";

const injectInfo = inject(PopoverKey);

const props = defineProps<{
  dateInfo: CalendarInfoType;
  eventList: CalendarEventInfo[];
  dropStyle: {
    width: number;
    height: number;
  };
  showMaxCount: number;
}>();

const getMoreEvent = (event: MouseEvent) => {
  event.stopPropagation();
  const currentTarget = event.currentTarget as HTMLElement;
  injectInfo?.handlePopoverAllVisiable(true, currentTarget, props.dateInfo);
};

const handleClick = (event: MouseEvent, eventInfo: EventType) => {
  event.stopPropagation();
  const { dateInfo } = props;
  const currentTarget = event.currentTarget as HTMLElement;
  const { startTime, endTime, id } = eventInfo;
  const { dateIndex, fullTime: time } = dateInfo;
  // 点击的是单天事件
  const isSingleEvent = dayjs(endTime).diff(startTime, "d") === 0;

  if (isSingleEvent) {
    injectInfo?.handlePopoverVisiable(
      eventInfo,
      false,
      {
        dateIndex,
        time,
        target: currentTarget,
      },
      undefined,
      id,
    );
  } else {
    const { fullTime, dateIndex } = dateInfo;
    const isClickStart = fullTime === startTime;
    const isClickEnd = fullTime === endTime;
    // 如果点击的事件是开始日或者结束日，那么直接传 target，能减少一次直取 DOM 的次数吧
    injectInfo?.handleRangePopoverVisiable(
      eventInfo,
      dateIndex,
      isClickStart || isClickEnd
        ? {
            target: event.currentTarget as HTMLElement,
            type: isClickStart ? "start" : "end",
          }
        : null,
    );
  }
};

onMounted(() => {
  // console.log(props.eventList);
});
</script>

<style lang="scss" scoped>
.event-container {
  display: flex;
  flex-direction: column;
}

.eventInfo {
  height: 23px;
  box-sizing: border-box;
  display: flex;
  margin-top: 2px;
}

.moreInfo {
  height: 23px;
  margin-top: 2px;
  margin-left: 0.5rem;
  width: 100%;
}
</style>
