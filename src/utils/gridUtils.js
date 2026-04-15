// src/utils/gridUtils.js (예시 경로)
export const createData = (
  fetchFn,
  searchParamsGetter,
  gridApi,
) => {
  return {
    getRows: async (params) => {
      try {
        const size = gridApi.value.paginationGetPageSize();
        const page = Math.floor(params.startRow / size) + 1;

        // 정렬 정보
        const sortModel = params.sortModel[0];
        const sortColumn = sortModel ? sortModel.colId : "CREATE_DATE";
        const sortOrder = sortModel ? sortModel.sort.toUpperCase() : "DESC";

        // 서버 규격(PageEntity)에 맞춘 파라미터 조립
        const requestData = {
          ...searchParamsGetter(), // 현재 시점의 검색 조건
          page,
          size,
          sortColumn,
          sortOrder,
        };
        const response = await fetchFn(requestData);
        const { content, totalCount } = response.data;
        params.successCallback(content || [], totalCount || 0);
      } catch (error) {
        console.error("Grid DataSource Error:", error);
        params.failCallback();
      }
    },
  };
};
