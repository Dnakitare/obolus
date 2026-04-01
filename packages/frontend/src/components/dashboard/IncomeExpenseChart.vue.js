import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const props = defineProps();
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
            position: 'top',
            labels: { usePointStyle: true, pointStyle: 'circle', padding: 20, font: { size: 12, weight: 'bold' } },
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
if (__VLS_ctx.data.length) {
    const __VLS_0 = {}.Bar;
    /** @type {[typeof __VLS_components.Bar, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        data: (__VLS_ctx.chartData),
        options: (__VLS_ctx.chartOptions),
    }));
    const __VLS_2 = __VLS_1({
        data: (__VLS_ctx.chartData),
        options: (__VLS_ctx.chartOptions),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_4 = {};
    var __VLS_3;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-center py-12" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-4xl mb-2 opacity-30" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-sm text-gray-400" },
    });
}
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-12']} */ ;
/** @type {__VLS_StyleScopedClasses['text-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-30']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Bar: Bar,
            chartData: chartData,
            chartOptions: chartOptions,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
