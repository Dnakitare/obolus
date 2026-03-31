<template>
  <Doughnut v-if="data.length" :data="chartData" :options="chartOptions" />
  <p v-else class="text-gray-400 text-center py-8">No expenses yet</p>
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
  }],
}));

const chartOptions = {
  responsive: true,
  plugins: { legend: { position: 'bottom' as const } },
};
</script>
