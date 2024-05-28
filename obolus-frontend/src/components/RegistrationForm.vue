<template>
  <div class="max-w-md mx-auto pt-10">
    <h2 class="text-3xl font-bold mb-5 text-center">Register</h2>
    <form @submit.prevent="register">
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Username</label>
        <input v-model="username" type="text" class="w-full p-2 border border-gray-300 rounded"/>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-bold mb-2">Password</label>
        <input v-model="password" type="password" class="w-full p-2 border border-gray-300 rounded"/>
      </div>
      <div class="flex justify-center mb-2">
        <a href="/login" class="text-blue-500 hover:text-blue-700">Already have and account?</a>
      </div>
      <div class="flex justify-center">
        <button type="submit" class="bg-blue-500 text-white hover:bg-blue-700 py-2 px-4 font-bold rounded-full">Register</button>
      </div>
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
    register() {
      axios.post('/register', {
        username: this.username,
        password: this.password
      }).then(response => {
        console.log(response.data);
        // Redirect to the login page
        this.$router.push('/login');
      }).catch(error => {
        console.error(error);
      });
    }
  }
};
</script>

<style scoped>
</style>