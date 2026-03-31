<template>
  <div v-if="ui.confirmDialog.show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="ui.resolveConfirm(false)">
    <div class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4" role="alertdialog" aria-modal="true">
      <p class="text-gray-800 mb-6">{{ ui.confirmDialog.message }}</p>
      <div class="flex justify-end gap-3">
        <button class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg" @click="ui.resolveConfirm(false)">
          Cancel
        </button>
        <button class="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg" @click="ui.resolveConfirm(true)">
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui.store';
const ui = useUiStore();
</script>
