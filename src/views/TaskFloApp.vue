<template>
  <section id="app" class="main-app-container">
    <MainNavBar />
    <section class="add-board flex justify-center ">
        <div>
          <h2><p v-if="isAddBoard" @click="openNewBoardModal"><span>+ </span>Add Board</p></h2>
        </div>
        <div v-if="!isAddBoard" class="add-board-title flex align-c">
          <input ref="input" type="text" placeholder="Board title" v-model="newBoard.title" @keyup.enter="addBoard" @blur="exit" />
          <font-awesome-icon class="exit-btn" @click="exit" icon="times" size="2x" />
        </div>
    </section>
    <div class="main-content-container ">
      <div class="flex wrap space-around">
        <h1>My Boards</h1>
        <BoardsPreview v-for="board in boards" 
        :key="board._id" 
        :board="board" 
        :users="users" 
        @removeBoard="removeBoard"
        @addUserToBoard="addUserToBoard" />
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
      this.$store.dispatch({ type: "addBoard", newBoard: this.newBoard, firstMember: this.user });
      this.isAddBoard = true;
    },
    removeBoard(boardId) {
      this.$store.dispatch({ type: "removeBoard", boardId });
    },
    addUserToBoard(payload){
      this.$store.dispatch({ type: "addUserToBoard", board: payload.board, user: payload.user });
      this.$store.dispatch({ type: "addBoardToUser", boardId: payload.board._id, user: payload.user });
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
    BoardsPreview
  }
};
</script>