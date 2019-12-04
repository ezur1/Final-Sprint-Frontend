<template>
  <section class="board-nav-bar-container flex space-between">
    <section class="board-name-users flex">
      <h1 class="nav-bar-logo" @click="openDropDown">{{currBoard.title}}</h1>
      <div v-if="currBoard.usersOnBoard.length>0" class="connectedUsers flex">
        <div v-for="user in currBoard.usersOnBoard" :key="user._id">
          <div class="user-on-board">{{user.userName}}</div>
        </div>
      </div>
    </section>
    <div class="board-menu-section flex align-c">
      <div class="board-search flex">
        <font-awesome-icon class="search-icon" icon="search"/>
        <!-- <input type="text" placeholder="search..." /> -->
      </div>
      <p class="open-menu-btn" @click="openSideMenu" :board="currBoard">Open Menu</p>
      <transition name="fade">
        <div class="dropDown" v-if="isOpenDropDown">
          <div v-for="board in boards" :key="board._id">
              <h4 class="board-li" @click="goToBoard(board._id)">{{board.title}}</h4>
          </div>
        </div>
      </transition>
    </div>
    <transition name="slide-fade" >
      <SideMenu v-if="isOpenSideMenu" @removeSideMenu="removeSideMenu()"></SideMenu>
    </transition>

  </section>
</template>

<script>
import {eventBus} from '../main.js'
import SideMenu from '../components/SideMenu.vue';
export default {
  props: ["currBoard"],
  data() {
    return {
      currBoardId: null,
      boards: null,
      isOpenSideMenu: false,
      isOpenDropDown: false,
      bounce: false,
      show: true
    };
  },
  computed: {
    // usersOnBoard() {
    //   return this.$store.getters.usersOnBoard;
    // }
  },
  methods: {
    openDropDown() {
      this.isOpenDropDown = !this.isOpenDropDown;
    },
    openSideMenu() {
      this.isOpenSideMenu = !this.isOpenSideMenu;
    },
    removeSideMenu() {
      this.isOpenSideMenu = false;
    },
    goToBoard(boardId) {
      if (boardId === this.currBoardId) return;
      this.currBoardId = boardId;
      console.log("boardId in goToBoard", boardId);
      this.$router.push(`/boards/${boardId}`);
      this.$store.dispatch({ type: "getBoardById", boardId: boardId });
       this.isOpenDropDown = false;
    }
  },
  created() {
    eventBus.$on('removeSideMenu', this.removeSideMenu);
    this.boards = this.$store.getters.boardsToShow;
    this.currBoardId = this.currBoard._id;
  },
  components: {
    SideMenu
  }
};
</script>