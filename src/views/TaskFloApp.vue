<template>
  <section id="app" class="main-app-container">
    <MainNavBar />
    <div class="main-content-container">
      <div class="flex space-around">
        <h1>Boards</h1>
        <BoardsPreview v-for="board in boards" :key="board._id" :board="board" @removeBoard="removeBoard" />
    </div>
      <router-view />
    </div>
    <section class="add-board">
        <div>
          <h2><p v-if="isAddBoard" @click="openNewBoardModal"><span>+ </span>Add Board</p></h2>
        </div>
        <div v-if="!isAddBoard" class="add-board-title flex align-c">
          <input ref="input" type="text" placeholder="Board title" v-model="newBoard.title" @keyup.enter="addBoard" @blur="exit" />
          <font-awesome-icon class="exit-btn" @click="exit" icon="times" size="2x" />
        </div>
    </section>
  </section>
</template>

<script>
import MainNavBar from "../components/MainNavBar.vue";
import BoardsPreview from "../components/BoardsPreview.vue";
export default {
  data() {
    return {
      isAddBoard: true,
      newBoard: {
        title: "",
        activityLog: [],
        usersOnBoard: [],
        topics: []
      },
    };
  },
  computed: {
    boards() {
      return this.$store.getters.boardsToShow;
    }
  },
  methods:{
    openNewBoardModal() {
      this.isAddBoard = !this.isAddBoard;
      this.newBoard.title = "";
      setTimeout(()=>{
        this.$refs.input.focus();
      },10) 
    },
    addBoard (){
      if (!this.newBoard.title) return;
      this.newBoard.createdBy = this.$store.getters.loggedInUser;
      this.newBoard.createdOn = Date.now();
      this.$store.dispatch({ type: "addBoard", newBoard: this.newBoard });
      this.isAddBoard = true;
    },
    removeBoard(boardId) {
      this.$store.dispatch({ type: "removeBoard", boardId });
    },
    exit() {
      this.isAddBoard=true;
    },
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