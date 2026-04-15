<template>
  <el-card shadow="never" header="파일 업로드 & 미리보기">
    <div class="upload-container">
      <el-upload
        class="upload-demo"
        drag
        v-model:file-list="state.fileList.value"
        action="#"
        :http-request="actions.customUpload"
        multiple
        :before-upload="actions.beforeUpload"
        :on-progress="actions.handleProgress"
        :on-success="actions.handleSuccess"
        :on-preview="actions.handlePreview"
        :on-remove="actions.handleRemove"
        list-type="picture"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          파일을 드래그하거나 <em>클릭하여 업로드</em>
        </div>
      </el-upload>

      <div v-if="state.uploadPercentage.value > 0 && state.uploadPercentage.value < 100" class="progress-wrapper">
        <el-progress :percentage="state.uploadPercentage.value" />
      </div>

      <el-dialog v-model="state.previewVisible.value" title="이미지 미리보기">
        <img :src="state.previewImage.value" class="preview-img" alt="Preview" />
      </el-dialog>
    </div>
  </el-card>
</template>

<script setup>
import { UploadFilled } from '@element-plus/icons-vue';
import useUpload from '@/composables/file/file';

// Composable에서 상태와 액션을 분리해서 가져옴
const { state, actions } = useUpload();
</script>