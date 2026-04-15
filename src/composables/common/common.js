// composables/ddd.js
import { ref } from 'vue';
import api from '@/api/axios';

export function useDd() {
  const groupList = ref([]);
  const isLoading = ref(false);

  // 1. 슬라이더용 그룹코드 목록 조회
  const fetchGroupCodes = async (params, url) => {
    try {
      const response = await api.post(url, params || {});
      groupList.value = response.data.content;
    } catch (error) {
      console.error("조회 실패:", error);
    }
  };

  return {
    groupList,
    isLoading,
    fetchGroupCodes
  };
}