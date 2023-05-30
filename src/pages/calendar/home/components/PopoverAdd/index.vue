<template>
  <header>
    <n-checkbox v-model:checked="eventInfo.isDone" size="large" />
    <TimeSelect
      :start-time="eventInfo.startTime"
      :end-time="eventInfo.endTime"
      @change="changeEventTime"
    ></TimeSelect>
    <PrioritySelect v-model:priority="eventInfo.priority"></PrioritySelect>
  </header>
  <section class="content">
    <input
      ref="titleRef"
      v-model="eventInfo.title"
      type="text"
      class="title-input"
      placeholder="准备做点什么"
      maxlength="30"
      @keyup.enter="handleKeyUp"
    />
    <textarea
      ref="descriptionRef"
      v-model="eventInfo.description"
      placeholder="描述"
      class="title-input description-textarea"
      style="width: 100%"
      maxlength="100"
    />
  </section>
  <footer>
    <TodoBoxTools :event-info="eventInfo"></TodoBoxTools>
  </footer>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, inject, watch } from "vue";
import TimeSelect from "./TimeSelect.vue";
import PrioritySelect from "@/pages/calendar/components/PrioritySelect.vue";
import TodoBoxTools from "@/pages/calendar/components/TodoBoxTools.vue";

import {
  PopoverPosition,
  EventType,
  SourceEventType,
  CalendarKey,
} from "@/types/components/calendar";
import { PopoverKey } from "@/types/components/popover";

const injectInfo = inject(CalendarKey);

const descriptionRef = ref<HTMLElement | null>();
const titleRef = ref<HTMLElement | null>();

const props = defineProps<{
  timeInfo: PopoverPosition | null;
  clickEventInfo: EventType | null;
  disabledTime?: boolean;
  disabledPriority?: boolean;
  getDateIndex?: (time: string) => number;
  setHoverStatus?: (startIndex: number, endIndex: number) => void;
}>();

const eventInfo = reactive({
  startTime: "",
  endTime: "",
  title: "",
  description: "",
  priority: 1,
  isDone: false,
  id: 0,
});

const handleKeyUp = () => {
  descriptionRef.value?.focus();
};

const setEventInfo = () => {
  const { start, end } = props.timeInfo ?? {};
  eventInfo.startTime = start?.time ?? "";
  eventInfo.endTime = end ? end.time : eventInfo.startTime;
  if (props.clickEventInfo) {
    const { title, description, isDone, priority, id } = props.clickEventInfo;
    eventInfo.title = title;
    eventInfo.description = description ?? "";
    eventInfo.isDone = Boolean(isDone);
    eventInfo.priority = priority;
    eventInfo.id = id;
  }
};

watch(
  () => props.clickEventInfo,
  (clickEventInfo) => {
    if (clickEventInfo) {
      titleRef.value?.focus();
      setEventInfo();
    }
  },
);

const changeEventTime = ({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}) => {
  eventInfo.startTime = startTime;
  eventInfo.endTime = endTime;
  injectInfo?.getEventIndexByTime(startTime, endTime);
};

onMounted(() => {
  titleRef.value?.focus();
  setEventInfo();
});
</script>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  margin: 0 10px;
  border-bottom: 1px solid var(--gray-eee);
}
.content {
  width: 100%;
  height: 160px;
  position: relative;
  padding-top: 5px;
  .title-input {
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    border: none;
    outline: 2px solid transparent;
    outline-offset: 2px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      "Liberation Mono", "Courier New", monospace;
    font-size: 1rem /* 16px */;
    line-height: 1.5rem /* 24px */;
    background-color: transparent;
    letter-spacing: 0.05em;
    color: var(--gray-999);
    font-weight: 500;
  }

  .description-textarea {
    overflow-x: hidden;
    resize: none;
    height: 120px;
    font-weight: 500;
  }
}

footer {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  height: 30px;
}
</style>
