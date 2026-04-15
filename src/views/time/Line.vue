<template>
  <el-card shadow="never" header="최근 활동 타임라인">
    <div class="timeline-container">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
          :timestamp="activity.timestamp"
          placement="top"
        >
          <el-card class="timeline-content-card" shadow="hover">
            <h4>{{ activity.content }}</h4>
            <p v-if="activity.user" class="user-info">By {{ activity.user }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-card>
</template>

<script setup>
import { useTimeline } from "@/composables/time/line";
const { activities } = useTimeline();
</script>
