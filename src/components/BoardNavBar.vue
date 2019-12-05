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
      <div class="board-search flex align-center">
        <input ref="filter" @keyup="filter" v-if="isSearchModal" type="text" placeholder="search a task..." />
        <font-awesome-icon class="search-icon" icon="search" @click="isSearchModal=!isSearchModal" />
        <div v-if="isSearchModal" class="search-modal">
          <h3 v-for="taskTitle in taskTitles" :key=taskTitle @click="openTaskDetails(taskTitle)">{{taskTitle}}</h3>
        </div>
      </div>
      <p class="open-menu-btn" @click="openSideMenu" :board="currBoard">Open Menu</p>
      <transition name="fade">
        <div class="drop-down flex col" v-if="isOpenDropDown">
          <div v-for="board in boards" :key="board._id">
              <div class="flex" @click="goToBoard(board._id)">
                <h3 class="board-li">{{board.title}}</h3>
              </div>
          </div>
        </div>
      </transition>
    </div>
    <transition name="slide-fade" >
      <SideMenu v-on-clickaway="removeSideMenu" v-if="isOpenSideMenu" @removeSideMenu="removeSideMenu()"></SideMenu>
    </transition>
  </section>
</template>

<script>
import {eventBus} from '../main.js'
import SideMenu from '../components/SideMenu.vue';
import { directive as onClickaway } from "vue-clickaway";

export default {
  props: ["currBoard"],
  data() {
    return {
      taskTitles:'',
      filterBy:'',
      isSearchModal: false,
      currBoardId: null,
      boards: null,
      isOpenSideMenu: false,
      isOpenDropDown: false,
      bounce: false,
      show: true
    };
  },
  computed: {},
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
    eventBus.$on("removeSideMenu", this.removeSideMenu);
    this.boards = this.$store.getters.boardsToShow;
    this.currBoardId = this.currBoard._id;
  },
  components: {
    SideMenu
  },
   directives: {
    onClickaway: onClickaway
  },
};
</script>