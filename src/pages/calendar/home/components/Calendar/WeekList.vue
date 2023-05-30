<template>
  <section>
    <div v-for="item in weekList" :key="item">{{ item }}</div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import useStore from "@/stores";

const { useCalendarStore } = useStore();
useCalendarStore.setWeekList();
const { weekList } = storeToRefs(useCalendarStore);
</script>

<style lang="scss" scoped>
section {
  height: 25px;
  display: flex;
  div {
    flex: 1;
  }
}
</style>
