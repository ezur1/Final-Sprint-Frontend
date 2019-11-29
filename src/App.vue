<template>
  <div id="app">
    <div id="nav">
      <!-- <BoardNavBar/> -->
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/signin">SignIn</router-link> |
      <router-link to="/about">About Us</router-link> -->
    </div>
    <router-view/>
  </div>
</template>


<script>
export default {
  data(){
    return{}
  },
  computed: {
    boards() {
      return this.$store.getters.boardsToShow;
    }
  },
  created() {
  this.$store.dispatch("loadBoards");
  },
  components: {
  }
}
</script>

<style lang="scss">

</style>
