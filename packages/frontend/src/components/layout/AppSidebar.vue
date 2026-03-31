<template>
  <aside
    class="bg-white border-r border-gray-200 flex flex-col transition-all duration-200"
    :class="collapsed ? 'w-16' : 'w-64'"
  >
    <div class="p-4 border-b border-gray-200">
      <h1 v-if="!collapsed" class="text-xl font-bold text-primary-600">Obolus</h1>
      <span v-else class="text-xl font-bold text-primary-600 block text-center">O</span>
    </div>
    <nav class="flex-1 p-2 space-y-1">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-colors"
        active-class="bg-primary-50 text-primary-700 font-medium"
      >
        <span class="text-lg" :aria-label="item.label">{{ item.icon }}</span>
        <span v-if="!collapsed">{{ item.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui.store';
import { computed } from 'vue';

const ui = useUiStore();
const collapsed = computed(() => ui.sidebarCollapsed);

const navItems = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/transactions', icon: '💳', label: 'Transactions' },
  { path: '/budgets', icon: '🎯', label: 'Budgets' },
  { path: '/recurring', icon: '🔄', label: 'Recurring' },
  { path: '/reports', icon: '📋', label: 'Reports' },
  { path: '/settings', icon: '⚙️', label: 'Settings' },
];
</script>
