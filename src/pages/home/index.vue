<template>
  <div>
    <header>
      <img src="@/assets/logo/Tu.png" class="logo" />
      <div>
        <n-button
          style="margin-right: 20px"
          @click="handleLoginModalVisiable('login')"
        >
          登录
        </n-button>
        <n-button type="primary" @click="handleLoginModalVisiable('register')">
          免费注册
        </n-button>
      </div>
    </header>
  </div>

  <n-modal
    v-model:show="loginModal"
    :style="{
      width: '460px',
    }"
  >
    <n-card content-style="padding: 0;">
      <n-tabs
        type="line"
        size="large"
        :tabs-padding="20"
        pane-style="padding: 20px;"
      >
        <n-tab-pane name="登录">
          <n-form></n-form>
        </n-tab-pane>
        <n-tab-pane name="注册">注册</n-tab-pane>
      </n-tabs>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import type { LoginTabsType } from "@/types/user";

const router = useRouter();
// onMounted(() => {
//   router.push({
//     name: "home",
//   });
// });
let loginModal = ref(false);

let selectTabs = ref<LoginTabsType>("login");

const handleSelectTabs = (value: LoginTabsType) => {
  selectTabs.value = value;
};

const handleLoginModalVisiable = (type: "login" | "register") => {
  loginModal.value = !loginModal.value;
  handleSelectTabs(type);
};
</script>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid var(--gray-eee);
}
.logo {
  width: 3.5rem;
}
</style>
