import type { Directive } from "vue";

export const searchEnter: Directive = {
  mounted(el: HTMLElement, binding) {
    const handler = (event: KeyboardEvent) => {
      if (event.key !== "Enter") return;
      const target = event.target as HTMLElement;
      if (target.closest(".el-data-editor")) return;
      if (target.closest(".el-select")) return;
      if (el.contains(target)) {
        event.preventDefault();
        binding.value();
      }
    };
    el.addEventListener("keydown", handler);
    (el as any).__searchEnterHandler__ = handler;
  },
  unmounted(el: HTMLElement) {
    el.removeEventListener("keydown", (el as any).__searchEnterHandler__);
  },
};
