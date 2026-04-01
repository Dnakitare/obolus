<template>
  <header class="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
    <div class="flex items-center gap-2">
      <!-- Mobile menu button -->
      <button
        class="p-2 rounded-xl hover:bg-gray-100 transition-colors lg:hidden"
        aria-label="Open menu"
        @click="ui.toggleMobileMenu()"
      >
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <!-- Desktop collapse button -->
      <button
        class="p-2 rounded-xl hover:bg-gray-100 transition-colors hidden lg:block"
        aria-label="Toggle sidebar"
        @click="ui.toggleSidebar()"
      >
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
    <div class="flex items-center gap-2 sm:gap-3">
      <div class="flex items-center gap-2 sm:gap-2.5 bg-gray-50 rounded-full pl-1 pr-2 sm:pr-3 py-1">
        <div class="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">
          {{ initials }}
        </div>
        <span class="text-sm font-medium text-gray-700 hidden sm:inline">{{ auth.user?.displayName }}</span>
      </div>
      <button
        class="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 sm:px-2.5 py-1.5 rounded-lg hover:bg-red-50 font-medium"
        @click="auth.logout()"
      >
        <span class="hidden sm:inline">Sign out</span>
        <svg class="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useUiStore } from '@/stores/ui.store';

const auth = useAuthStore();
const ui = useUiStore();

const initials = computed(() => {
  const name = auth.user?.displayName || '';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
});
</script>
