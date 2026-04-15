// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // 라우터 불러오기
import "@/assets/css/common.css"; // 공통 스타일 불러오기
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import _ from 'lodash' // lodash 불러오기

const app = createApp(App);

app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.config.globalProperties._ = _; // lodash를 전역에서 사용할 수 있도록 설정
app.use(router); // 이 부분이 꼭 있어야 합니다!
app.mount("#app");
