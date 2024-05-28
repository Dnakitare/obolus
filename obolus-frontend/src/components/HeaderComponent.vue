<template>
  <header class="bg-blue-500 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex items-center">
        <img src="/images/obolus-logo.png" alt="Logo" class="w-16">
      </div>
      <nav>
        <router-link to="/login" @click.native="logout">Logout</router-link>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem('token');
    }
  }
};
</script>

<style scoped>
</style>