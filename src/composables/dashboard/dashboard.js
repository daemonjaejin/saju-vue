import { ref } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, PieChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from "echarts/components";

// 사용할 기능 등록
use([
  CanvasRenderer,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
]);

export function dashFn() {
  const lineOption = ref({
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: ["월", "화", "수", "목", "금", "토", "일"],
      boundaryGap: false,
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "방문자",
        data: [120, 200, 150, 80, 70, 110, 130],
        type: "line",
        smooth: true,
        areaStyle: { opacity: 0.1 }, // 아래쪽 살짝 색칠
        color: "#00c2ff", // --primary-color 사용
      },
    ],
  });

  // 2. 파이 차트 데이터
  const pieOption = ref({
    tooltip: { trigger: "item" },
    legend: { bottom: "0" },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"], // 도넛 모양
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: "#fff", borderWidth: 2 },
        data: [
          { value: 1048, name: "대시보드", itemStyle: { color: "#00c2ff" } },
          { value: 735, name: "메뉴관리", itemStyle: { color: "#007bff" } },
          { value: 580, name: "회원관리", itemStyle: { color: "#ff4d4f" } },
        ],
      },
    ],
  });

  return {
    pieOption,
    lineOption,
  };
}

export default dashFn;

// 1. 선 그래프 데이터 (프로젝트 메인 컬러 적용)
