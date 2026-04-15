<script setup>
// 1. VChart를 가져옵니다.
import VChart from "vue-echarts";
import dashFn from "@/composables/dashboard/dashboard";

// 2. 만약 script setup 안에서 자동으로 인식이 안 된다면
// (드문 경우지만) 아래와 같이 명시적으로 등록해 줄 수도 있습니다.
// 하지만 보통은 import만으로 충분합니다.

const { lineOption, pieOption } = dashFn();
</script>

<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="never" header="주간 통계">
          <v-chart class="chart-box" :option="lineOption" autoresize />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never" header="메뉴 사용 비중">
          <v-chart class="chart-box" :option="pieOption" autoresize />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
