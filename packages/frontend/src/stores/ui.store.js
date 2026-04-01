import { defineStore } from 'pinia';
import { ref } from 'vue';
let toastId = 0;
export const useUiStore = defineStore('ui', () => {
    const toasts = ref([]);
    const sidebarCollapsed = ref(false);
    const mobileMenuOpen = ref(false);
    const confirmDialog = ref({ show: false, message: '' });
    function addToast(type, message, duration = 4000) {
        const id = ++toastId;
        toasts.value.push({ id, type, message });
        setTimeout(() => {
            toasts.value = toasts.value.filter(t => t.id !== id);
        }, duration);
    }
    function showSuccess(message) { addToast('success', message); }
    function showError(message) { addToast('error', message, 6000); }
    function showWarning(message) { addToast('warning', message, 5000); }
    function confirm(message) {
        return new Promise((resolve) => {
            confirmDialog.value = { show: true, message, resolve };
        });
    }
    function resolveConfirm(result) {
        confirmDialog.value.resolve?.(result);
        confirmDialog.value = { show: false, message: '' };
    }
    function toggleSidebar() {
        sidebarCollapsed.value = !sidebarCollapsed.value;
    }
    function toggleMobileMenu() {
        mobileMenuOpen.value = !mobileMenuOpen.value;
    }
    function closeMobileMenu() {
        mobileMenuOpen.value = false;
    }
    return {
        toasts, sidebarCollapsed, mobileMenuOpen, confirmDialog,
        showSuccess, showError, showWarning, confirm, resolveConfirm,
        toggleSidebar, toggleMobileMenu, closeMobileMenu,
    };
});
