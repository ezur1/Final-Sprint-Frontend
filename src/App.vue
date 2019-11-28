<template>
  <div id="app">
    <div id="nav">
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/signin">SignIn</router-link> |
      <router-link to="/about">About Us</router-link> -->
      <section class="board">
          <board v-for="board in boards" :key=board._id :board="board" :topics="board.topics"> </board>
      </section>
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
  components: {}
}
</script>

<style lang="scss">

</style>
