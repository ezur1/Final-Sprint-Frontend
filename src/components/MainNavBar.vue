<template>
  <section class="main-nav-bar-container flex align-c space-between" >
    <div class="flex">
      <img class="logo" @click="goToHome" src="@/assets/only_logo_transparent.png">
    </div>

    <div class="links flex align-c">
      <router-link class="home-link" to="/">Home</router-link>
      <router-link class="boards-link" to="/taskfloapp">Boards</router-link>
      <router-link class="about-link" to="/about">About Us</router-link>
      <div v-if="user.fullName" class="avatar" @click="toggleUserMenu"><Avatar :size="32" :username="user.fullName"></Avatar></div>
    </div>
    <transition name="slide-fade" >
      <UserMenu v-if="isOpenUserMenu"/>
    </transition>
  </section>
</template>

<script>
import Avatar from 'vue-avatar'
import UserMenu from '../components/UserMenu.vue';
export default {
  data() {
    return {
      isOpenUserMenu: false,
    };
  },
  computed: {
    user(){
      return this.$store.getters.loggedInUser
    }
  },
  methods: {
    toggleUserMenu() {
      this.isOpenUserMenu = !this.isOpenUserMenu;
    },
    goToHome() {
      this.$router.push(`/`);
    },
    // async doLogout() {
    //   await this.$store.dispatch({ type: "logout" });
    // }
  },
    created() {},
    components: {
    UserMenu,
    Avatar
  }
};
</script>