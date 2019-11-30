<template>
  <section class="board-nav-bar-container flex align-c space-between">
    <div class="flex">
      <h1 class="nav-bar-logo" @click="openDropDown">{{currBoard.title}}</h1>
      <transition name="fade">
        <div class="dropDown" v-if="isOpenDropDown">
          <div v-for="board in boards" :key="board._id">
              <h4 class="board-li" @click="goToBoard(board._id)">{{board.title}}</h4>
          </div>
        </div>
      </transition>

      <input type="text" placeholder="search..." />
      <div class="search-icon-container">
        <img src="@/assets/search-24.png" />
      </div>
    </div>
    <div>
      <p class="open-menu-btn" @click="openSideMenu">Open Menu</p>
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
    this.boards = this.$store.getters.boardsToShow;
    this.currBoardId = this.currBoard._id;
    console.log("this.currBoardId in created", this.currBoardId);
    console.log("boards", this.boards);
  },
  components: {
    SideMenu // Register your component
  },
  created() {
    eventBus.$on('removeSideMenu', this.removeSideMenu);
  },
};
</script>