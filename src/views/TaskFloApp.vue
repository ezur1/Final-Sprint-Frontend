<template>
  <section id="app" class="main-app-container">
    <MainNavBar />
    <div class="main-content-container ">
      <div class="flex justify-center wrap">
        <div class="add-board-container">
          <div class="add-board-btn flex align-c justify-center" @click="openNewBoardModal"><font-awesome-icon icon="plus" size="2x" /></div>   
          <h1 v-if="isAddBoard">Add Board</h1>
          <input v-if="!isAddBoard" ref="input" type="text" placeholder="Add Board title" v-model="newBoard.title" @keyup.enter="addBoard" @blur="exit" />
        </div>
        <BoardsPreview v-for="board in boards" 
        :key="board._id" 
        :board="board" 
        :users="users" 
        @removeBoard="removeBoard"
        @updateBoardMembers="updateBoardMembers" />
    </div>
      <router-view />
    </div>
    <Footer/>
    
  </section>
</template>

<script>
import MainNavBar from "../components/MainNavBar.vue";
import BoardsPreview from "../components/BoardsPreview.vue";
import Footer from "../components/Footer.vue";
export default {
  data() {
    return {
      isAddBoard: true,
      newBoard: {
        title: "",
        activityLog: [],
        usersOnBoard: [],
        members: [],
        topics: []
      },
    };
  },
  computed: {
    user() {
      return this.$store.getters.loggedInUser;
    },
    users() {
      return this.$store.getters.users;
    },
    boards() {
      return this.$store.getters.boards;
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
      this.newBoard.members.push(this.user)
      var payload = { action: 'addBoard', board: this.newBoard, firstMember: this.user}
      this.$store.dispatch({ type: 'handleBoard', payload });
      this.isAddBoard = true;
    },
    removeBoard(board) {
      var payload = {action: 'removeBoard', board}
      this.$store.dispatch({ type: 'handleBoard', payload });
    },
    updateBoardMembers(passedIn){
      var payload = { action: 'updateBoardMembers', board: passedIn.board, member: passedIn.member }
      this.$store.dispatch({ type: 'handleBoard', payload });
    },
    exit() {
      this.isAddBoard=true;
    },
  },
  created() {
    this.$store.dispatch("loadUsers");
    this.$store.dispatch("loadBoards");
  },
  components: {
    MainNavBar,
    BoardsPreview,
    Footer
  }
};
</script>