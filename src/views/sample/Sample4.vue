<template>
  <div class="search-container">
    <div class="search-group mb-10">
      <label>3. 계층형 드롭다운 메뉴</label>
      <span class="badge-enterprise">Enterprise</span>
    </div>

    <div class="search-row">
      <div class="dropdown-wrapper" @mouseleave="closeAll">
        <button class="dropdown-trigger" @mouseenter="showLarge = true">
          {{ selectedText || "카테고리 선택 (대분류 > 중분류 > 소분류)" }}
          <span class="arrow">▼</span>
        </button>

        <ul v-if="showLarge" class="dropdown-menu">
          <li
            v-for="large in dataTree"
            :key="large.id"
            @mouseenter="activeLarge = large.id"
            class="menu-item"
          >
            {{ large.name }} <span class="next-arrow">〉</span>

            <ul v-if="activeLarge === large.id" class="dropdown-menu sub-menu">
              <li
                v-for="medium in large.children"
                :key="medium.id"
                @mouseenter="activeMedium = medium.id"
                class="menu-item"
              >
                {{ medium.name }} <span class="next-arrow">〉</span>

                <ul
                  v-if="activeMedium === medium.id"
                  class="dropdown-menu sub-menu"
                >
                  <li
                    v-for="small in medium.children"
                    :key="small.id"
                    @click="selectFinal(large, medium, small)"
                    class="menu-item last-item"
                  >
                    {{ small.name }}
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="input-with-icon">
        <i class="icon-search">🔍</i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="품번 / 품명"
          class="w-200"
        />
      </div>
      <button @click="handleSearch" class="btn-search">검색</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 데이터 구조
const dataTree = [
  {
    id: "L1",
    name: "전자부품",
    children: [
      {
        id: "M1",
        name: "반도체",
        children: [
          { id: "S1", name: "메모리" },
          { id: "S2", name: "비메모리" },
        ],
      },
      {
        id: "M2",
        name: "센서",
        children: [
          { id: "S3", name: "조도센서" },
          { id: "S4", name: "근접센서" },
        ],
      },
    ],
  },
  {
    id: "L2",
    name: "기구물",
    children: [
      {
        id: "M3",
        name: "프레임",
        children: [
          { id: "S5", name: "알루미늄" },
          { id: "S6", name: "스틸" },
        ],
      },
    ],
  },
];

const showLarge = ref(false);
const activeLarge = ref(null);
const activeMedium = ref(null);
const selectedText = ref("");
const searchQuery = ref("");

// 최종 선택 처리
const selectFinal = (l, m, s) => {
  selectedText.value = `${l.name} > ${m.name} > ${s.name}`;
  closeAll();
};

const closeAll = () => {
  showLarge.value = false;
  activeLarge.value = null;
  activeMedium.value = null;
};

const handleSearch = () => {
  alert(`검색: ${selectedText.value} / 키워드: ${searchQuery.value}`);
};
</script>
