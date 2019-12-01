<template>
  <section class="main-nav-bar-container flex align-c space-between" >
    <div class="flex">
      <h1 @click="goToHome" class="nav-bar-logo">TaskFlow</h1>
    </div>
    
    <div class="links">
      <router-link to="/">Home</router-link>
      <router-link to="/taskfloapp">boards</router-link>
      <router-link to="/about">About Us</router-link>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    goToHome(){
      this.$router.push(`/`);
    }
  },
  created() { }
};
</script>