<template>
  <div class="kanban-wrapper">
    <el-row :gutter="20">
      <el-col :span="8" v-for="column in columns" :key="column.id">
        <div class="kanban-column">
          <h3 class="column-title">
            {{ column.title }}
            <el-badge :value="column.tasks.length" type="info" />
          </h3>

          <draggable
            v-model="column.tasks"
            group="tasks"
            item-key="id"
            class="drag-area"
            ghost-class="ghost-card"
            @change="onDragChange"
          >
            <template #item="{ element }">
              <el-card shadow="hover" class="task-card">
                <div class="task-content">
                  {{ element.content }}
                </div>
                <div class="task-footer">
                  <el-tag size="small">{{ element.id }}</el-tag>
                </div>
              </el-card>
            </template>
          </draggable>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import fortuneData from "@/composables/fortune/fortune";
import draggable from "vuedraggable";
const { columns, onDragChange } = fortuneData();
</script>
