<template>
  <div class="saju-admin-wrapper">
    <aside class="saju-sidebar">
      <div class="sidebar-logo">SAJU ADMIN</div>
      <nav class="sidebar-nav">
        <ul>
          <router-link to="/dashboard" v-slot="{ isActive, navigate }">
            <li :class="{ active: isActive }" @click="navigate">대시보드</li>
          </router-link>
          <router-link to="/commonCode" v-slot="{ isActive, navigate }">
            <li :class="{ active: isActive }" @click="navigate">
              공통코드 관리
            </li>
          </router-link>
          <router-link to="/sample" v-slot="{ isActive, navigate }">
            <li :class="{ active: isActive }" @click="navigate">샘플 화면</li>
          </router-link>
          <router-link to="/sample2" v-slot="{ isActive, navigate }">
            <li :class="{ active: isActive }" @click="navigate">샘플2 화면</li>
          </router-link>
          <router-link to="/sample3" v-slot="{ isActive, navigate }">
            <li :class="{ active: isActive }" @click="navigate">샘플3 화면</li>
          </router-link>
          <router-link to="/sample4" v-slot="{ isActive, navigate }">
            <li :class="{ active: isActive }" @click="navigate">샘플4 화면</li>
          </router-link>
          <router-link to="/menu" v-slot="{ isActive, navigate }">
            <li :class="{ active: isActive }" @click="navigate">메뉴 관리</li>
          </router-link>
          <router-link to="/fortune" v-slot="{ isActive, navigate }">
            <li :class="{ active: isActive }" @click="navigate">운세 확인</li>
          </router-link>
          <router-link to="/file" v-slot="{ isActive, navigate }">
            <li :class="{ active: isActive }" @click="navigate">파일 관리</li>
          </router-link>
          <router-link to="/roadmap" v-slot="{ isActive, navigate }">
            <li :class="{ active: isActive }" @click="navigate">로드맵 관리</li>
          </router-link>
          <router-link to="/members" v-slot="{ isActive, navigate }">
            <li :class="{ active: isActive }" @click="navigate">회원 관리</li>
          </router-link>
        </ul>
      </nav>
    </aside>

    <section class="saju-container">
      <header class="saju-header">
        <div class="header-top">
          <span>Home > {{ $route.meta.title }}</span>
          <div class="user">관리자님 <button>로그아웃</button></div>
        </div>
        <div class="header-tabs">
          <div class="tab-item active">
            {{ $route.meta.title }} <span>×</span>
          </div>
        </div>
      </header>

      <main class="saju-main">
        <div class="content-card">
          <router-view />
        </div>
      </main>
    </section>
  </div>
</template>

<script setup>
import "@/assets/layout.css";
</script>
