import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import eslintPlugin from "vite-plugin-eslint";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslintPlugin(),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ],

  css: {
    preprocessorOptions: {
      // 全局样式引入
      scss: {
        additionalData: '@import "./src/styles/variable.scss";',
      },
    },
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "src"),
      },
    ],
  },
  server: {
    // https: true,
    port: 5173,
    proxy: {
      // 本地开发环境
      "^/api/.*": {
        target: "http://127.0.0.1:7001",
      },

      // 测试环境
      // "^/api/.*": {
      //   target: "http://dev.tutulist.cn",
      // },

      // 生产环境
      // "^/api/.*": {
      //   secure: false,
      //   target: "https://api.tutulist.cn",
      //   changeOrigin: true,
      // },
    },
  },
});
