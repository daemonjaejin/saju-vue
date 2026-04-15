import { ref, watch } from "vue"; // (O) 정상 문법
import api from "@/api/axios";
import { createData } from "@/utils/gridUtils";

export function useAgGrid() {
  const gridApi = ref(null);
  const columnApi = ref(null);
  const rowData = ref([]);
  const isLoading = ref(false);
  const insertSliderRef = ref(null);
  const editModalRef = ref(null);
  const searchParams = ref({
    groupCode: "",
    groupCodeName: "",
    useYn: "",
    dateRange: [],
  });
  const sliderTitle = ref("입력 슬라이더");
  const subject = ref("부제목");

  const onGridReady = (params) => {
    gridApi.value = params.api;

    // 공통 유틸 호출
    const dataSource = createData(
      fetchData, // 실제 API를 호출하는 함수
      () => searchParams.value, // 최신 검색 조건을 가져오는 getter
      gridApi, // gridApi ref
    );

    gridApi.value.setGridOption("datasource", dataSource);
  };

  const fetchData = async (params) => {
    isLoading.value = true;
    try {
      const response = await api.post("/code/list", params || {});
      rowData.value = response.data.content;
      return response; // 데이터 조회 성공 시 응답 반환
    } catch (error) {
      console.error("데이터 조회 중 오류 발생:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const updateData = async (params) => {
    try {
      const response = await api.put("/code/update", params);
      return response; // 업데이트 성공 시 응답 반환
    } catch (error) {
      console.error("데이터 업데이트 중 오류 발생:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const insertData = async (params) => {
    try {
      const response = await api.put("/code/insert", params);
      return response;
    } catch (error) {
      console.error("데이터 저장 중 오류 발생:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const deleteData = async (params) => {
    try {
      const response = await api.delete("/code/delete", { data: params });
      return response;
    } catch (error) {
      console.error("데이터 삭제 중 오류 발생:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const onSearch = (params) => {
    searchParams.value = params; // 검색 조건 저장
    if (gridApi.value) {
      gridApi.value.purgeInfiniteCache(); // 서버에 1페이지부터 다시 요청
      // 1. 선택된 체크박스 모두 해제
      gridApi.value.deselectAll();
    }
  };

  const onInsert = () => {
    insertSliderRef.value.openSlider();
  };

  const onCloseSlider = () => {
    insertSliderRef.value.closeSlider();
  };

  const onReset = () => {
    onSearch({ useYn: "" });
  };

  const onDelete = async () => {
    const gridArr = gridApi.value.getSelectedRows();
    if (gridArr.length === 0) {
      alert("삭제할 데이터를 선택해주세요.");
      return;
    }
    const patchData = {
      commonCodeIdList: gridArr.map((row) => row.commonCodeId),
    };
    const result = await deleteData(patchData);
    if (result.data > 0) onSearch(searchParams.value); // 삭제 후 데이터 새로고침
  };

  const onCloseModal = () => {
    console.log("onCloseModal");
  };

  const onHandlerUpdate = async ({ data, compareData }) => {
    const changeFields = Object.keys(data).filter(
      (key) => data[key] !== compareData[key],
    );

    if (changeFields.length === 0) {
      alert("수정된 내용이 없습니다.");
      return;
    }

    const patchData = { commonCodeId: compareData.commonCodeId };
    changeFields.forEach((key) => {
      patchData[key] = data[key];
    });

    const result = await updateData(patchData);
    if (result.data === 1) onSearch(searchParams.value); // 업데이트 후 데이터 새로고침
  };

  const onSaveSlider = async (params) => {
    if (params) {
      const result = await insertData(params);
      if (result.data === 1) onSearch(searchParams.value); // 저장 후 데이터 새로고침
    }
  };

  const onCellClicked = (params) => {
    if (params.column.colId === "commonCode" && editModalRef.value) {
      editModalRef.value.openModal(params.data);
      editModalRef.value.title = "공통코드 수정";
    }
  };

  const rowSelection = ref({
    mode: "multiRow", // 'singleRow' 또는 'multiRow' 중 선택
    checkboxes: true, // 체크박스 표시 여부
    headerCheckbox: false, // ★ 중요: Infinite 모델이므로 false 유지 (에러 방지)
    enableClickSelection: false,
  });

  const columnDefs = ref([
    { field: "groupCode", headerName: "그룹코드" },
    { field: "groupCodeName", headerName: "그룹코드명" },
    {
      field: "commonCode",
      headerName: "공통코드",
      cellStyle: { color: "#007bff", fontWeight: "bold", cursor: "pointer" },
    },
    { field: "commonCodeName", headerName: "공통코드명" },
    { field: "commonCodeOrder", headerName: "공통코드순번" },
    {
      field: "useYn",
      headerName: "사용유무",
      valueFormatter: (params) => {
        return params.value === 1 ? "사용" : "미사용";
      },
    },
    {
      field: "updateUserId",
      headerName: "수정자",
    },
    {
      field: "updateDate",
      headerName: "수정일",
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleString();
      },
    },
  ]);

  // useAgGrid.js 또는 gridOptions 객체에 추가
  const getRowId = (params) => {
    // 데이터의 PK 컬럼명을 반환 (예: commonCodeId)
    return params.data.commonCodeId;
  };

  watch(rowData, (val) => {
    console.log("rowData 업데이트:", val);
  });

  return {
    state: {
      rowData,
      searchParams,
      sliderTitle,
      subject,
      isLoading,
    },
    refs: {
      gridApi,
      columnApi,
      insertSliderRef,
      editModalRef,
    },
    gridOptions: {
      columnDefs,
      rowSelection,
      onGridReady, // 이걸 리턴해야 Vue 파일에서 사용 가능합니다.
      onCellClicked,
      getRowId,
    },
    actions: {
      onSearch,
      onReset,
      onInsert,
      onDelete,
      onSaveSlider,
      onHandlerUpdate,
      onCloseSlider,
      onCloseModal,
    },
  };
}
