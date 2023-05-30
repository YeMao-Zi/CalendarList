<template>
  <DndProvider :backend="HTML5Backend">
    <div ref="containerRef" class="container">
      <Day
        v-for="(dateInfo, index) in calendarInfo"
        :key="dateInfo.fullTime"
        :date-info="dateInfo"
        :now-day="nowDay"
        :show-max-count="dayComponentInfo.showMaxCount"
        :event-list="renderEventList[index]"
        :drop-style="dayComponentInfo"
      ></Day>
    </div>
    <Popover
      :show="popoverInfo.isPopoverShow"
      :position-info="popoverInfo.positionInfo"
      :drop-style="dayComponentInfo"
      @close="handleClosePopover"
    >
      <PopoverAdd
        :time-info="popoverInfo.positionInfo"
        :click-event-info="clickEventInfo"
      ></PopoverAdd>
    </Popover>

    <!-- 点击更多项的 popover -->
    <Popover
      :show="popoverAllInfo.isShow"
      :drop-style="dayComponentInfo"
      :position-info="popoverAllInfo.positionInfo"
      :overlap="true"
      :popover-style="{
        width: dayComponentInfo.width * 1.1,
        height: 'auto',
      }"
      @close="setPopoverAllClose"
    >
      <PopoverAll
        :date-info="popoverAllInfo.dateInfo"
        :event-list="popoverAllInfo.eventList"
        @close="setPopoverAllClose"
      />
    </Popover>
  </DndProvider>
</template>

<script lang="ts" setup>
import {
  provide,
  ref,
  onMounted,
  onUnmounted,
  reactive,
  computed,
  shallowRef,
  readonly,
  watch,
  watchEffect,
  nextTick,
} from "vue";
import TestVue from "./test.vue";
import { storeToRefs } from "pinia";
import useStore from "@/stores";
import { DndProvider } from "vue3-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { throttle } from "@/utils/index";
import { getDateTimeList, getRenderEventList } from "@/utils/calendar-tools";

import {
  CalendarEventInfo,
  CalendarInfoType,
  CalendarKey,
  CreateEvent,
  EventType,
  PopoverPosition,
  PopoverTarget,
  SourceEventType,
} from "@/types/components/calendar";

import { PopoverKey } from "@/types/components/popover";

import Day from "./Day.vue";
import Popover from "../Popover/index.vue";
import PopoverAdd from "../PopoverAdd/index.vue";
import PopoverAll from "../PopoverAll/index.vue";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const props = defineProps<{
  currentTime: number;
}>();

const { useCalendarStore } = useStore();
const { eventList } = storeToRefs(useCalendarStore);

const containerRef = ref<HTMLElement | null>(null);

const calendarInfo = ref<CalendarInfoType[]>([]);

const renderEventList = shallowRef<CalendarEventInfo[][]>([]);

const nowDay = dayjs().format("YYYY-MM-DD");

const popoverInfo = reactive<{
  positionInfo: PopoverPosition | null;
  isPopoverShow: boolean;
  isRange: boolean;
}>({
  positionInfo: null,
  isPopoverShow: false,
  isRange: false,
});

const popoverAllInfo = reactive<{
  isShow: boolean;
  dateInfo: { dateIndex: number; fullTime: string } | null;
  eventList: CalendarEventInfo[] | null;
  positionInfo: PopoverPosition | null;
}>({
  isShow: false,
  dateInfo: null,
  eventList: null,
  positionInfo: null,
});

const dayComponentInfo = reactive({
  showMaxCount: 0,
  width: 0,
  height: 0,
});

const lastDrogTime = ref<string>();

const lastClickInfo = reactive({
  id: -1,
  dateIndex: -1,
});

const clickEventInfo = ref<EventType | null>(null);

watch(
  () => props.currentTime,
  () => {
    getDateTimeListFn();
  },
);

watchEffect(async () => {
  const { renderList } = getRenderEventList(
    calendarInfo.value,
    eventList.value,
  );
  renderEventList.value = renderList;
});

const getDayComponentInfo = async () => {
  await nextTick();
  const offsetWidth = containerRef.value?.offsetWidth;
  const offsetHeight = containerRef.value?.offsetHeight;
  dayComponentInfo.width = offsetWidth ? Math.round(offsetWidth / 7) : 0;
  dayComponentInfo.height = offsetHeight ? Math.round(offsetHeight / 6) : 0;
  dayComponentInfo.showMaxCount = Math.floor(dayComponentInfo.height / 25); // 25 为条列表的高度
};

const getDOMList = () => {
  // await nextTick();
  const container = containerRef.value?.children;
  if (container) {
    return Array.from(container) as HTMLElement[];
  }
  return null;
};

const getDateTimeListFn = () => {
  const [year, month] = dayjs(props.currentTime).format("YYYY-MM").split("-");
  calendarInfo.value = getDateTimeList(Number(year), Number(month));
};

const getDateIndex = (time: string): number => {
  return calendarInfo.value.findIndex((calendar) => {
    return calendar.fullTime === time;
  });
};

const createEventByTime = (time: string) => {
  const dateIndex = getDateIndex(time);
  const domList = getDOMList();
  if (dateIndex !== -1 && domList) {
    const target = domList[dateIndex];
    handlePopoverVisiable(null, false, {
      time,
      dateIndex,
      target,
    });
  }
};

const handlePopoverVisiable = (
  eventInfo: EventType | null,
  isRange: boolean,
  start: PopoverTarget,
  end?: PopoverTarget,
  eventId?: number,
) => {
  const { dateIndex } = start;
  clearHoverStatus();
  if (
    popoverAllInfo.isShow &&
    start.dateIndex !== popoverAllInfo.dateInfo?.dateIndex
  ) {
    setPopoverAllClose();
    return;
  }
  // 点击的是事件
  if (eventId) {
    if (eventId === lastClickInfo.id) {
      popoverInfo.isPopoverShow = false;
      return;
    }
    lastClickInfo.id = eventId;
    lastClickInfo.dateIndex = dateIndex;
    clickEventInfo.value = eventInfo;
  } else {
    if (popoverInfo.isPopoverShow) {
      popoverInfo.isPopoverShow = false;
      return;
    }
    lastClickInfo.dateIndex = dateIndex;
    calendarInfo.value[dateIndex].hover = true;
  }
  popoverInfo.isPopoverShow = true;
  popoverInfo.positionInfo = {
    start,
    end: end ?? null,
    isRange,
  };
};

const handlePopoverAllVisiable = (
  isShow: boolean,
  target: HTMLElement,
  dateInfo: CalendarInfoType,
) => {
  if (isShow) {
    if (popoverInfo.isPopoverShow) {
      popoverInfo.isPopoverShow = false;
    }
    const { dateIndex, fullTime } = dateInfo;
    popoverAllInfo.isShow = isShow;
    popoverAllInfo.dateInfo = dateInfo;
    popoverAllInfo.eventList = renderEventList.value[dateIndex];
    popoverAllInfo.positionInfo = {
      start: {
        dateIndex,
        time: fullTime,
        target,
      },
      end: null,
      isRange: false,
    };
  }
};

const setPopoverAllClose = () => {
  if (popoverInfo.isPopoverShow) {
    popoverInfo.isPopoverShow = false;
  }
  popoverAllInfo.isShow = false;
  popoverAllInfo.dateInfo = null;
  popoverAllInfo.eventList = null;
  popoverAllInfo.positionInfo = null;
};

const getEventIndexByTime = (startTime: string, endTime: string) => {
  const start = {
    dateIndex: getDateIndex(startTime),
    time: startTime,
  };
  const end = {
    dateIndex: getDateIndex(endTime),
    time: endTime,
  };
  clearHoverStatus();
  setHoverStatus(start.dateIndex, end.dateIndex);
  createNewEvent(start, end);
};

const createNewEvent = (start: CreateEvent, end: CreateEvent) => {
  const domList = getDOMList();
  if (domList) {
    const list = domList;
    const drag = list[start.dateIndex];
    const drop = list[end.dateIndex];
    popoverInfo.isPopoverShow = true;
    popoverInfo.positionInfo = {
      start: {
        ...start,
        target: drag,
      },
      end: {
        ...end,
        target: drop,
      },
      isRange: true,
    };
  }
};

const handleClosePopover = () => {
  popoverInfo.isPopoverShow = false;
  clearHoverStatus();
  setInitialPopoverStatus();
};

// 清除日历中的 hover 状态
const clearHoverStatus = () => {
  calendarInfo.value.forEach((calendarInfo) => {
    calendarInfo.hover = false;
  });
};

const setHoverStatus = (startIndex: number, endIndex: number) => {
  for (let index = startIndex; index <= endIndex; index++) {
    calendarInfo.value[index].hover = true;
  }
};

const saveEventInfo = (
  eventInfo: Omit<SourceEventType, "id"> & { id?: number },
) => {
  const eventId = eventInfo.id ?? 0;
  let event = {};
  Object.assign(event, eventInfo);
  if (!eventId) {
    Reflect.set(event, "id", Math.floor(Math.random() * 100));
    useCalendarStore.setEvent(event);
  } else {
    useCalendarStore.updateEventInfo(event);
  }
  // 如果popoverAll是打开的就更新数据
  if (popoverAllInfo.isShow) {
    console.log(lastClickInfo.dateIndex);
    setTimeout(() => {
      popoverAllInfo.eventList = renderEventList.value[lastClickInfo.dateIndex];
    }, 500);

    // popoverAllInfo.isShow = false;
  }
};

const getEventById = (eventId: number): SourceEventType | undefined => {
  return eventList.value.find((eventItem) => +eventItem.id === +eventId);
};

// 处理事件拖拽
const handleEventDrag = async (id: number, dropTime: string) => {
  const dragEvent = getEventById(id);
  if (dragEvent) {
    const { startTime, endTime } = dragEvent;
    const eventDiffDays = dayjs(endTime).diff(startTime, "d");
    // 开始时间设置为 dropTime，结束时间设置为 dropTime + 事件的开始和结束时间差
    dragEvent.startTime = dropTime;
    dragEvent.endTime = dayjs(dragEvent.startTime)
      .add(eventDiffDays, "d")
      .format("YYYY-MM-DD");

    lastDrogTime.value = "";
    useCalendarStore.updateEventInfo(dragEvent);
    // clearHoverStatus();
    // popoverAll 是打开的，更新 popoverAll 中的 event
    // if (code === 200 && popoverAllInfo.isShow && popoverAllInfo.dateInfo) {
    //   const { dateIndex } = popoverAllInfo.dateInfo;
    //   popoverAllInfo.eventList = renderEventList.value[dateIndex];
    // }
  }
};

// 事件拖动的 hover 样式
const handleEventHover = (id: number, dropTime: string, dateIndex: number) => {
  // 避免重复执行
  if (lastDrogTime.value !== dropTime) {
    lastDrogTime.value = dropTime;
    const dragEvent = getEventById(id);
    const dropTimeIndex = dateIndex;

    if (dragEvent && dropTimeIndex !== -1) {
      const { startTime, endTime } = dragEvent;
      const eventDiffDays = dayjs(endTime).diff(startTime, "d");

      const currentRenderCount = dropTimeIndex + eventDiffDays;
      const maxCount = calendarInfo.value.length - 1;

      clearHoverStatus();
      // 判断是否有未来事件延伸到下一个月
      if (currentRenderCount > maxCount) {
        const needRenderCount = eventDiffDays - (currentRenderCount - maxCount);
        for (
          let index = maxCount;
          index >= maxCount - needRenderCount;
          index--
        ) {
          calendarInfo.value[index].hover = true;
        }
      } else {
        // 事件只在本月拖拽
        setHoverStatus(dropTimeIndex, dropTimeIndex + eventDiffDays);
      }
    }
  }
};

const handleForwardDrag = (id: number, startTime: string) => {
  const dragEvent = getEventById(id);
  if (dragEvent) {
    if (dragEvent?.startTime === startTime) {
      lastDrogTime.value = "";
    }
    dragEvent.startTime = startTime;
    useCalendarStore.updateEventInfo(dragEvent);
    clearHoverStatus();
  }
};

const handleForwardHover = (
  id: number,
  dropTime: string,
  dateIndex: number,
) => {
  if (lastDrogTime.value !== dropTime) {
    lastDrogTime.value = dropTime;
    const dragEvent = getEventById(id);
    if (dragEvent) {
      const { endTime } = dragEvent;
      const endTimeIndex = calendarInfo.value.findIndex(
        (calendar) => calendar.fullTime === endTime,
      );
      const isCanDrag = dayjs(dropTime).isSameOrBefore(endTime);

      if (isCanDrag) {
        clearHoverStatus();
        const end =
          endTimeIndex === -1 ? calendarInfo.value.length - 1 : endTimeIndex;
        dragEvent.startTime = dropTime;
        setHoverStatus(dateIndex, end);
      }
    }
  }
};

const handleBackwardDrag = (id: number, endTime: string) => {
  const dragEvent = getEventById(id);
  if (dragEvent) {
    if (dragEvent.endTime === endTime) {
      lastDrogTime.value = "";
    }
    dragEvent.endTime = endTime;
    clearHoverStatus();
    useCalendarStore.updateEventInfo(dragEvent);
  }
};

const handleBackwardHover = (
  id: number,
  dropTime: string,
  dateIndex: number,
) => {
  if (lastDrogTime.value !== dropTime) {
    lastDrogTime.value = dropTime;
    const dragEvent = getEventById(id);
    if (dragEvent) {
      const { startTime } = dragEvent;
      const startIndex = calendarInfo.value.findIndex(
        (calendar) => calendar.fullTime === startTime,
      );
      const isCanDrag = dayjs(dropTime).isSameOrAfter(startTime);
      if (isCanDrag) {
        clearHoverStatus();
        dragEvent.endTime = dropTime;
        const start = startIndex === -1 ? 0 : startIndex;
        setHoverStatus(start, dateIndex);
      }
    }
  }
};

const getEventTarget = (
  dateIndex: number,
  id: number,
  domList: HTMLElement[],
): HTMLElement => {
  const eventContainer = Array.from(
    domList[dateIndex].getElementsByClassName("event-container"),
  )[0].children;
  const currentEventIndex = renderEventList.value[dateIndex].findIndex(
    (eventItem) => eventItem?.id === id,
  );
  return eventContainer[currentEventIndex] as HTMLElement;
};

const startEndTimeByMonth = computed(() => {
  if (calendarInfo.value) {
    return {
      start: calendarInfo.value[0].fullTime,
      end: calendarInfo.value[calendarInfo.value.length - 1].fullTime,
    };
  }
  return {
    start: "",
    end: "",
  };
});

// 处理连贯事件
const handleRangePopoverVisiable = (
  eventInfo: EventType,
  dateIndex: number,
  clickTarget: {
    target: HTMLElement;
    type: "start" | "end";
  } | null,
) => {
  clearHoverStatus();
  if (popoverAllInfo.isShow) {
    setPopoverAllClose();
  }
  const { id, startTime, endTime } = eventInfo;
  const { start, end } = startEndTimeByMonth.value;
  clickEventInfo.value = eventInfo;
  // if (id === lastClickInfo.id) {
  //   popoverInfo.isPopoverShow = false;
  //   return;
  // }
  const isBefore = dayjs(startTime).isBefore(start);
  const isAfter = dayjs(endTime).isAfter(end);

  const domList = getDOMList();
  if (domList) {
    // 点击的事件跨月，那么取该事件在本月的第一天为弹出位置
    if (isBefore || isAfter) {
      const currentDateIndex = isBefore ? 0 : getDateIndex(startTime);
      handlePopoverVisiable(
        eventInfo,
        false,
        {
          time: startTime,
          dateIndex: currentDateIndex,
          target: getEventTarget(currentDateIndex, id, domList),
        },
        {
          time: endTime,
          dateIndex: getDateIndex(endTime),
        },
        id,
      );
    } else {
      lastClickInfo.id = id;
      clickEventInfo.value = eventInfo;

      const startTarget: PopoverTarget = {
        time: startTime,
        dateIndex: -1,
      };
      const endTarget: PopoverTarget = {
        time: endTime,
        dateIndex: -1,
      };
      if (clickTarget) {
        const { target, type } = clickTarget;
        if (type === "start") {
          startTarget.target = target;
          startTarget.dateIndex = dateIndex;
        } else {
          endTarget.target = target;
          endTarget.dateIndex = dateIndex;
        }
      }
      const domList = getDOMList();
      if (domList) {
        if (!startTarget.target) {
          const dateIndex = getDateIndex(startTarget.time);
          startTarget.dateIndex = dateIndex;
          startTarget.target = getEventTarget(dateIndex, id, domList);
        }
        if (!endTarget.target) {
          const dateIndex = getDateIndex(endTarget.time);
          endTarget.dateIndex = dateIndex;
          endTarget.target = getEventTarget(dateIndex, id, domList);
        }

        popoverInfo.isPopoverShow = true;
        popoverInfo.positionInfo = {
          start: startTarget,
          end: endTarget,
          isRange: true,
        };
      }
    }
  }
};

const setInitialPopoverStatus = () => {
  popoverInfo.isPopoverShow = false;
  popoverInfo.positionInfo = null;
  lastClickInfo.dateIndex = -1;
  lastClickInfo.id = -1;
  clickEventInfo.value = null;
  clearHoverStatus();
};

provide(CalendarKey, {
  handleEventDrag,
  handleEventHover,
  clearHoverStatus,
  handleForwardDrag,
  handleForwardHover,
  handleBackwardDrag,
  handleBackwardHover,
  createNewEvent,
  getDateIndex,
  getEventIndexByTime,
  setHoverStatus,
  clickEventId: computed(() => clickEventInfo.value?.id ?? -1),
});

provide(PopoverKey, {
  handleClosePopover,
  saveEventInfo,
  handlePopoverAllVisiable,
  handlePopoverVisiable,
  handleRangePopoverVisiable,
  isPopoverShow: popoverInfo.isPopoverShow,
});

onMounted(() => {
  getDateTimeListFn();
  getDayComponentInfo();
});

defineExpose({
  createEventByTime,
  popoverInfo,
  setInitialPopoverStatus,
});
</script>

<style lang="scss" scoped>
.container {
  height: calc(100vh - 40px - 27px);
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-top: 1px solid rgb(239, 239, 245);
  border-left: 1px solid rgb(239, 239, 245);
}
</style>
