<script lang="ts" setup>
import { inject, onMounted } from "vue";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useDrag } from "vue3-dnd";

import {
  CalendarInfoType,
  EventType,
  CalendarKey,
} from "@/types/components/calendar";
import { DragEventTypeEnum } from "@/types/components/calendar";

const props = defineProps<{
  eventInfo: EventType | null;
  dateInfo: CalendarInfoType;
}>();

const injectInfo = inject(CalendarKey);

const [collect, drag, preview] = useDrag({
  type: DragEventTypeEnum.BACKWARD,
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
        injectInfo?.handleBackwardDrag(id, dropResult?.dropTime);
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
  <div :ref="drag" class="backward"></div>
</template>

<style lang="scss" scoped>
.backward {
  height: 100%;
  width: 0.5rem;
  background-color: transparent;
  cursor: w-resize;
}
</style>
