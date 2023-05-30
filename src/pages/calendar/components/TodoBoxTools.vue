<template>
  <div class="tool">
    <div class="left">
      <n-button size="tiny" secondary type="success" @click="handleSave">
        保存
      </n-button>
    </div>
    <div class="right">
      <n-button size="tiny" secondary type="error">
        <template #icon>
          <n-icon size="18" @click="handleRemove">
            <DeleteIcon />
          </n-icon>
        </template>
      </n-button>
      <n-button size="tiny" secondary type="error" @click="handleClosePopover">
        关闭
      </n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from "vue";
import {
  Delete20Regular as DeleteIcon,
  SendClock20Regular as TodoBoxIcon,
  Folder20Regular as FolderIcon,
} from "@vicons/fluent";
import {
  CalendarInfoType,
  EventType,
  CalendarKey,
  DragEventTypeEnum,
} from "@/types/components/calendar";

import { PopoverKey } from "@/types/components/popover";

const props = defineProps<{
  eventInfo: {
    startTime: string;
    endTime: string;
    title: string;
    description: string;
    priority: number;
    isDone: boolean;
    id?: number;
  };
}>();

const injectPopoverKey = inject(PopoverKey);
const injectInfo = inject(CalendarKey);

const handleRemove = () => {};

const handleClosePopover = () => {
  injectPopoverKey?.handleClosePopover();
  injectInfo?.clearHoverStatus();
};

const handleSave = () => {
  console.log(props.eventInfo);
  injectPopoverKey?.saveEventInfo(props.eventInfo);
  handleClosePopover();
};
</script>

<style lang="scss" scoped>
.tool {
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.right {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
