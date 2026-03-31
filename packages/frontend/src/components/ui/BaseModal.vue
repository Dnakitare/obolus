<template>
  <div class="fixed inset-0 z-40 flex items-center justify-center bg-black/50" @click.self="$emit('close')">
    <div class="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true">
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold">{{ title }}</h2>
        <button class="p-1 hover:bg-gray-100 rounded" aria-label="Close" @click="$emit('close')">✕</button>
      </div>
      <div class="p-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>();
defineEmits<{ close: [] }>();
</script>
