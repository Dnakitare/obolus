<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <router-view />
    <ToastContainer />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import ToastContainer from '@/components/ui/ToastContainer.vue';
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue';
import { useAuthStore } from '@/stores/auth.store';
import { onMounted } from 'vue';

const auth = useAuthStore();
onMounted(() => auth.fetchUser());
</script>
