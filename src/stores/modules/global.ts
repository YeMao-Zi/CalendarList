import { defineStore } from "pinia";

import type { GlobalStoreType } from "@/types/stores/global";
import { UserGenderEnum, UserInfo, UserToken } from "@/types/user";
import { TodoFolder } from "@/types/pages/todoBox";
import { ThemeEnum } from "@/types/enum";

import useCalendarStore from "./calendar";

const useGlobalStore = defineStore("global", {
  state: (): GlobalStoreType => ({
    theme: null,
    userInfo: null,
    folderList: [],
    settingTheme: ThemeEnum.SYSTEM,
  }),
  actions: {
    handleTheme(themeType: "dark" | null) {
      this.theme = themeType || null;
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
    },

    updateUserInfo(info: {
      avatar: string;
      username: string;
      gender: `${UserGenderEnum}`;
    }) {
      if (this.userInfo) {
        this.userInfo.avatar = info.avatar;
        this.userInfo.username = info.username;
        this.userInfo.gender = info.gender;
      }
    },
    handleLogout() {
      this.userInfo = null;
      localStorage.removeItem(UserToken.ASSET_TOKEN);
      localStorage.removeItem(UserToken.REFRESH_TOKEN);
    },
  },
});

export default useGlobalStore;
