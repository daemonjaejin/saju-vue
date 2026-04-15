<template>
  <el-card shadow="never" class="roadmap-card">
    <template #header>
      <div class="roadmap-header">
        <el-button-group>
          <el-button>월별</el-button>
          <el-button>연도별</el-button>
          <el-button>분기별</el-button>
        </el-button-group>
        <div class="nav-btns">
          <el-button icon="ArrowLeft" circle />
          <el-button>오늘</el-button>
          <el-button icon="ArrowRight" circle />
        </div>
      </div>
    </template>

    <div class="roadmap-wrapper">
      <div class="timeline-grid-header">
        <div v-for="m in months" :key="m" class="grid-col-header">{{ m }}</div>
      </div>

      <div class="timeline-body">
        <div class="grid-lines">
          <div v-for="n in months.length" :key="n" class="grid-line"></div>
        </div>

        <div class="task-rows">
          <div v-for="(task, idx) in tasks" :key="idx" class="task-row">
            <div
              class="task-bar"
              :style="{
                left: `calc(${(task.start / months.length) * 100}%)`,
                width: `calc(${(task.duration / months.length) * 100}%)`,
                backgroundColor: task.color,
                border: `1px solid ${task.borderColor}`,
              }"
            >
              {{ task.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { useRoadmap } from "@/composables/roadmap/roadmap";
const { months, tasks } = useRoadmap();
</script>
