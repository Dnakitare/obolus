<template>
  <div class="max-w-2xl">
    <h1 class="page-title mb-8">Settings</h1>

    <!-- Profile -->
    <div class="card p-6 mb-6">
      <h2 class="text-base font-bold text-gray-800 mb-4">Profile</h2>
      <form class="space-y-4" @submit.prevent="updateProfile">
        <div>
          <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Display Name</label>
          <input v-model="profile.displayName" type="text" class="input-field" />
        </div>
        <div>
          <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Default Currency</label>
          <select v-model="profile.defaultCurrency" class="input-field">
            <option v-for="c in currencies" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <button type="submit" class="btn-primary">Save Changes</button>
      </form>
    </div>

    <!-- Change Password -->
    <div class="card p-6">
      <h2 class="text-base font-bold text-gray-800 mb-4">Change Password</h2>
      <form class="space-y-4" @submit.prevent="handleChangePassword">
        <div>
          <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Current Password</label>
          <input v-model="passwords.current" type="password" required class="input-field" placeholder="Enter current password" />
        </div>
        <div>
          <label class="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">New Password</label>
          <input v-model="passwords.newPw" type="password" required minlength="8" class="input-field" placeholder="Min. 8 characters" />
        </div>
        <button type="submit" class="btn-primary">Update Password</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useUiStore } from '@/stores/ui.store';

const auth = useAuthStore();
const ui = useUiStore();
const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'KES', 'INR', 'BRL'];

const profile = reactive({ displayName: '', defaultCurrency: 'USD' });
const passwords = reactive({ current: '', newPw: '' });

async function updateProfile() {
  try {
    await auth.updateProfile(profile);
    ui.showSuccess('Profile updated');
  } catch {
    ui.showError('Failed to update profile');
  }
}

async function handleChangePassword() {
  try {
    await auth.changePassword(passwords.current, passwords.newPw);
    ui.showSuccess('Password changed');
    passwords.current = '';
    passwords.newPw = '';
  } catch {
    ui.showError('Failed to change password');
  }
}

onMounted(() => {
  if (auth.user) {
    profile.displayName = auth.user.displayName;
    profile.defaultCurrency = auth.user.defaultCurrency;
  }
});
</script>
