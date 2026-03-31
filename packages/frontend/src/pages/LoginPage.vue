<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 relative overflow-hidden">
    <!-- Background pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-20 left-20 w-72 h-72 bg-primary-400 rounded-full blur-3xl" />
      <div class="absolute bottom-20 right-20 w-96 h-96 bg-violet-400 rounded-full blur-3xl" />
    </div>

    <div class="w-full max-w-md p-8 relative z-10">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur rounded-2xl mb-4 shadow-lg">
          <span class="text-3xl">💸</span>
        </div>
        <h1 class="text-4xl font-extrabold text-white">Obolus</h1>
        <p class="text-primary-300 mt-1 font-medium">Freelancer Expense Tracker</p>
      </div>
      <form class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-5" @submit.prevent="handleLogin">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5" for="email">Email</label>
          <input id="email" v-model="email" type="email" required autocomplete="email" placeholder="you@example.com"
            class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1.5" for="password">Password</label>
          <input id="password" v-model="password" type="password" required autocomplete="current-password" placeholder="Enter your password"
            class="input-field" />
        </div>
        <p v-if="error" class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl font-medium">{{ error }}</p>
        <button type="submit" :disabled="loading" class="btn-primary w-full justify-center py-3">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
        <p class="text-center text-sm text-gray-500">
          Don't have an account?
          <router-link to="/register" class="text-primary-600 hover:underline font-semibold">Register</router-link>
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
