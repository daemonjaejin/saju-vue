<!-- 파일명: src/views/login/Login.vue -->
<template>
  <div class="login-container">
    <form @submit.prevent="onSubmit">
      <div class="field">
        <label>유저ID</label>
        <input v-model="userId" type="text" placeholder="ID를 입력해주세요." />
        <p v-if="errors.userId" class="error">{{ errors.userId }}</p>
      </div>

      <div class="field">
        <label>비밀번호</label>
        <input v-model="password" type="password" placeholder="••••••••" />
        <p v-if="errors.password" class="error">{{ errors.password }}</p>
      </div>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "로그인 중..." : "로그인" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { z } from "zod";
import api from "@/api/axios";
import axios from "axios";

const router = useRouter();

// 입력값
const userId = ref("");
const password = ref("");

// 상태
const isSubmitting = ref(false);
const errors = ref({});

// zod 유효성 검사 스키마 (React 버전과 동일)
const loginSchema = z.object({
  userId: z.string().min(1, "ID 입력하세요"),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
});

const onSubmit = async () => {
  // 제출 전 에러 초기화
  errors.value = {};

  // zod 유효성 검사
  const result = loginSchema.safeParse({
    userId: userId.value,
    password: password.value,
  });

  // 유효성 검사 실패 시 에러 표시
  if (!result.success) {
    result.error.errors.forEach((err) => {
      errors.value[err.path[0]] = err.message;
    });
    return;
  }

  // API 호출
  isSubmitting.value = true;
  try {
    const response = await api.post("/auth/login", result.data);
    const { accessToken, refreshToken } = response.data;

    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    router.push("/dashboard");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      alert(error.response?.data?.message ?? "로그인에 실패했습니다");
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
