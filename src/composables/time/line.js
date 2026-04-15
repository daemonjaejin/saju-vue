import { ref } from "vue";

export function useTimeline() {
  const activities = ref([
    {
      content: '새로운 작업 "메인 페이지 UI 수정" 추가됨',
      timestamp: "2026-04-14 10:30",
      size: "large",
      type: "primary",
      icon: "Plus",
      color: "#409EFF",
    },
    {
      content: '장원영님이 "로그인 API 연동"을 완료로 이동',
      timestamp: "2026-04-14 09:15",
      color: "#67C23A",
    },
    {
      content: "서버 점검 및 데이터베이스 최적화",
      timestamp: "2026-04-13 18:00",
      type: "info",
    },
  ]);

  return { activities };
}
