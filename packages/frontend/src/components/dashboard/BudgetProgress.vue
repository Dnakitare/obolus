<template>
  <div class="space-y-4">
    <div v-for="b in budgets" :key="b.budgetId" class="space-y-1">
      <div class="flex justify-between text-sm">
        <span class="font-medium">{{ b.category.icon }} {{ b.name }}</span>
        <span :class="b.percentUsed >= 100 ? 'text-red-600 font-bold' : b.percentUsed >= 80 ? 'text-yellow-600' : 'text-gray-500'">
          {{ b.percentUsed }}%
        </span>
      </div>
      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-500"
          :class="b.percentUsed >= 100 ? 'bg-red-500' : b.percentUsed >= 80 ? 'bg-yellow-500' : 'bg-green-500'"
          :style="{ width: `${Math.min(b.percentUsed, 100)}%` }"
        />
      </div>
      <p class="text-xs text-gray-400">
        ${{ b.spent.toFixed(2) }} of ${{ b.limit.toFixed(2) }} ({{ b.period }})
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BudgetStatus } from '@/types';
defineProps<{ budgets: BudgetStatus[] }>();
</script>
