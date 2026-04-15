<template>
  <teleport to="body">
    <transition name="slide">
      <div v-if="isOpen" class="drawer-overlay" @click.self="$emit('close')">
        <div class="drawer-content">
          <div class="drawer-header">
            <h3>{{ title }}</h3>
            <h3>{{ subject }}</h3>
            <button @click="$emit('close')" class="btn-close">✕</button>
          </div>
          <div class="drawer-body">
            <div class="form-container">
              <div class="form-item">
                <label class="required" for="groupCode">그룹코드명</label>
                <BaseSelect
                  id="groupCode"
                  v-model="formData.groupCode"
                  :ref="(el) => setInputRef(el, 'groupCode')"
                  :class="{ 'error-border': errors.groupCode }"
                  @change="onChange"
                  @update:modelValue="onValue"
                />
                <p v-if="errors.groupCode" class="error-text">
                  {{ errors.groupCode[0] }}
                </p>
              </div>
              <div class="form-item">
                <label class="required" for="commonCode">공통코드</label>
                <input
                  id="commonCode"
                  type="text"
                  :ref="(el) => setInputRef(el, 'commonCode')"
                  v-model="formData.commonCode"
                  :class="{ 'error-border': errors.commonCode }"
                  placeholder="공통코드명을 입력하세요 (예: GENDER)"
                />
                <p v-if="errors.commonCode" class="error-text">
                  {{ errors.commonCode[0] }}
                </p>
              </div>

              <div class="form-item">
                <label class="required" for="commonCodeName">공통코드명</label>
                <input
                  id="commonCodeName"
                  type="text"
                  v-model="formData.commonCodeName"
                  :ref="(el) => setInputRef(el, 'commonCodeName')"
                  :class="{ 'error-border': errors.commonCodeName }"
                  placeholder="공통코드명을 입력하세요 (예: M or F)"
                />
                <p v-if="errors.commonCodeName" class="error-text">
                  {{ errors.commonCodeName[0] }}
                </p>
              </div>
              <div class="form-item">
                <label class="required" for="commonCodeOrder">순번</label>
                <input
                  id="commonCodeOrder"
                  type="number"
                  v-model="formData.commonCodeOrder"
                  :class="{ 'error-border': errors.commonCodeOrder }"
                  :ref="(el) => setInputRef(el, 'commonCodeOrder')"
                />
                <p v-if="errors.commonCodeOrder" class="error-text">
                  {{ errors.commonCodeOrder[0] }}
                </p>
              </div>
              <div class="form-item">
                <label for="useYn" :class="{ 'error-text': errors.useYn }"
                  >사용여부</label
                >
                <div
                  class="radio-group"
                  :class="{ 'error-radio-area': errors.useYn }"
                  :ref="(el) => setInputRef(el, 'useYn')"
                >
                  <label
                    ><input type="radio" v-model="formData.useYn" value="1" />
                    사용</label
                  >
                  <label
                    ><input type="radio" v-model="formData.useYn" value="0" />
                    미사용</label
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="drawer-footer">
            <button class="btn-cancel" @click="$emit('close')">취소</button>
            <button class="btn-save" @click="onSave">저장</button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { z } from "zod";
import BaseSelect from "@/components/common/BaseSelect.vue";
const props = defineProps({
  isOpen: Boolean,
  title: String,
  subject: String,
});
const emit = defineEmits(["close", "save", "insert:time"]);
const isOpen = ref(false);
const formData = ref({
  groupCode: "", // 초기값 세팅
  commonCode: "", // 초기값 세팅
  commonCodeName: "", // 초기값 세팅
  commonCodeOrder: 0, // 숫자는 0 또는 null
  useYn: 1,
});
const errors = ref({});
// 1. DOM 요소들을 담을 객체
const inputRefs = ref({});
// 2. ref를 수집하는 함수
const setInputRef = (el, name) => {
  if (el) inputRefs.value[name] = el;
};

// 검증 스키마 설정
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
  commonCodeOrder: z.number().int().positive("순번은 양의 정수여야 합니다."),
  useYn: z.union([z.string(), z.number()]),
});

const onSave = async () => {
  // 검증 전 이전 에러 초기화
  errors.value = {};
  // 4. 검증 실행 (safeParse는 에러가 발생해도 스크립트가 중단되지 않음)
  const result = schema.safeParse(formData.value);
  if (!result.success) {
    // 5. 검증 실패 시: 에러 객체 가공 (ZodError -> JSON)
    // result.error.format()을 쓰면 필드별 에러를 쉽게 뽑을 수 있습니다.
    errors.value = result.error.flatten().fieldErrors;
    // 3. 첫 번째 에러 필드 찾기
    const firstErrorField = Object.keys(errors.value)[0];
    // 4. Vue의 렌더링 주기가 끝난 후 포커스 (nextTick 사용)
    await nextTick();
    const targetEl = inputRefs.value[firstErrorField];

    if (targetEl) {
      const el = targetEl.$el || targetEl; // BaseSelect는 $el로 접근, 일반 input은 직접 접근
      (el.focus ? el : el.querySelector("input, select"))?.focus(); // BaseSelect 내부의 input에도 포커스 시도
    }
    return;
  }
  emit("save", result.data);
  closeSlider();
};

const openSlider = (newTitle) => {
  isOpen.value = true;
  formData.value = {
    groupCode: "",
    commonCode: "",
    commonCodeName: "",
    commonCodeOrder: 0,
    useYn: 1,
  };
  errors.value = {};
  emit("insert:time", newTitle);
};
const closeSlider = () => {
  isOpen.value = false;
};

const onChange = (val) => {
  console.log("select box val : ", val);
};

const onValue = (value) => {
  console.log("value : ", value);
};

defineExpose({
  openSlider,
  closeSlider,
});
</script>
