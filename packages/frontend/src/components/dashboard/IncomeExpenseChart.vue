<template>
  <Bar v-if="data.length" :data="chartData" :options="chartOptions" />
  <p v-else class="text-gray-400 text-center py-8">No data yet</p>
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
    { label: 'Income', data: props.data.map(d => d.income), backgroundColor: '#10B981' },
    { label: 'Expenses', data: props.data.map(d => d.expenses), backgroundColor: '#EF4444' },
  ],
}));

const chartOptions = {
  responsive: true,
  plugins: { legend: { position: 'top' as const } },
  scales: { y: { beginAtZero: true } },
};
</script>
