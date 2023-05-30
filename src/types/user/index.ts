export const UserToken = {
  ASSET_TOKEN: "tutulist_asset_token",
  REFRESH_TOKEN: "tutulist_refresh_token",
} as const;

export enum UserLockEnum {
  LOCK,
  UNLOCK,
}

export type LoginTabsType = "login" | "register";

export enum UserCancelEnum {
  "NOT_CANCEL",
  "CANCEL",
}

export enum UserGenderEnum {
  "MAN" = 0,
  "WOMAN" = 1,
  "SECRECY" = -1,
}

export type UserInfo = {
  id: number;
  username: string;
  mobile: number;
  avatar: string;
  isLock: UserLockEnum;
  isCancel: UserCancelEnum;
  gender: `${UserGenderEnum}`;
};
