<template>
  <section id="app">
    <MainNavBar />
    <BoardsPreview v-for="board in boards" :key=board._id :board="board"/>
    <router-view/>
  </section>
</template>

<script>
import MainNavBar from "../components/MainNavBar.vue";  
import BoardsPreview from '../components/BoardsPreview.vue';
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
    MainNavBar,
    BoardsPreview
  }
}
</script>