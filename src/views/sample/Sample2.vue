<template>
  <div class="form-container">
    <section class="search-container">
      <div class="search-group mb-10">
        <label>3. 3단 Select + 텍스트 검색</label>
        <span class="badge-enterprise">Enterprise</span>
      </div>
      <p class="helper-text">
        대분류 → 중분류 → 소분류 선택 후 검색. 제조/ERP/PLM에서 자주 사용.
      </p>

      <div class="search-row">
        <div class="search-group">
          <select
            v-model="selectedLarge"
            @change="handleLargeChange"
            class="custom-select w-150"
          >
            <option value="">대분류</option>
            <option v-for="item in dataTree" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>

        <div class="search-group">
          <select
            v-model="selectedMedium"
            @change="handleMediumChange"
            :disabled="!selectedLarge"
            :class="[
              'custom-select w-150',
              { 'readonly-input': !selectedLarge },
            ]"
          >
            <option value="">중분류</option>
            <option
              v-for="item in mediumOptions"
              :key="item.id"
              :value="item.id"
            >
              {{ item.name }}
            </option>
          </select>
        </div>

        <div class="search-group">
          <select
            v-model="selectedSmall"
            :disabled="!selectedMedium"
            :class="[
              'custom-select w-150',
              { 'readonly-input': !selectedMedium },
            ]"
          >
            <option value="">소분류</option>
            <option
              v-for="item in smallOptions"
              :key="item.id"
              :value="item.id"
            >
              {{ item.name }}
            </option>
          </select>
        </div>

        <div class="search-group">
          <div class="input-with-icon">
            <i class="icon-search">🔍</i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="품번 / 품명"
              class="w-200"
            />
          </div>
        </div>

        <button @click="onSearch" class="btn-search">검색</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// 1. 데이터 구조 (부모-자식 관계)
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
      { id: "M2", name: "센서", children: [{ id: "S3", name: "조도센서" }] },
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
          { id: "S4", name: "알루미늄" },
          { id: "S5", name: "스틸" },
        ],
      },
    ],
  },
];

// 2. 선택 상태 값
const selectedLarge = ref("");
const selectedMedium = ref("");
const selectedSmall = ref("");
const searchQuery = ref("");

// 3. 하위 옵션 자동 계산 (Computed)
const mediumOptions = computed(() => {
  const large = dataTree.find((item) => item.id === selectedLarge.value);
  return large ? large.children : [];
});

const smallOptions = computed(() => {
  const medium = mediumOptions.value.find(
    (item) => item.id === selectedMedium.value,
  );
  return medium ? medium.children : [];
});

// 4. 상위 선택 변경 시 하위 초기화 로직
const handleLargeChange = () => {
  selectedMedium.value = "";
  selectedSmall.value = "";
};

const handleMediumChange = () => {
  selectedSmall.value = "";
};

const onSearch = () => {
  alert(
    `검색 실행: ${selectedLarge.value} > ${selectedMedium.value} > ${selectedSmall.value} (검색어: ${searchQuery.value})`,
  );
};
</script>
