<template>
  <aside
    class="flex flex-col transition-all duration-300 bg-gradient-to-b from-primary-950 via-primary-900 to-primary-800 text-white"
    :class="collapsed ? 'w-[72px]' : 'w-64'"
  >
    <!-- Logo -->
    <div class="px-5 py-5 flex items-center gap-3" :class="collapsed ? 'justify-center px-0' : ''">
      <div class="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center flex-shrink-0">
        <span class="text-xl">💸</span>
      </div>
      <div v-if="!collapsed">
        <h1 class="text-lg font-extrabold tracking-tight">Obolus</h1>
        <p class="text-[10px] text-primary-300 -mt-0.5 font-medium">EXPENSE TRACKER</p>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 mt-2 space-y-1">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-primary-200 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
        active-class="!bg-white/15 !text-white shadow-lg shadow-black/10"
      >
        <span class="text-lg flex-shrink-0 group-hover:scale-110 transition-transform" :aria-label="item.label">{{ item.icon }}</span>
        <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="px-5 py-4 border-t border-white/10">
      <p v-if="!collapsed" class="text-[11px] text-primary-400 font-medium">Obolus v2.0</p>
      <p v-else class="text-[10px] text-primary-400 text-center">v2</p>
    </div>
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
