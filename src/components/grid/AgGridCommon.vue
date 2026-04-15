<template>
  <div class="ag-theme-alpine" style="height: 500px; width: 100%">
    <ag-grid-vue
      style="width: 100%; height: 100%"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      @grid-ready="onGridReady"
      v-bind="$attrs"
    >
    </ag-grid-vue>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { AgGridVue } from "ag-grid-vue3"; // Vue 3 기준
import "ag-grid-community/styles/ag-grid.css"; // 핵심 CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // 테마 CSS

const props = defineProps({
  columnDefs: { type: Array, required: true },
  rowData: { type: Array, required: true },
});

const emit = defineEmits(["grid-ready"]);

// 모든 컬럼에 공통으로 적용될 설정
const defaultColDef = reactive({
  sortable: true,
  filter: true,
  resizable: true,
  flex: 1, // 컬럼 너비 자동 조절
});

const gridApi = ref(null);

const onGridReady = (params) => {
  gridApi.ref = params.api;
  emit("grid-ready", params); // 부모 컴포넌트에서 API에 접근할 수 있도록 전달
};
</script>
