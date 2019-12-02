<template>
  <section class="main-nav-bar-container flex align-c space-between" >
    <div class="flex">
      <img class="logo" @click="goToHome" src="@/assets/logo_transparent.png">
    </div>

    <div class="links flex align-c">
      <router-link to="/">Home</router-link>
      <router-link to="/taskfloapp">boards</router-link>
      <router-link to="/about">About Us</router-link>
      <p class="nav-bar-logot" @click="doLogout">Logout</p>
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