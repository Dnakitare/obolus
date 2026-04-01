import ToastContainer from '@/components/ui/ToastContainer.vue';
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue';
import { useAuthStore } from '@/stores/auth.store';
import { onMounted } from 'vue';
const auth = useAuthStore();
onMounted(() => auth.fetchUser());
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    id: "app",
    ...{ class: "min-h-screen bg-gray-50" },
});
const __VLS_0 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {[typeof ToastContainer, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(ToastContainer, new ToastContainer({}));
const __VLS_5 = __VLS_4({}, ...__VLS_functionalComponentArgsRest(__VLS_4));
/** @type {[typeof ConfirmDialog, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(ConfirmDialog, new ConfirmDialog({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ToastContainer: ToastContainer,
            ConfirmDialog: ConfirmDialog,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
