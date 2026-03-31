<template>
  <div class="fixed inset-0 z-40 flex items-center justify-center bg-primary-950/40 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto animate-modal-in" role="dialog" aria-modal="true">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 class="text-lg font-bold text-gray-800">{{ title }}</h2>
        <button class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Close" @click="$emit('close')">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div class="p-6">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>();
defineEmits<{ close: [] }>();
</script>

<style scoped>
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-modal-in { animation: modal-in 0.2s ease-out; }
</style>
