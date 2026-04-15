import { ref } from "vue";
import { ElMessage } from "element-plus";
import api from "@/api/axios"; // API 모듈 경로

export function useUpload() {
  const fileList = ref([]);
  const previewVisible = ref(false);
  const previewImage = ref("");
  const uploadPercentage = ref(0);

  // 1. 파일 업로드 전 체크 (용량, 확장자)
  const beforeUpload = (rawFile) => {
    const isImage = ["image/jpeg", "image/png"].includes(rawFile.type);
    const isLt10M = rawFile.size / 1024 / 1024 < 10;

    if (!isImage) {
      ElMessage.error("JPG 또는 PNG 형식만 업로드 가능합니다.");
      return false;
    }
    if (!isLt10M) {
      ElMessage.error("파일 크기는 10MB를 넘을 수 없습니다.");
      return false;
    }
    return true;
  };

  // 2. 진행률 관리
  const handleProgress = (event) => {
    uploadPercentage.value = Math.round(event.percent);
  };

  // 3. 업로드 성공 시
  const handleSuccess = (response, file) => {
    uploadPercentage.value = 100;
    ElMessage.success(`${file.name} 업로드 완료`);

    // 백엔드에서 내려준 실제 저장 경로를 fileList에 저장 (추후 DB 저장용)
    // 예: file.url = response.data.filePath;
  };

  // 4. 미리보기 처리
  const handlePreview = (file) => {
    previewImage.value = file.url || file.thumbUrl;
    previewVisible.value = true;
  };

  // 5. 삭제 처리
  const handleRemove = (file) => {
    ElMessage.warning(`${file.name} 삭제되었습니다.`);
    // 필요 시 서버에 삭제 API 호출 로직 추가
  };

  const customUpload = async (options) => {
    const { file, onProgress, onSuccess, onError } = options;

    const formData = new FormData();
    formData.append("file", file); // 백엔드 @RequestParam("file") 이름과 맞춰야 함

    try {
      console.log("실제 파일 데이터:", formData.get("file")); // 여기서 File 객체가 나와야 함
      const res = await api.post("/file/upload", formData || {}, {
        onUploadProgress: (event) => {
          // 진행률 계산해서 엘리먼트 플러스에 전달
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress({ percent });
        },
      });
      console.log("업로드 응답:", res.data);
      onSuccess(res.data);
    } catch (err) {
      onError(err);
    }
  };

  return {
    state: {
      fileList,
      previewVisible,
      previewImage,
      uploadPercentage,
    },
    actions: {
      beforeUpload,
      handleProgress,
      handleSuccess,
      handlePreview,
      handleRemove,
      customUpload,
    },
  };
}

export default useUpload;
