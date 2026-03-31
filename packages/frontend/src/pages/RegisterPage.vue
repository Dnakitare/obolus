<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md p-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-primary-600">Obolus</h1>
        <p class="text-gray-500 mt-1">Create your account</p>
      </div>
      <form class="bg-white rounded-xl shadow-sm border p-6 space-y-4" @submit.prevent="handleRegister">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="name">Display Name</label>
          <input id="name" v-model="displayName" type="text" required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="email">Email</label>
          <input id="email" v-model="email" type="email" required autocomplete="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="password">Password</label>
          <input id="password" v-model="password" type="password" required minlength="8" autocomplete="new-password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
          <p class="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
        </div>
        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
        <button type="submit" :disabled="loading"
          class="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium transition-colors">
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>
        <p class="text-center text-sm text-gray-500">
          Already have an account?
          <router-link to="/login" class="text-primary-600 hover:underline">Sign in</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.store';

const auth = useAuthStore();
const displayName = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function handleRegister() {
  error.value = '';
  loading.value = true;
  try {
    await auth.register(email.value, password.value, displayName.value);
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { error?: string } } };
    error.value = axiosErr.response?.data?.error || 'Registration failed';
  } finally {
    loading.value = false;
  }
}
</script>
