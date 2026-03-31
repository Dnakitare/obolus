<template>
  <Doughnut v-if="data.length" :data="chartData" :options="chartOptions" />
  <div v-else class="text-center py-12">
    <div class="text-4xl mb-2 opacity-30">🍩</div>
    <p class="text-sm text-gray-400">No expenses yet</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { CategoryBreakdown as CBType } from '@/types';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<{ data: CBType[] }>();

const chartData = computed(() => ({
  labels: props.data.map(d => `${d.icon} ${d.categoryName}`),
  datasets: [{
    data: props.data.map(d => d.total),
    backgroundColor: props.data.map(d => d.color),
    borderWidth: 0,
    hoverOffset: 8,
  }],
}));

const chartOptions = {
  responsive: true,
  cutout: '65%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 12 } },
    },
    tooltip: {
      backgroundColor: '#1e1b4b',
      cornerRadius: 8,
      padding: 12,
    },
  },
};
</script>
