<template>
  <div class="max-w-md mx-auto mt-10">
    <h2 class="text-3xl font-bold mb-5 text-center">Login</h2>
    <form @submit.prevent="login">
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Username</label>
        <input v-model="username" type="text" class="w-full p-2 border border-gray-300 rounded"/>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Password</label>
        <input v-model="password" type="password" class="w-full p-2 border border-gray-300 rounded"/>
      </div>
      <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700">Login</button>
    </form>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    login() {
      axios.post('/login', {
        username: this.username,
        password: this.password
      }).then(response => {
        localStorage.setItem('token', response.data.token);
      }).catch(error => {
        console.error(error);
      });
    }
  }
};
</script>

<style scoped>
</style>