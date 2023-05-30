<template>
  <div>
    <div :ref="drop" class="drop">
      {{ text }}
    </div>
    <div :ref="drag" class="drag">drag</div>
    {{ dropCollect }}
  </div>
</template>

<script lang="ts" setup>
import { ref, toRef, toRefs, computed, unref, watch } from "vue";
import { useDrop, useDrag } from "vue3-dnd";

const [dropCollect, drop] = useDrop({
  accept: "box",
  drop: () => ({ name: "Dustbin" }),
  collect: (monitor) => ({
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }),
});
watch(
  () => dropCollect.value.canDrop,
  () => {},
);
const text = computed(() => {
  if (unref(dropCollect.value.canDrop)) {
    if (unref(dropCollect.value.isOver)) {
      return "someThingAlreadyDraghere";
    }
    return "someThingDrap";
  } else {
    return "dragSomeThingHere";
  }
});

const [dragCollect, drag, preview] = useDrag({
  type: "box",
  item: () => ({
    name: "box1",
  }),
  collect: (monitor) => ({
    isDragging: monitor.isDragging(),
    handlerId: monitor.getHandlerId(),
  }),
  end: (item, monitor) => {
    const dropResult = monitor.getDropResult();
    const dragItem = monitor.getItem();
    console.log(dropResult, "dropResult", dragItem, item);
  },
});
</script>

<style lang="scss" scoped>
.drop {
  width: 12rem;
  height: 12rem;
  background-color: black;
  color: white;
}

.drag {
  width: 50px;
  height: 50px;
  border: 2px solid gray;
}
</style>
