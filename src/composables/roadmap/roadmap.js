import { ref } from "vue";

export function useRoadmap() {
  const months = [
    "10월",
    "11월",
    "12월",
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
  ];

  // 데이터 예시 (시작 월 인덱스, 지속 기간)
  const tasks = ref([
    {
      name: "APMS 요구",
      start: 0,
      duration: 1.5,
      color: "#e1f3ff",
      borderColor: "#409eff",
    },
    {
      name: "로드맵 스냅샷",
      start: 2.5,
      duration: 2,
      color: "#fdf3e7",
      borderColor: "#e6a23c",
    },
    {
      name: "DB 스키마",
      start: 1,
      duration: 1,
      color: "#f0f0ff",
      borderColor: "#7b7de5",
    },
    {
      name: "Parts FE 개발",
      start: 3,
      duration: 3,
      color: "#e7faf0",
      borderColor: "#67c23a",
    },
  ]);

  return { months, tasks };
}
