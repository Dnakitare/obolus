<template>
  <div v-if="totalPages > 1" class="flex items-center justify-between mt-4">
    <span class="text-sm text-gray-500">Page {{ page }} of {{ totalPages }} ({{ total }} items)</span>
    <div class="flex gap-2">
      <button
        class="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50"
        :disabled="page <= 1"
        @click="$emit('update:page', page - 1)"
      >
        Previous
      </button>
      <button
        class="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50"
        :disabled="page >= totalPages"
        @click="$emit('update:page', page + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ page: number; totalPages: number; total: number }>();
defineEmits<{ 'update:page': [page: number] }>();
</script>
