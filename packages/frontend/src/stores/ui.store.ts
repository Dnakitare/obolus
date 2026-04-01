import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Toast } from '@/types';

let toastId = 0;

export const useUiStore = defineStore('ui', () => {
  const toasts = ref<Toast[]>([]);
  const sidebarCollapsed = ref(false);
  const mobileMenuOpen = ref(false);
  const confirmDialog = ref<{
    show: boolean;
    message: string;
    resolve?: (value: boolean) => void;
  }>({ show: false, message: '' });

  function addToast(type: Toast['type'], message: string, duration = 4000) {
    const id = ++toastId;
    toasts.value.push({ id, type, message });
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id);
    }, duration);
  }

  function showSuccess(message: string) { addToast('success', message); }
  function showError(message: string) { addToast('error', message, 6000); }
  function showWarning(message: string) { addToast('warning', message, 5000); }

  function confirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      confirmDialog.value = { show: true, message, resolve };
    });
  }

  function resolveConfirm(result: boolean) {
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
