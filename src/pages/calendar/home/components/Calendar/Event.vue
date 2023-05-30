<template>
  <div
    :ref="drag"
    class="box"
    :class="{
      last: eventInfo?.hasLast,
      next: eventInfo?.hasNext,
      active: isActive,
      done: !isActive && eventInfo?.isDone,
    }"
  >
    <div class="content">
      {{ eventTitle }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, computed } from "vue";
import { useDrag } from "vue3-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import {
  CalendarInfoType,
  EventType,
  CalendarKey,
  DragEventTypeEnum,
} from "@/types/components/calendar";

const props = defineProps<{
  eventInfo: EventType | null;
  dateInfo: CalendarInfoType;
}>();

const injectInfo = inject(CalendarKey);

const isActive = computed(() => {
  const { eventInfo } = props;
  return eventInfo?.id === injectInfo?.clickEventId.value;
});

const eventTitle = computed(() => {
  const { dateInfo, eventInfo } = props;
  const isShow =
    dateInfo.dateIndex % 7 === 0 || (eventInfo && !eventInfo.hasLast);
  return isShow ? eventInfo?.title : "";
});

const [dragCollect, drag, preview] = useDrag({
  type: DragEventTypeEnum.EVENT,
  item: () => ({
    dragTime: props.dateInfo.fullTime,
    eventId: props.eventInfo?.id,
    eventTitle: props.eventInfo?.title,
    dateIndex: props.dateInfo.dateIndex,
  }),
  collect: (monitor) => ({
    isDragging: monitor.isDragging(),
    handlerId: monitor.getHandlerId(),
  }),
  end: (item, monitor) => {
    const isDidProp = monitor.didDrop();
    if (isDidProp) {
      const dropResult: { dropTime: string; dateIndex: number } | null =
        monitor.getDropResult();
      if (dropResult && dropResult.dropTime !== item.dragTime) {
        injectInfo?.handleEventDrag(
          item.eventId as number,
          dropResult.dropTime,
        );
      } else {
        injectInfo?.clearHoverStatus();
      }
    }
  },
});

onMounted(() => {
  const emptyImage = getEmptyImage();
  preview(emptyImage, { captureDraggingState: true });
});
</script>

<style lang="scss" scoped>
.box {
  cursor: default;
  font-size: 14px;
  background-color: rgb(74, 222, 128, 0.4);
  color: #18a058;
  border-radius: 5px;
  width: 100%;
  height: 100%;
}
.content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 0 5px;
}
.active {
  background-color: rgb(34, 197, 94, 0.5);
  color: rgb(34, 197, 94, 0.7);
}
.last {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}

.next {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
</style>
