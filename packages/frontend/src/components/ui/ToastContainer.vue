<template>
  <div class="fixed top-4 right-4 z-50 space-y-2" aria-live="polite">
    <div
      v-for="toast in ui.toasts"
      :key="toast.id"
      class="px-4 py-3 rounded-lg shadow-lg text-white text-sm max-w-sm animate-slide-in"
      :class="{
        'bg-green-500': toast.type === 'success',
        'bg-red-500': toast.type === 'error',
        'bg-yellow-500': toast.type === 'warning',
        'bg-blue-500': toast.type === 'info',
      }"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui.store';
const ui = useUiStore();
</script>

<style scoped>
@keyframes slide-in {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
.animate-slide-in { animation: slide-in 0.3s ease-out; }
</style>
