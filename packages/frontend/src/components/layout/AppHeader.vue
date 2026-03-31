<template>
  <header class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
    <button
      class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="Toggle sidebar"
      @click="ui.toggleSidebar()"
    >
      <span class="text-lg">☰</span>
    </button>
    <div class="flex items-center gap-4">
      <span class="text-sm text-gray-600">{{ auth.user?.displayName }}</span>
      <button
        class="text-sm text-gray-500 hover:text-red-600 transition-colors"
        @click="auth.logout()"
      >
        Logout
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import { useUiStore } from '@/stores/ui.store';

const auth = useAuthStore();
const ui = useUiStore();
</script>
