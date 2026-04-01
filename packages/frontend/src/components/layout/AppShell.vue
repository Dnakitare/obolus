<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Desktop sidebar -->
    <div class="hidden lg:block">
      <AppSidebar />
    </div>

    <!-- Mobile sidebar overlay -->
    <div
      v-if="ui.mobileMenuOpen"
      class="fixed inset-0 z-40 lg:hidden"
    >
      <div class="absolute inset-0 bg-black/50" @click="ui.closeMobileMenu()" />
      <div class="relative z-50 w-64 h-full animate-slide-in-left">
        <AppSidebar :mobile="true" />
      </div>
    </div>

    <div class="flex flex-col flex-1 overflow-hidden">
      <AppHeader />
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100/50">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from './AppSidebar.vue';
import AppHeader from './AppHeader.vue';
import { useUiStore } from '@/stores/ui.store';

const ui = useUiStore();
</script>

<style scoped>
@keyframes slide-in-left {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
.animate-slide-in-left { animation: slide-in-left 0.2s ease-out; }
</style>
