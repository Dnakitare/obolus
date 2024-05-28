<template>
  <header class="bg-blue-500 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-2xl font-bold">Obolus</h1>
      <nav>
        <router-link to="/dashboard" class="mr-4">Dashboard</router-link>
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