<template>
  <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label for="groupCode">그룹코드</label>
          <input
            type="text"
            id="groupCode"
            v-model="editItem.groupCode"
            readonly
            class="readonly-input"
          />
        </div>
        <div class="form-group">
          <label for="groupCodeName">그룹코드명</label>
          <input
            type="text"
            id="groupCodeName"
            v-model="editItem.groupCodeName"
            readonly
            class="readonly-input"
          />
        </div>
        <div class="form-group">
          <label for="commonCode">공통코드</label>
          <input
            type="text"
            id="commonCode"
            v-model="editItem.commonCode"
            :ref="(el) => setInputRef(el, 'commonCode')"
            :class="{ 'error-border': errors.commonCode }"
          />
          <p v-if="errors.commonCode" class="error-text">
            {{ errors.commonCode[0] }}
          </p>
        </div>
        <div class="form-group">
          <label for="commonCodeName">공통코드명</label>
          <input
            type="text"
            id="commonCodeName"
            v-model="editItem.commonCodeName"
            :ref="(el) => setInputRef(el, 'commonCodeName')"
            :class="{ 'error-border': errors.commonCodeName }"
          />
          <p v-if="errors.commonCodeName" class="error-text">
            {{ errors.commonCodeName[0] }}
          </p>
        </div>
        <div class="form-group">
          <label for="commonCodeOrder">정렬순번</label>
          <input
            type="number"
            id="commonCodeOrder"
            v-model="editItem.commonCodeOrder"
            :ref="(el) => setInputRef(el, 'commonCodeOrder')"
            :class="{ 'error-border': errors.commonCodeOrder }"
          />
          <p v-if="errors.commonCodeOrder" class="error-text">
            {{ errors.commonCodeOrder[0] }}
          </p>
        </div>
        <div class="form-group">
          <label for="useYn">사용여부</label>
          <select id="useYn" v-model="editItem.useYn">
            <option value="1">사용</option>
            <option value="0">미사용</option>
          </select>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="closeModal">취소</button>
        <button class="btn-save" @click="handleUpdate">저장하기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineExpose, nextTick } from "vue";
import { z } from "zod";
const props = defineProps({
  title: String,
});
const emit = defineEmits(["handleUpdate", "save", "closeModal"]);
const isModalOpen = ref(false);
const errors = ref({});
const inputRefs = ref({});
const setInputRef = (el, name) => {
  if (el) inputRefs.value[name] = el;
};
const schema = z.object({
  groupCode: z.string().nonempty("그룹코드를 선택해주세요."),
  commonCode: z
    .string()
    .nonempty("공통코드를 입력해주세요.")
    .max(20, "공통코드 최대 20자입니다.")
    .regex(/^[a-zA-Z]+$/, "영문자만 입력 가능합니다."),
  commonCodeName: z
    .string()
    .nonempty("공통코드명을 입력해주세요.")
    .max(100, "공통코드명 최대 50자입니다."),
  commonCodeOrder: z.coerce
    .number({
      invalid_type_error: "순번은 숫자여야 합니다.",
      required_error: "순번을 입력해주세요.",
    })
    .int()
    .min(1, "순번은 양의 정수여야 합니다."),
  useYn: z.coerce.number(),
});

const editItem = ref({
  groupCode: "",
  groupCodeNm: "",
  commonCode: "",
  commonCodeNm: "",
  commonCodeOrder: 0,
  useYn: 1,
});

const compareItem = ref({});

const closeModal = () => {
  errors.value = {};
  isModalOpen.value = false;
  emit("closeModal"); // 부모에게 알림 (필요 시)
};
const openModal = (rowData) => {
  if (rowData) {
    editItem.value = {
      ...rowData,
      commonCodeOrder: rowData.commonCodeOrder ?? rowData.commonCodeOrder ?? 0, // null인 경우 0으로 초기화
    }; // 넘겨 받은 데이터 복사
    compareItem.value = { ...rowData }; // 비교 데이터 복사
  }
  isModalOpen.value = true;
};
const handleUpdate = async () => {
  errors.value = {};
  const result = schema.safeParse(editItem.value);
  if (!result.success) {
    errors.value = result.error.flatten().fieldErrors;
    const firstErrorField = Object.keys(errors.value)[0];
    await nextTick();
    const targetEl = inputRefs.value[firstErrorField];
    if (targetEl) {
      const el = targetEl.$el || targetEl; // BaseSelect는 $el로 접근, 일반 input은 직접 접근
      (el.focus ? el : el.querySelector("input, select"))?.focus(); // BaseSelect 내부의 input에도 포커스 시도
    }
    return;
  }
  // 로직 수행
  emit("save", {
    data: editItem.value,
    compareData: compareItem.value,
  }); // 부모에게 알림 (필요 시)
  closeModal();
};
defineExpose({
  openModal,
  closeModal,
});
</script>
