<template>
  <section class="main-nav-bar-container flex align-c space-between" >
    <div class="flex">
      <h1 @click="goToHome" class="nav-bar-logo">TaskFlow</h1>
    </div>

    <div class="links flex">
      <router-link to="/">Home</router-link>
      <router-link to="/taskfloapp">boards</router-link>
      <router-link to="/about">About Us</router-link>
      <p class="nav-bar-logo" @click="doLogout">Logout</p>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    goToHome() {
      this.$router.push(`/`);
    },
    doLogout() {
      this.$store.dispatch({ type: "logout" });
    }
  },
  created() {}
};
</script>