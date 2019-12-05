<template>
  <section class="board-nav-bar-container flex space-between">
    <section class="board-name-users flex">
      <h1 class="nav-bar-logo" @click="openDropDown">{{currBoard.title}}</h1>
      <div v-if="usersOnBoard.length>0" class="connectedUsers flex">
        <div v-for="user in usersOnBoard" :key="user._id">
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
        <div class="dropDown" v-if="isOpenDropDown">
          <div v-for="board in boards" :key="board._id">
            <h4 class="board-li" @click="goToBoard(board._id)">{{board.title}}</h4>
          </div>
        </div>
      </transition>
    </div>
    <transition name="slide-fade">
      <SideMenu v-if="isOpenSideMenu" @removeSideMenu="removeSideMenu()"></SideMenu>
    </transition>
  </section>
</template>

<script>
import { eventBus } from "../main.js";
import SideMenu from "../components/SideMenu.vue";
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
      // let filterBy=this.$refs.filter.value;
      let filterRes;
      console.log('this.currBoard.topics',this.currBoard.topics);
      titles=this.currBoard.topics.map(topic =>{
        let x={topicTitle: topic.title}
        x.taskTitles=topic.tasks.map(task => task.title)
        return x
      })
      console.log('titles',titles);
      titles.map()
      // let topics;
      // let tasks;
      // topics = this.currBoard.topics.map(topic => topic.tasks);
      // let taskTitles = topics.map(task => task.map(taskTitle => taskTitle.title));
      // let titles = taskTitles.flat();
      // tasks = topics.flat();
      // var regex = new RegExp(filterBy, "i");
      //  var searchRes=  titles.filter(title => {
      //   return regex.test(filterBy) === regex.test(title);
      // });
      // this.taskTitles=searchRes
    },
    openTaskDetails(taskTitle){
      console.log('taskTitle',taskTitle);
      let topics;
      let tasks;
      topics = this.currBoard.topics.map(topic => topic.tasks);
      tasks = topics.flat();
      let task=tasks.find(task => {
        if(task.title===taskTitle) return task.id
      })
      
      console.log('topics',topics);
      console.log('task',task);
      // eventBus.$emit('showTaskDetails', { taskId:task.id,topicTitle: task.topic});
    }
  },
  created() {
    eventBus.$on("removeSideMenu", this.removeSideMenu);
    this.boards = this.$store.getters.boardsToShow;
    this.currBoardId = this.currBoard._id;
  },
  components: {
    SideMenu
  }
};
</script>