import { h } from "vue";
import { NIcon } from "naive-ui";

import type { Component } from "vue";

import type {
  EventType,
  SourceEventType,
  CalendarInfoType,
  CalendarEventInfo,
  PopoverPlacement,
  Placement,
} from "@/types/components/calendar";

const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};

const getRequestBaseURL = () => {
  const { MODE, VITE_API_DEV, VITE_API_PROD } = import.meta.env;
  const defaultBaseUrl = "/api";
  switch (MODE) {
    case "development":
      return defaultBaseUrl;
    case "staging":
      return VITE_API_DEV;
    case "production":
      return VITE_API_PROD;
    default:
      return defaultBaseUrl;
  }
};

/**
 * 深拷贝
 * @param Data
 * @return newData
 */
const deepClone = (obj: any) => {
  if (typeof obj !== "object") {
    return obj;
  }
  let objClone = new obj.constructor();
  for (const key in obj) {
    objClone[key] = deepClone(obj[key]);
  }
  return objClone;
};

/**
 * 是否为空
 * @description 判断是否是null,对象是否为空，数组是否为空。是否为 undefaind，是否为 “”空字符串。
 * @param s 任意
 */
const isEmpty = (s: any) => {
  if (typeof s === "string") {
    s = s.trim();
  }
  if (s == "") return true;
  if (s == null) return true;
  if (typeof s === "undefined") return true;
  if (Array.isArray(s)) {
    if (s.length == 0) return true;
  }
  if (typeof s === "object") {
    if (Object.keys(s).length == 0) return true;
  }
  return false;
};

function throttle(this: any, fn: Function, interval: number, leading = true) {
  //该变量用于记录上一次函数的执行事件
  let lastTime = 0;
  // 内部的控制是否立即执行的变量
  let isLeading = true;
  const _throttle = (...args: any[]) => {
    // 获取当前时间
    const nowTime = new Date().getTime();

    // 第一次不需要立即执行
    if (!leading && isLeading) {
      // 将lastTime设置为nowTime，这样就不会导致第一次时remainTime大于interval
      lastTime = nowTime;
      // 将isLeading设置为false，这样就才不会对后续的lastTime产生影响。
      isLeading = false;
    }
    // cd剩余时间
    const remainTime = nowTime - lastTime;
    // 如果剩余时间大于间隔时间，也就是说可以再次执行函数
    if (remainTime - interval >= 0) {
      fn.apply(this, args);
      // 将上一次函数执行的时间设置为nowTime，这样下次才能重新进入cd
      lastTime = nowTime;
    }
  };
  // 返回_throttle函数
  return _throttle;
}

const getRowColNum = (
  dateIndex: number,
): { colNum: number; rowNum: number } => {
  const rowNum = Math.ceil((dateIndex + 1) / 7); // 当前行
  const colNum = (dateIndex + 1) % 7 === 0 ? 7 : (dateIndex + 1) % 7; // 当前列
  return {
    rowNum,
    colNum,
  };
};

const getPopoverPlacement = (dateIndex: number): PopoverPlacement => {
  const { rowNum, colNum } = getRowColNum(dateIndex);
  const isLastRow = rowNum === 6;
  const isRight = colNum < 3;
  let placement: Placement = isRight ? "right-start" : "left-start";

  if (isLastRow) {
    placement = isRight ? "right-end" : "left-end";
  }

  return {
    placement,
    rowNum,
    colNum,
  };
};

// 获取新增事件跨天拖拽时 popover 的 placement 信息
const getRangePopoverPlacement = (
  startDateIndex: number,
  endDateIndex: number,
): {
  direction: "start" | "end"; // 以 start 还是 end 的 dom 节点作为弹出位置
  placement: Placement;
} => {
  const { rowNum: startRowNum, colNum: startColNum } =
    getRowColNum(startDateIndex);
  const { rowNum: endRowNum, colNum: endColNum } = getRowColNum(endDateIndex);

  const isLeftEndRow = startRowNum === 6;
  const isRightEndRow = endRowNum === 6;
  const isEndRow = isLeftEndRow || isRightEndRow;

  const toLeft = startColNum >= 3;
  const toRight = endColNum <= 4;

  // 判断事件的两侧是否有冗余空间，如果没有冗余空间，那么 popover 需要向上或者向下弹出
  const isRedundantSpace = toLeft || toRight;

  if (isRedundantSpace) {
    if (isEndRow) {
      // 如果左侧非末行，并且还有冗余空间，那么按照 left-start 处理
      const leftPlacement = isLeftEndRow ? "left-end" : "left-start";

      return {
        direction: toLeft ? "start" : "end",
        placement: toLeft ? leftPlacement : "right-end",
      };
    }
    return {
      direction: toLeft ? "start" : "end",
      placement: toLeft ? "left-start" : "right-start",
    };
  } else {
    return {
      direction: "start",
      placement: startRowNum <= 2 ? "bottom-start" : "top-start",
    };
  }
};

const getPositionInfo = (
  dom: HTMLElement,
): { left: number; top: number; height: number; width: number } => {
  const position = dom.getBoundingClientRect();
  return {
    left: Math.round(position.left),
    top: Math.round(position.top),
    height: Math.round(position.height),
    width: Math.round(position.width),
  };
};

export {
  renderIcon,
  getRequestBaseURL,
  isEmpty,
  deepClone,
  throttle,
  getPopoverPlacement,
  getRangePopoverPlacement,
  getPositionInfo,
};
