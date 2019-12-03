<template>
  <section id="app" class="main-app-container">
    <MainNavBar />
    <div class="main-content-container">
      <div class="flex space-around">
        <h1>Boards</h1>
        <BoardsPreview v-for="board in boards" :key="board._id" :board="board" />
      </div>
      <router-view />
    </div>
  </section>
</template>

<script>
import MainNavBar from "../components/MainNavBar.vue";
import BoardsPreview from "../components/BoardsPreview.vue";
export default {
  data() {
    return {};
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
};
</script>