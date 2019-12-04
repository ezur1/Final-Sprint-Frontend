<template>
  <section class="main-nav-bar-container flex align-c space-between" >
    <div class="flex">
      <img class="logo" @click="goToHome" src="@/assets/logo_transparent.png">
    </div>

    <div class="links flex align-c">
      <router-link to="/">Home</router-link>
      <router-link to="/taskfloapp">boards</router-link>
      <router-link to="/about">About Us</router-link>
      <!-- <p class="nav-bar-logot" @click="doLogout">Logout</p> -->
      <p class="open-menu-btn" @click="toggleUserMenu">USER-MENU</p>
    </div>
    <transition name="slide-fade" >
      <UserMenu v-if="isOpenUserMenu"/>
    </transition>
  </section>
</template>

<script>
import UserMenu from '../components/UserMenu.vue';
export default {
  data() {
    return {
      isOpenUserMenu: false,
    };
  },
  methods: {
    toggleUserMenu() {
      this.isOpenUserMenu = !this.isOpenUserMenu;
    },
    goToHome() {
      this.$router.push(`/`);
    },
    doLogout() {
      this.$store.dispatch({ type: "logout" });
    }
  },
  created() {},
    components: {
    UserMenu
  }
};
</script>