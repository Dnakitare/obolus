import { useUiStore } from '@/stores/ui.store';
export function useToast() {
    const ui = useUiStore();
    return {
        success: ui.showSuccess,
        error: ui.showError,
        warning: ui.showWarning,
    };
}
