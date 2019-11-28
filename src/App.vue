<template>
  <div id="app">
    <div id="nav">
      <BoardNavBar/>
      aaaaaaaaaa
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/signin">SignIn</router-link> |
      <router-link to="/about">About Us</router-link> -->
    </div>
    <router-view/>
  </div>
</template>


<script>
import BoardNavBar from './components/BoardNavBar.vue'
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
     BoardNavBar
  }
}
</script>

<style lang="scss">

</style>
