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
        meta: {
          title: "대시보드",
        },
      },
      {
        path: "/members",
        component: () => import("@/views/members/Members.vue"),
        meta: {
          title: "회원 관리",
        },
      },
      {
        path: "/fortune",
        component: () => import("@/views/fortune/Fortune.vue"),
        meta: {
          title: "운세/사주 관리",
        },
      },
      {
        path: "/commonCode",
        component: () => import("@/views/common/commonCode.vue"),
        meta: {
          title: "공통코드 관리",
        },
      },
      {
        path: "/menu",
        component: () => import("@/views/menu/Menu.vue"),
        meta: {
          title: "메뉴 관리",
        },
      },
      {
        path: "/file",
        component: () => import("@/views/file/File.vue"),
        meta: {
          title: "파일 관리",
        },
      },
      {
        path: "/time",
        component: () => import("@/views/time/Line.vue"),
        meta: {
          title: "타임라인 관리",
        },
      },
      {
        path: "/roadmap",
        component: () => import("@/views/roadmap/Roadmap.vue"),
        meta: {
          title: "로드맵 관리",
        },
      },
      {
        path: "/sample",
        component: () => import("@/views/sample/Sample.vue"),
        meta: {
          title: "샘플 화면",
        },
      },
      {
        path: "/sample2",
        component: () => import("@/views/sample/Sample2.vue"),
        meta: {
          title: "샘플2 화면",
        },
      },
      {
        path: "/sample3",
        component: () => import("@/views/sample/Sample3.vue"),
        meta: {
          title: "샘플3 화면",
        },
      },
      {
        path: "/sample4",
        component: () => import("@/views/sample/Sample4.vue"),
        meta: {
          title: "샘플4 화면",
        },
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/Login.vue"), // 레이아웃이 필요 없는 독립 페이지
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
