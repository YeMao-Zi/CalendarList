import { defineStore } from "pinia";
import { deepClone } from "@/utils/index";

const weekList: string[] = ["一", "二", "三", "四", "五", "六", "日"];
const useCalendarStore = defineStore({
  id: "calendar",
  state: () => ({
    weekList,
    isStartSunday: false,
    eventList: [
      {
        id: 11,
        startTime: "2023-04-04",
        endTime: "2023-04-10",
        title: "做点事情",
        description: "找点事情做做",
        isDone: false,
        priority: 1,
      },
    ],
  }),
  getters: {},
  actions: {
    setWeekList() {
      let selectWeekList = deepClone(weekList);
      selectWeekList = selectWeekList.map(
        (weekName: string) => `周${weekName}`,
      );
      this.weekList = selectWeekList;
    },
    setEvent(event: any) {
      this.eventList.push(event);
    },
    updateEventInfo(dragEvent: any) {
      const index = this.eventList.findIndex(
        (item) => item.id === dragEvent.id,
      );
      console.log(index, this.eventList, dragEvent);
      this.eventList.splice(index, 1, dragEvent);
    },
  },
});

export default useCalendarStore;
