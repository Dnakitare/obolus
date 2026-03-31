<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md p-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-primary-600">Obolus</h1>
        <p class="text-gray-500 mt-1">Freelancer Expense Tracker</p>
      </div>
      <form class="bg-white rounded-xl shadow-sm border p-6 space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="email">Email</label>
          <input id="email" v-model="email" type="email" required autocomplete="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="password">Password</label>
          <input id="password" v-model="password" type="password" required autocomplete="current-password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
        </div>
        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
        <button type="submit" :disabled="loading"
          class="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium transition-colors">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
        <p class="text-center text-sm text-gray-500">
          Don't have an account?
          <router-link to="/register" class="text-primary-600 hover:underline">Register</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.store';

const auth = useAuthStore();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function handleLogin() {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(email.value, password.value);
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { error?: string } } };
    error.value = axiosErr.response?.data?.error || 'Login failed';
  } finally {
    loading.value = false;
  }
}
</script>
