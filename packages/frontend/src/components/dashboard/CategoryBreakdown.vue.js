import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
const props = defineProps();
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
            position: 'bottom',
            labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 12 } },
        },
        tooltip: {
            backgroundColor: '#1e1b4b',
            cornerRadius: 8,
            padding: 12,
        },
    },
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
if (__VLS_ctx.data.length) {
    const __VLS_0 = {}.Doughnut;
    /** @type {[typeof __VLS_components.Doughnut, ]} */ ;
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
            Doughnut: Doughnut,
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
