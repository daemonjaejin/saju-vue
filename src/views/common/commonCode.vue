<template>
  <div style="height: 400px; width: 100%">
    <CodeSearch
      @fetchData="actions.onSearch"
      @resetSearch="actions.onReset"
      @insertData="actions.onInsert"
      @deleteData="actions.onDelete"
      v-model="state.searchParams.value"
    />
    <AgGridVue
      :maxBlocksInCache="1"
      :getRowId="gridOptions.getRowId"
      style="width: 100%; height: 100%"
      :columnDefs="gridOptions.columnDefs.value"
      :rowModelType="'infinite'"
      :rowSelection="gridOptions.rowSelection.value"
      :pagination="true"
      :paginationPageSize="10"
      :cacheBlockSize="10"
      :paginationPageSizeSelector="[5, 10, 20, 50, 100]"
      @grid-ready="gridOptions.onGridReady"
      @cell-clicked="gridOptions.onCellClicked"
    />
    <CodeEditModal
      :ref="(el) => (refs.editModalRef.value = el)"
      @closeModal="actions.onCloseModal"
      @save="actions.onHandlerUpdate"
    />
    <CodeSlider
      :ref="(el) => (refs.insertSliderRef.value = el)"
      @close="actions.onCloseSlider"
      @save="actions.onSaveSlider"
      :title="state.sliderTitle.value"
      :subject="state.subject.value"
    />
  </div>
</template>

<script setup>
import { AgGridVue } from "ag-grid-vue3";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { useAgGrid } from "@/composables/code/commonCode";
import CodeSearch from "@/components/code/CodeSearch.vue";
import CodeEditModal from "@/components/code/CodeEditModal.vue";
import CodeSlider from "@/components/code/CodeSlider.vue";

ModuleRegistry.registerModules([AllCommunityModule]);

const { state, refs, gridOptions, actions } = useAgGrid();
</script>
