<template>
    <section class="side-menu">
      <h2 class="side-menu-header">{{user.fullName}}</h2>
      <img :src="user.imgUrl" />  
      Activity
      <button @click="gotoUserProfile(user._id)">Profile</button>
      <button @click="doLogout">Logout</button>
    </section>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    gotoUserProfile(userId){
      console.log('this is the requested userId: ',userId);
    },
    doLogout() {
      this.$store.dispatch({ type: "logout" });
    }
  },
  computed: {
    user(){
      return this.$store.getters.loggedInUser
    },
  },
  created() {}
};
</script>

