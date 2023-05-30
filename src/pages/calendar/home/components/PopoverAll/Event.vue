<script lang="ts" setup>
import { computed, inject, onMounted } from "vue";
import { useDrag } from "vue3-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import { DragEventTypeEnum } from "@/types/components/calendar";
import {
  CalendarEventInfo,
  EventType,
  CalendarKey,
} from "@/types/components/calendar";
import { PopoverKey } from "@/types/components/popover";

const injectCalendarInfo = inject(CalendarKey);
const injectPopoverInfo = inject(PopoverKey);

const props = defineProps<{
  dateInfo: { dateIndex: number; fullTime: string };
  eventInfo: CalendarEventInfo;
}>();

const [collect, drag, preview] = useDrag({
  type: DragEventTypeEnum.EVENT,
  item: () => ({
    dragTime: props.dateInfo.fullTime,
    eventId: props.eventInfo?.id,
    eventTitle: props.eventInfo?.title,
    dateIndex: props.dateInfo.dateIndex,
  }),
  end: (item, monitor) => {
    const isDidProp = monitor.didDrop();
    if (isDidProp) {
      const dropResult: { dropTime: string; dateIndex: number } | null =
        monitor.getDropResult();
      if (dropResult) {
        if (dropResult.dropTime !== props.dateInfo.fullTime) {
          injectCalendarInfo?.handleEventDrag(
            item.eventId as number,
            dropResult.dropTime,
          );
        } else {
          injectCalendarInfo?.clearHoverStatus();
        }
      }
    }
  },
});

const handleClick = (event: MouseEvent, eventInfo: EventType) => {
  event.stopPropagation();
  const { dateInfo } = props;
  const currentTarget = event.currentTarget as HTMLElement;
  const { id } = eventInfo;
  const { dateIndex, fullTime: time } = dateInfo;
  injectPopoverInfo?.handlePopoverVisiable(
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
};

const isActive = computed(() => {
  const { eventInfo } = props;
  return eventInfo?.id === injectCalendarInfo?.clickEventId.value;
});

onMounted(() => {
  const emptyImage = getEmptyImage();
  preview(emptyImage, { captureDraggingState: true });
});
</script>

<template>
  <div :ref="drag" class="content">
    <div
      class="item"
      :class="{ active: isActive }"
      @click="handleClick($event, eventInfo!)"
    >
      {{ eventInfo?.title }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  //   background-color: rgb(74, 222, 128, 0.4);
  & .item {
    width: auto;
    color: #18a058;
    // background-color: rgb(74, 222, 128, 0.4);
    margin-top: 2px;
    padding: 0 2px;
    border-radius: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  & .active {
    background-color: rgb(74, 222, 128, 0.4);
    color: rgb(34, 197, 94, 0.7);
  }
}
</style>
