<template>
  <n-dropdown
    placement="bottom"
    trigger="click"
    :options="PRIORITY_OPTIONS"
    :to="false"
    @select="handleSelect"
  >
    <div class="content">
      <div class="priority animate-ping" :style="style"></div>
      <div class="priority" :style="style"></div>
    </div>
  </n-dropdown>
</template>

<script lang="ts" setup>
import { ref, h, computed } from "vue";
import { NButton } from "naive-ui";

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    priority: number;
  }>(),
  {
    disabled: false,
    priority: 1,
  },
);

const selectPriority = ref(props.priority);

const PRIORITY_OPTIONS = [
  {
    label: () =>
      h(
        NButton,
        {
          text: true,
          type: "error",
        },
        { default: () => "重要且紧急" },
      ),
    key: 4,
  },
  {
    label: () =>
      h(
        NButton,
        {
          text: true,
          type: "warning",
        },
        { default: () => "重要不紧急" },
      ),
    key: 3,
  },
  {
    label: () =>
      h(
        NButton,
        {
          text: true,
          type: "info",
        },
        { default: () => "不重要但紧急" },
      ),
    key: 2,
  },
  {
    label: () =>
      h(
        NButton,
        {
          text: true,
          type: "success",
        },
        { default: () => "不重要不紧急" },
      ),
    key: 1,
  },
];

const style = computed(() => {
  const priority = selectPriority.value;
  let backgroundColor = "#18a058";

  switch (priority) {
    case 4:
      backgroundColor = "#d03050";
      break;
    case 3:
      backgroundColor = "#f0a020";
      break;
    case 2:
      backgroundColor = "#2080f0";
      break;
    case 1:
      backgroundColor = "#18a058";
      break;
  }
  return { backgroundColor };
});

const emit = defineEmits<{
  (e: "update:priority", value: number): void;
}>();

const handleSelect = (value: number) => {
  selectPriority.value = value;
  emit("update:priority", value);
};
</script>

<style lang="scss" scoped>
.content {
  width: 15px;
  height: 15px;
  cursor: pointer;
}

@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
.animate-ping {
  position: relative;
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.priority {
  position: absolute;
  opacity: 0.75;
  background-color: #18a058;
  width: 15px;
  height: 15px;
  border-radius: 50%;
}
</style>
