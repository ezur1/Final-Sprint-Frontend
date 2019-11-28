<template>
  <div id="app">
    <div id="nav">
      <!-- <router-link to="/board/">MyBoards</router-link> -->
      <section class="board">
          <BoardsPreview v-for="board in boards" :key=board._id :board="board"/>
          <!-- <board v-for="board in boards" :key=board._id :board="board" :topics="board.topics"> </board> -->
      </section>
    </div>
    <router-view/>
  </div>
</template>

<script>
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
     BoardsPreview
  }
}
</script>
