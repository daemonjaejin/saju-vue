import { ref, computed, onMounted, nextTick } from "vue";
import api from "@/api/axios";
import _ from "lodash";
import z from "zod";

export function menuFn() {
  const menuIdDisabled = ref(false);
  const gridApi = ref(null);
  const isLoading = ref(false);
  const menuList = ref([]); // 리스트 데이터 저장용
  const selectedMenu = ref(null);
  const inputRefs = ref({}); // 입력 필드 참조 저장용
  const setInputRef = (el, name) => {
    if (el) inputRefs.value[name] = el;
  };
  const searchParams = ref({
    menuParentId: "",
    menuName: "",
    menuUrl: "",
    useYn: null,
  });
  // 1. 최상위 메뉴 추가를 위한 빈 폼 생성
  const addNewRootMenu = () => {
    menuIdDisabled.value = true; // 메뉴 ID 입력 활성화
    selectedMenu.value = {
      menuId: "", // 서버에서 자동생성하거나 직접 입력
      menuParentId: null,
      menuName: "",
      menuUrl: "",
      useYn: 1,
      isNew: true, // 신규 생성임을 표시하는 플래그
    };
  };
  // 2. 특정 메뉴의 하위 메뉴 추가를 위한 폼 생성
  const addNewSubMenu = (parentRow) => {
    menuIdDisabled.value = true; // 메뉴 ID 입력 활성화
    selectedMenu.value = {
      menuId: "",
      menuParentId: parentRow.menuId, // 부모 ID 자동 세팅
      menuName: "",
      menuUrl: "",
      useYn: 1,
      isNew: true,
    };
  };
  const schema = z.object({
    menuName: z.string().min(1, "메뉴 이름을 입력해주세요."),
    menuUrl: z.string().min(1, "URL 경로를 입력해주세요."),
  });
  const errors = ref({});

  const fetchData = async (params) => {
    isLoading.value = true;
    try {
      const response = await api.post("/menu/list", searchParams.value);
      const rowData = response.data.content || [];
      menuList.value = rowData.map((item) => ({
        ...item,
        menuPath: item.menuParentId
          ? [item.menuParentId, item.menuId]
          : [item.menuId],
      }));
    } catch (error) {
      console.error("메뉴 목록 조회 중 오류 발생:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const onSearch = (params) => {
    searchParams.value = params;
    if (gridApi.value) {
      gridApi.value.purgeInfiniteCache(); // 서버에 1페이지부터 다시 요청
      // 1. 선택된 체크박스 모두 해제
      gridApi.value.deselectAll();
    }
  };

  const treeData = computed(() => {
    const list = menuList.value || [];

    const grouped = _.groupBy(list, "menuParentId");
    const transform = (parentId) => {
      const children = grouped[parentId] || [];
      return children.map((item) => ({
        ...item,
        children: transform(item.menuId),
      }));
    };
    return transform(null) || transform(parentId);
  });

  const handleRowClick = async (row) => {
    try {
      menuIdDisabled.value = true; // 메뉴 ID 입력 활성화
      const response = await api.post("/menu/detail", { menuId: row.menuId });
      selectedMenu.value = response.data;
    } catch (error) {
      console.error("선택된 메뉴 데이터 처리 중 오류 발생:", error);
    }
  };

  const saveMenu = async () => {
    const result = schema.safeParse(selectedMenu.value);

    if (!result.success) {

      const fieldErrors = result.error.flatten().fieldErrors;
      errors.value = fieldErrors;

      // 에러 발생 시 사용자에게 알림을 줘야 "이벤트가 발생했다"는 것을 인지할 수 있습니다.
      //   alert(Object.values(fieldErrors)[0][0]);

      const firstErrorField = Object.keys(fieldErrors)[0];
      await nextTick();
      const targetEl = inputRefs.value[firstErrorField];
      if (targetEl) {
        // Element Plus 컴포넌트는 내부 input에 focus()를 줘야 할 수도 있습니다.
        const input =
          targetEl.$el?.querySelector("input") || targetEl.focus?.();
        if (input && input.focus) input.focus();
      }
      return;
    }
    try {
      // isNew 플래그에 따라 등록(POST) 또는 수정(PUT) 분기 처리
      const payload = {
        ...selectedMenu.value,
        // Java의 LocalDateTime이 인식할 수 있게 시간(T00:00:00)을 붙여줌
        createDate: selectedMenu.value.createDate
          ? `${selectedMenu.value.createDate}T00:00:00`
          : null,
        updateDate: selectedMenu.value.updateDate
          ? `${selectedMenu.value.updateDate}T00:00:00`
          : null,
      };
      const apiPath = selectedMenu.value.isNew
        ? "/menu/insert"
        : "/menu/update";
      await api.put(apiPath, payload);
      await fetchData(); // 목록 새로고침
    } catch (error) {
      console.error("저장 실패:", error);
    }
  };
  const deleteMenu = async () => {
    if (!selectedMenu.value) return;
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await api.delete("/menu/delete", {
        data: { menuId: selectedMenu.value.menuId },
      });
      selectedMenu.value = null; // 폼 초기화
      await fetchData(); // 목록 새로고침
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };
  const cancelMenu = () => {
    selectedMenu.value = null;
    errors.value = {};
  };

  onMounted(() => {
    fetchData();
  });

  return {
    actions: {
      onSearch,
      handleRowClick,
      saveMenu,
      deleteMenu,
      addNewRootMenu,
      addNewSubMenu,
      cancelMenu,
      setInputRef,
    },
    state: {
      searchParams,
      isLoading,
      menuList,
      selectedMenu,
      menuIdDisabled,
    },
    dataMode: {
      treeData,
      fetchData,
      errors,
    },
  };
}
