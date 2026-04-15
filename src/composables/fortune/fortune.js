import { ref } from "vue";

export function resultFn() {
  const columns = ref([
    {
      id: "todo",
      title: "할 일",
      tasks: [
        { id: "TASK-1", content: "메뉴 관리 기능 고도화" },
        { id: "TASK-2", content: "ECharts 대시보드 수정" },
      ],
    },
    {
      id: "doing",
      title: "진행 중",
      tasks: [{ id: "TASK-3", content: "칸반 보드 라이브러리 조사" }],
    },
    {
      id: "done",
      title: "완료",
      tasks: [],
    },
  ]);

  const onDragChange = (evt) => {
    console.log("데이터 변경됨:", evt);
    // 여기서 백엔드 API를 호출해 순서나 상태를 저장하면 됩니다.
  };
  return {
    columns,
    onDragChange,
  };
}

export default resultFn;
