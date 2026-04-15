<template>
  <div class="form-container">
    <section class="search-container">
      <div class="search-group mb-10">
        <label>6. 칩/태그 필터</label>
        <span class="badge-info">Filter Chips</span>
      </div>
      <p class="helper-text">상태, 카테고리 등 다중 선택. 토글 방식.</p>

      <div class="chip-group">
        <button
          v-for="status in statusOptions"
          :key="status"
          type="button"
          @click="toggleStatus(status)"
          :class="[
            'filter-chip',
            { active: selectedStatuses.includes(status) },
          ]"
        >
          {{ status }}
        </button>
      </div>
    </section>

    <section class="search-container">
      <div class="search-group mb-10">
        <label>7. 태그 입력 검색</label>
        <span class="badge-info">Tag Input</span>
      </div>
      <p class="helper-text">
        여러 키워드를 태그로 추가. Enter로 추가, ✕로 제거.
      </p>

      <div class="search-row">
        <div class="tag-input-wrapper">
          <span
            v-for="(tag, index) in searchTags"
            :key="index"
            class="tag-item"
          >
            {{ tag }}
            <i class="tag-remove" @click="removeTag(index)">✕</i>
          </span>
          <input
            v-model="tagInput"
            @keyup.enter="addTag"
            type="text"
            placeholder="태그 추가 후 Enter"
            class="tag-inner-input"
          />
        </div>
        <button @click="performSearch" class="btn-search">검색</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 6. 필터 칩 데이터
const statusOptions = ["전체", "진행중", "완료", "보류", "취소"];
const selectedStatuses = ref(["보류"]);

const toggleStatus = (status) => {
  if (status === "전체") {
    selectedStatuses.value = ["전체"];
    return;
  }
  if (selectedStatuses.value.includes("전체")) {
    selectedStatuses.value = [];
  }
  const index = selectedStatuses.value.indexOf(status);
  if (index > -1) {
    selectedStatuses.value.splice(index, 1);
  } else {
    selectedStatuses.value.push(status);
  }
};

// 7. 태그 입력 데이터
const tagInput = ref("");
const searchTags = ref([]);
// const searchTags = ref(["vue3", "typescript"]);

const addTag = () => {
  const val = tagInput.value.trim();
  if (val && !searchTags.value.includes(val)) {
    console.log("추가할 태그:", searchTags.value.length);
    if (searchTags.value.length < 1) {
      searchTags.value.push(val);
      tagInput.value = "";
    } else {
      alert("태그는 최대 1개까지 추가할 수 있습니다.");
    }
    // searchTags.value.push(val);
    // tagInput.value = "";
  }
};

const removeTag = (index) => {
  searchTags.value.splice(index, 1);
};

const performSearch = () => {
  console.log("필터:", selectedStatuses.value);
  console.log("태그:", searchTags.value);
};
</script>
