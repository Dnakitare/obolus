<template>
  <Bar v-if="data.length" :data="chartData" :options="chartOptions" />
  <div v-else class="text-center py-12">
    <div class="text-4xl mb-2 opacity-30">📊</div>
    <p class="text-sm text-gray-400">No data yet</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import type { TrendData } from '@/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps<{ data: TrendData[] }>();

const chartData = computed(() => ({
  labels: props.data.map(d => d.month),
  datasets: [
    {
      label: 'Income',
      data: props.data.map(d => d.income),
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
      borderRadius: 6,
      borderSkipped: false,
    },
    {
      label: 'Expenses',
      data: props.data.map(d => d.expenses),
      backgroundColor: 'rgba(244, 63, 94, 0.8)',
      borderRadius: 6,
      borderSkipped: false,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { usePointStyle: true, pointStyle: 'circle', padding: 20, font: { size: 12, weight: '600' as const } },
    },
    tooltip: {
      backgroundColor: '#1e1b4b',
      titleFont: { size: 13 },
      bodyFont: { size: 12 },
      cornerRadius: 8,
      padding: 12,
    },
  },
  scales: {
    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } } },
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
  },
};
</script>
