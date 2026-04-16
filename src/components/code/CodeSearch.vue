<template>
  <div class="search-container" v-search-enter="fetchData">
    <div class="search-row">
      <div class="search-group">
        <label for="groupCode">그룹코드</label>
        <BaseSelect v-model="searchParams.groupCode" id="groupCode" />
      </div>

      <div class="search-group">
        <label for="groupCodeName">그룹코드명</label>
        <input
          type="text"
          id="groupCodeName"
          v-model="searchParams.groupCodeName"
          placeholder="그룹코드명 입력"
        />
      </div>

      <div class="search-group">
        <label for="useYn">사용 유무</label>
        <select id="useYn" v-model="searchParams.useYn">
          <option value="">선택하세요</option>
          <option :value="1">사용</option>
          <option :value="0">미사용</option>
        </select>
      </div>

      <div class="search-group">
        <label for="dateRange">조회기간</label>
        <el-date-picker
          v-model="searchParams.dateRange"
          type="daterange"
          range-separator="~"
          start-placeholder="시작일"
          end-placeholder="종료일"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </div>

      <div class="button-group">
        <button class="btn-insert" @click="insertData">
          <i class="fas fa-insert"></i> 등록
        </button>
        <button class="btn-delete" @click="deleteData">
          <i class="fas fa-delete"></i> 삭제
        </button>
        <button class="btn-search" @click="fetchData">
          <i class="fas fa-search"></i> 조회
        </button>
        <button class="btn-reset" @click="resetSearch">초기화</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineEmits, ref } from "vue";
import BaseSelect from "@/components/common/BaseSelect.vue";
const searchDate = ref(new Date()); // 기본값 오늘
const emit = defineEmits([
  "fetchData",
  "insertData",
  "resetSearch",
  "deleteData",
]);
const searchParams = defineModel();
const fetchData = () => {
  console.log("조회 버튼 클릭", searchParams.value);
  emit("fetchData", searchParams.value); // 부모 호출
};
const resetSearch = () => {
  searchParams.value.groupCode = "";
  searchParams.value.groupCodeName = "";
  searchParams.value.useYn = "";
  emit("resetSearch"); // 부모 호출
};
const insertData = () => {
  emit("insertData"); // 부모 호출
};
const deleteData = () => {
  emit("deleteData"); // 부모 호출
};
</script>
