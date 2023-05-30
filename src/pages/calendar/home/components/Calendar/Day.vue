<template>
  <section
    :ref="drop"
    class="day"
    :class="{ dayHover: dateInfo.hover }"
    :style="{ height: dropStyle.height + 'px' }"
  >
    <section class="header">
      <div class="dayName">
        <span class="dayNumber">
          {{ props.dateInfo.day }}
        </span>
        <span class="dayFestival">{{ props.dateInfo.festivalName }}</span>
      </div>
      <div class="dayType">
        <span v-if="props.dateInfo.isAddtionalWorkday" class="workday">班</span>
        <span v-if="props.dateInfo.isHoliday" class="holiday">休</span>
        <div v-if="props.nowDay == props.dateInfo.fullTime" class="today"></div>
      </div>
    </section>

    <EventList
      :event-list="eventList"
      :date-info="dateInfo"
      :drop-style="dropStyle"
      :show-max-count="showMaxCount"
    ></EventList>
  </section>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, ref, watch } from "vue";
import dayjs from "dayjs";
import { useDrag, useDrop } from "vue3-dnd";

import { getEmptyImage } from "react-dnd-html5-backend";
import {
  DragEventTypeEnum,
  CalendarEventInfo,
  CalendarInfoType,
  DragItemTypes,
  DropResult,
  CalendarKey,
} from "@/types/components/calendar";
import { PopoverKey } from "@/types/components/popover";
import EventList from "./EventList.vue";

const injectCalendarInfo = inject(CalendarKey);
const injectPopoverInfo = inject(PopoverKey);

const props = defineProps<{
  dateInfo: CalendarInfoType;
  eventList: CalendarEventInfo[];
  dropStyle: {
    width: number;
    height: number;
  };
  nowDay: string;
  showMaxCount: number;
}>();

// const injectCalendarInfo = inject(CalendarKey);

// Day 组件既是放置源又是拖拽源
const [, drag, preview] = useDrag({
  type: DragEventTypeEnum.NEW,
  item: () => ({
    dragTime: props.dateInfo.fullTime,
    dateIndex: props.dateInfo.dateIndex,
  }),
  end: (item, monitor) => {
    const didDrap = monitor.didDrop(); // 是否成功拖放
    if (didDrap) {
      const dropResult: DropResult | null = monitor.getDropResult();
      if (dropResult) {
        const dragItem = {
          dateIndex: item.dateIndex,
          time: item.dragTime,
        };
        const dropItem = {
          dateIndex: dropResult.dateIndex,
          time: dropResult.dropTime,
        };

        if (dragItem.dateIndex > dropItem.dateIndex) {
          // 往前拖拽时
          injectCalendarInfo?.createNewEvent(dropItem, dragItem);
        } else {
          injectCalendarInfo?.createNewEvent(dragItem, dropItem);
        }
      }
    }
  },
});

const [dropCollect, drop] = useDrop({
  accept: [
    DragEventTypeEnum.EVENT,
    DragEventTypeEnum.FORWARD,
    DragEventTypeEnum.BACKWARD,
    DragEventTypeEnum.NEW,
  ],
  collect: (monitor) => ({
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }),
  drop: (item, monitor) => {
    if (monitor.isOver() && monitor.canDrop()) {
      injectCalendarInfo?.clearHoverStatus();
    }
    return {
      dropTime: props.dateInfo.fullTime,
      dateIndex: props.dateInfo.dateIndex,
    };
  },
  hover: (item, monitor) => {
    const dragItem: DragItemTypes = monitor.getItem();
    if (!dragItem) return;
    const dragType = monitor.getItemType();
    const { eventId } = dragItem;
    const { fullTime, dateIndex } = props.dateInfo;
    switch (dragType) {
      case DragEventTypeEnum.EVENT:
        injectCalendarInfo?.handleEventHover(
          eventId as number,
          fullTime,
          dateIndex,
        );
        break;
      case DragEventTypeEnum.FORWARD:
        injectCalendarInfo?.handleForwardHover(
          eventId as number,
          fullTime,
          dateIndex,
        );
        break;
      case DragEventTypeEnum.BACKWARD:
        injectCalendarInfo?.handleBackwardHover(
          eventId as number,
          fullTime,
          dateIndex,
        );
        break;
      case DragEventTypeEnum.NEW:
        console.log("NEW");
        break;
      default:
        break;
    }

    // 拖动过程中如果 popover open 状态，那么将其关闭
    if (injectPopoverInfo?.isPopoverShow) {
      injectPopoverInfo.handleClosePopover;
    }
  },
});

// watch(
//   () => dropCollect.value.canDrop,
//   (canDrop) => {
//     console.log(canDrop, dropCollect.value.isOver);
//   },
// );

onMounted(() => {
  const emptyImage = getEmptyImage();
  // preview(emptyImage, { captureDraggingState: true });
});
</script>

<style lang="scss" scoped>
.day {
  // border: 1px solid rgb(239, 239, 245);
  box-sizing: border-box;
  border-right: 1px solid rgb(239, 239, 245);
  border-bottom: 1px solid rgb(239, 239, 245);
}
// .day:hover {
//   background-color: rgba(0, 0, 0, 0.09);
//   // background-color: rgba(24, 160, 88, 0.1);
// }

.dayHover {
  background-color: rgba(24, 160, 88, 0.3);
}

.header {
  position: relative;
  height: $item-height;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .dayName {
    .dayNumber {
      margin-left: 0.5rem;
    }
    .dayFestival {
      margin-left: 0.5rem;
      color: #4098fc;
    }
  }
  .dayType {
    & span {
      margin-right: 0.5rem;
    }
    .today {
      display: inline-block;
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border-top: 15px solid skyblue;
      border-left: 15px solid transparent;
    }
    .workday {
      color: red;
    }
    .holiday {
      color: #18a058;
    }
  }
}
</style>
