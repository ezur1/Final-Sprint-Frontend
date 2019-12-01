<template>
  <div id="app">
    <div id="nav">

    <MainNavBar />
      
      <section class="board flex wrap">
          <BoardsPreview v-for="board in boards" :key=board._id :board="board"/>
          <!-- <board v-for="board in boards" :key=board._id :board="board" :topics="board.topics"> </board> -->
      </section>
    </div>
    <router-view/>
  </div>
</template>

<script>
import BoardsPreview from '../components/BoardsPreview.vue';
import MainNavBar from "../components/MainNavBar.vue";

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
     BoardsPreview,
     MainNavBar
  }
}
</script>
