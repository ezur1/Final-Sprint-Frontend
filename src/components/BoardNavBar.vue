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
        <input
          ref="filter"
          @keyup="filter"
          v-if="isSearchModal"
          type="text"
          placeholder="search for a task"
        />
        <font-awesome-icon class="search-icon" icon="search" @click="openSearchModal" />
        <transition name="fade">
          <div v-if="isSearchModal" class="search-modal">
            <h1>search results</h1>
            <h3
              @click="openTaskDetails"
              v-for="task in filterRes"
              :key="task.taskId"
            >{{task.taskTitle}}</h3>
          </div>
        </transition>
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
      taskTitles: "",
      filterBy: "",
      filterRes: "",
      isSearchModal: false,
      currBoardId: null,
      boards: null,
      isOpenSideMenu: false,
      isOpenDropDown: false,
      bounce: false,
      show: true
    };
  },
  computed: {
    usersOnBoard() {
      return this.$store.getters.usersOnBoard;
    }
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
    },
    filter() {
      this.filterRes = null;
      var searchRes = [];
      let filterBy = this.$refs.filter.value;
      let titles = this.currBoard.topics.map(topic => {
        let res = { topicTitle: topic.title };
        res.taskTitles = topic.tasks.map(task => {
          let taskObj = { title: "", id: "" };
          taskObj.title = task.title;
          taskObj.id = task.id;
          return taskObj;
        });
        return res;
      });
      console.log("titles", titles);
      // var res=titles.map(topicTitle =>{
      return titles.map(topicTitle => {
        let topic = topicTitle.topicTitle;
        return topicTitle.taskTitles.filter(taskTitle => {
          var regex = new RegExp(filterBy, "i");
          if (regex.test(filterBy) === regex.test(taskTitle.title)) {
            searchRes.push({
              topic: topic,
              taskTitle: taskTitle.title,
              taskId: taskTitle.id
            });
            console.log("searchRes", searchRes);
            this.filterRes = searchRes;
            console.log("this.filterRes", this.filterRes);
          }
        });
      });
    },
    
    openSearchModal(){
      this.isSearchModal=!this.isSearchModal
      this.filterRes = null;

    },
    openTaskDetails() {
      console.log("this.filterRes", this.filterRes);
      eventBus.$emit("showTaskDetails", {
        taskId: this.filterRes[0].taskId,
        topicTitle: this.filterRes[0].topic
      });
      this.filterRes = null;
      this.isSearchModal = false;
    }
  },
  created() {
    eventBus.$on("removeSideMenu", this.removeSideMenu);
    this.boards = this.$store.getters.boards;
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