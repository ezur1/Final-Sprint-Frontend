<template>
  <div id="app" class="app">
    <div id="nav">
    </div>
    <router-view />
  </div>
</template>


<script>
export default {
  data(){
    return{}
  },
  computed: {
    boards() {
      return this.$store.getters.boards;
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
