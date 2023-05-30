<script lang="ts" setup>
import { ref, onMounted, inject } from "vue";
import { useDrag } from "vue3-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import { DragEventTypeEnum } from "@/types/components/calendar";
import {
  EventType,
  CalendarInfoType,
  CalendarKey,
} from "@/types/components/calendar";

const injectInfo = inject(CalendarKey);

const props = defineProps<{
  eventInfo: EventType | null;
  dateInfo: CalendarInfoType;
}>();

const [collect, drag, preview] = useDrag({
  type: DragEventTypeEnum.FORWARD,
  item: () => ({
    dragTime: props.dateInfo.fullTime,
    eventId: props.eventInfo?.id,
    eventTitle: props.eventInfo?.title,
  }),
  end: (_item, monitor) => {
    const isDidProp = monitor.didDrop();
    if (isDidProp && props.eventInfo) {
      const dropResult: { dropTime: string } | null = monitor.getDropResult();
      if (dropResult && dropResult.dropTime !== props.dateInfo.fullTime) {
        const { id } = props.eventInfo;
        injectInfo?.handleForwardDrag(id, dropResult.dropTime);
      }
    }
  },
});

onMounted(() => {
  const emptyImage = getEmptyImage();
  preview(emptyImage, { captureDraggingState: true });
});
</script>

<template>
  <div :ref="drag" class="forward"></div>
</template>

<style lang="scss" scoped>
.forward {
  height: 100%;
  width: 0.5rem;
  background-color: transparent;
  cursor: w-resize;
}
</style>
