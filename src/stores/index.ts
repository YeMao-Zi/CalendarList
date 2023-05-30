import useCalendarStore from "./modules/calendar";
import useGlobalStore from "./modules/global";

/*
 * 组件中使用
 * import { storeToRefs } from 'pinia'
 * import useStore from '@/stores'
 * const { useCalendarStore } = useStore()
 *
 * 提交 action
 * useCalendarStore.setStartSundaySync(true)
 *
 * 获取数据
 * 使用storeToRefs可以保证解构出来的数据也是响应式的
 * const { isStartSunday } = storeToRefs(useCalendarStore)
 */
export default function useStore() {
  return {
    useCalendarStore: useCalendarStore(),
    useGlobalStore: useGlobalStore(),
  };
}
