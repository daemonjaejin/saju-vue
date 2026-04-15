<template>
  <div class="menu-management-wrapper">
    <div class="left-panel">
      <el-card shadow="never" body-style="padding: 0px; height: 100%;">
        <template #header>
          <div class="card-header">
            <span>메뉴 목록</span>
            <div class="header-buttons">
              <el-button
                type="success"
                size="small"
                @click="actions.addNewRootMenu"
              >
                <el-icon><Plus /></el-icon> 최상위 메뉴 추가
              </el-button>
              <el-button type="primary" size="small" @click="fetchData"
                >새로고침</el-button
              >
            </div>
          </div>
        </template>

        <el-table
          :data="treeData"
          row-key="menuId"
          border
          :tree-props="{ children: 'children' }"
          @row-click="actions.handleRowClick"
        >
          <el-table-column prop="menuName" label="메뉴명" min-width="200" />
          <el-table-column prop="menuId" label="메뉴ID" width="150" />
          <el-table-column label="사용 여부" width="100">
            <template #default="{ row }">
              <el-tag :type="row.useYn === 1 ? 'success' : 'info'">
                {{ row.useYn === 1 ? "사용" : "미사용" }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="작업" width="100" align="center">
            <template #default="scope">
              <el-button
                link
                type="primary"
                @click.stop="actions.addNewSubMenu(scope.row)"
              >
                + 하위
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <div class="right-panel">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>메뉴 상세 정보</span>
            <div class="header-buttons">
              <el-button
                v-if="selectedMenu"
                type="danger"
                size="small"
                @click="actions.deleteMenu"
              >
                삭제
              </el-button>
              <el-button
                v-if="selectedMenu"
                type=""
                size="small"
                @click="actions.cancelMenu"
              >
                취소
              </el-button>
            </div>
          </div>
        </template>

        <div v-if="selectedMenu">
          <el-form :model="selectedMenu" label-position="top">
            <el-form-item label="부모 메뉴 ID">
              <el-input
                v-model="selectedMenu.menuParentId"
                :disabled="true"
                placeholder="자동으로 설정됩니다"
              />
            </el-form-item>
            <el-form-item label="메뉴 ID">
              <el-input
                v-model="selectedMenu.menuId"
                :disabled="menuIdDisabled"
              />
            </el-form-item>
            <el-form-item label="메뉴 이름" :error="errors.menuName?.[0]">
              <el-input
                v-model="selectedMenu.menuName"
                :ref="(el) => actions.setInputRef(el, 'menuName')"
              />
            </el-form-item>
            <el-form-item label="URL 경로" :error="errors.menuUrl?.[0]">
              <el-input
                v-model="selectedMenu.menuUrl"
                :ref="(el) => actions.setInputRef(el, 'menuUrl')"
              />
            </el-form-item>
            <el-form-item label="사용 여부">
              <el-select v-model="selectedMenu.useYn" style="width: 100%">
                <el-option label="사용" :value="1" />
                <el-option label="미사용" :value="0" />
              </el-select>
            </el-form-item>
            <div class="form-footer">
              <el-button type="primary" @click="actions.saveMenu"
                >변경사항 저장</el-button
              >
            </div>
          </el-form>
        </div>
        <el-empty v-else description="목록에서 메뉴를 선택해주세요" />
      </el-card>
    </div>
  </div>
</template>
<script setup>
import { menuFn } from "@/composables/menu/menu";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { Plus } from "@element-plus/icons-vue";

ModuleRegistry.registerModules([AllCommunityModule]);

const {
  state: { selectedMenu, menuIdDisabled },
  dataMode: { treeData, fetchData, errors },
  actions,
} = menuFn();
</script>
