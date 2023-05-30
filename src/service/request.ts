import axios from "axios";
import router from "@/routers";
import { getRequestBaseURL } from "@/utils";
import useStore from "@/stores";
import { useMessage } from "naive-ui";

import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { UserToken } from "@/types/user";

const MessageApi = useMessage();
const { useGlobalStore } = useStore();

const netWorkCodeMaps: Record<number, string> = {
  404: "404 Not Found",
  405: "Method Not Allowed",
  504: "网关错误",
  500: "服务器错误",
} as const;

const axiosInterface = axios.create({
  baseURL: getRequestBaseURL(),
  timeout: 10000,
  headers: {
    "content-type": "application/json",
  },
});

// 缓存 token 过期后的请求函数
let catchRequestFunc: Array<() => void> = [];

// 请求拦截
axiosInterface.interceptors.request.use((config) => {
  const token = localStorage.getItem(UserToken.ASSET_TOKEN);
  if (token) {
    const { headers } = config;
    headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截
axiosInterface.interceptors.response.use(
  async (response: AxiosResponse<API.BaseResponseType<any>>) => {
    const { status, data } = response;
    if (status === 200) {
      const { code, message } = data;
      const responseCode = Number(code);
      // token 过期
      if (responseCode == 401) {
        // 缓存过期后的请求函数
        new Promise((resolve) => {
          catchRequestFunc.push(() => {
            resolve(request(response.config));
          });
        });
        // 通过 reference token 获取新 token
        await handleRefreshToken();
      } else if (responseCode === 403) {
        router.push({
          name: "homePage",
        });
      } else if (responseCode !== 200) {
        // 业务中非 200 的状态码一律弹出
        MessageApi.error(message);
      }
    }
    return response;
  },
  ({ response }) => {
    // 请求失败，也弹出状态码
    MessageApi.error(netWorkCodeMaps[response.status] || "服务器错误");
  },
);

const handleRefreshToken = async () => {
  const refreshToken = localStorage.getItem(UserToken.REFRESH_TOKEN);

  if (refreshToken) {
    const { code, data } = await request<{
      accessToken: string;
      refreshToken: string;
    }>({
      url: "/user/refreshToken",
      method: "post",
      data: {
        refreshToken: window.localStorage.getItem(UserToken.REFRESH_TOKEN),
      },
    });
    if (Number(code) === 200) {
      localStorage.setItem(UserToken.ASSET_TOKEN, data.accessToken);
      localStorage.setItem(UserToken.REFRESH_TOKEN, data.refreshToken);

      axiosInterface.defaults.headers[
        "Authorization"
      ] = `Bearer ${data.accessToken}`;

      // 执行 token 失效后缓存的请求函数
      catchRequestFunc.forEach((catchFunc) => {
        catchFunc();
      });
    } else {
      // refreshtoken 也过期了，那么跳登录页，重新登录
      useGlobalStore.handleLogout();

      catchRequestFunc = [];
      router.push({
        name: "homePage",
      });
      MessageApi.warning("请重新登录");
    }
  } else {
    // 不存在 refresh token, 跳登录页
    useGlobalStore.handleLogout();
    catchRequestFunc = [];
    router.push({
      name: "homePage",
    });
    MessageApi.warning("请重新登录");
  }
};

const request = async <T>(
  config: AxiosRequestConfig,
): Promise<API.BaseResponseType<T>> => {
  try {
    const { data } = await axiosInterface(config);
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};
