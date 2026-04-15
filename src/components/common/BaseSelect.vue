<template>
  <select :value="modelValue" @change="handleChange" class="custom-select">
    <option value="">선택하세요</option>
    <option
      v-for="item in groupList"
      :key="item.groupCode"
      :value="item.groupCode"
    >
      {{ item.groupCodeName }}
    </option>
  </select>
</template>

<script setup>
import { onMounted } from "vue";
import { useDd } from "@/composables/common/common.js"; // 아까 만든 composable

const props = defineProps(["modelValue", "groupCode"]); // groupCode를 받음
const emit = defineEmits(["update:modelValue", "change"]);
const { groupList, fetchGroupCodes } = useDd();

const handleChange = (e) => {
  const selectedValue = e.target.value;
  emit("update:modelValue", selectedValue);
  emit("change", selectedValue);
};

onMounted(async () => {
  // 넘겨받은 groupCode(예: GROUP_CODE)를 인자로 API 호출
  await fetchGroupCodes(props.groupCode, "/group/list");
});
</script>
