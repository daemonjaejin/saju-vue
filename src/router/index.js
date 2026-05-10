// 파일명: src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        component: () => import("@/views/dashboard/Dashboard.vue"),
        meta: { title: "대시보드" },
      },
      {
        path: "/members",
        component: () => import("@/views/members/Members.vue"),
        meta: { title: "회원 관리" },
      },
      {
        path: "/fortune",
        component: () => import("@/views/fortune/Fortune.vue"),
        meta: { title: "운세/사주 관리" },
      },
      {
        path: "/commonCode",
        component: () => import("@/views/common/commonCode.vue"),
        meta: { title: "공통코드 관리" },
      },
      {
        path: "/menu",
        component: () => import("@/views/menu/Menu.vue"),
        meta: { title: "메뉴 관리" },
      },
      {
        path: "/file",
        component: () => import("@/views/file/File.vue"),
        meta: { title: "파일 관리" },
      },
      {
        path: "/time",
        component: () => import("@/views/time/Line.vue"),
        meta: { title: "타임라인 관리" },
      },
      {
        path: "/roadmap",
        component: () => import("@/views/roadmap/Roadmap.vue"),
        meta: { title: "로드맵 관리" },
      },
      {
        path: "/sample",
        component: () => import("@/views/sample/Sample.vue"),
        meta: { title: "샘플 화면" },
      },
      {
        path: "/sample2",
        component: () => import("@/views/sample/Sample2.vue"),
        meta: { title: "샘플2 화면" },
      },
      {
        path: "/sample3",
        component: () => import("@/views/sample/Sample3.vue"),
        meta: { title: "샘플3 화면" },
      },
      {
        path: "/sample4",
        component: () => import("@/views/sample/Sample4.vue"),
        meta: { title: "샘플4 화면" },
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/Login.vue"),
  },
];

// ↓ 변경 1: export default 에서 변수로 분리
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ↓ 변경 2: 라우터 가드 추가
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.path !== "/login" && !token) {
    // 로그인 페이지 외 모든 페이지 → 토큰 없으면 로그인으로
    next("/login");
  } else if (to.path === "/login" && token) {
    // 이미 로그인됐는데 로그인 페이지 접근 → 대시보드로
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
