<template>
  <section v-if="currBoard" class="board-container flex col">
    <MainNavBar />
    <BoardNavBar :currBoard="currBoard" />
    {{refreshCount}}
    <router-view :topicTitle="topicTitleForTaskDetails"></router-view>
    <div class="actions flex">
      <button @click="openForm()">Add Topic</button>
      <form v-if="isAddTopic" @submit.prevent="addTopic" class="card edit-card">
        <input type="text" v-model="newTopic.title" />
        <button type="submit">Add</button>
      </form>
    </div>
    <section class="topics-container">
      <draggable v-model="topics">
        <transition-group class="board-lists flex">
          <topic v-for="topic in currBoard.topics" :key="topic.title" :topic="topic" :tasks="topic.tasks" />
        </transition-group>
      </draggable>
    </section>
  </section>
</template>

<script>
import BoardNavBar from "../components/BoardNavBar.vue";
import MainNavBar from "../components/MainNavBar.vue";
import Draggable from "vuedraggable";
import Topic from "../components/Topic.vue";
import { eventBus } from "../main.js";
import socketService from '../services/socket.service.js';
export default {
  data() {
    return {
      val: null,
      isAddTopic: false,
      isPreviewTask: false,
      newTopic: {
        title: "",
        tasks: []
      },
      topicTitleForTaskDetails: null,
      currTaskDetails: null
    };
  },
  name: "board",
  computed: {
    currBoard() {
      return this.$store.getters.currBoard;
    },
    topics: {
      get() {
        return this.currBoard.topics;
      },
      set(newTopicOrder) {
        this.val = newTopicOrder;
        this.$store.dispatch({
          type: "updateTopicOrder",
          topics: newTopicOrder
        });
      }
    },
    boardToEdit() {
      return JSON.parse(JSON.stringify(this.currBoard));
    },
    newTopicToEdit() {
      return JSON.parse(JSON.stringify(this.newTopic));
    },
    refreshCount(){
      return this.$store.getters.refreshCount;
    }
  },
  methods: {
    updateBoard() {
      let id = this.$route.params.boardId;
      this.$store.dispatch({ type: "getBoardById", boardId: id });
    },
    clearLog(){
      this.$store.dispatch({ type: "clearLog", board: this.boardToEdit, });
    },
    updateBoardDescription(payload) {
      this.$store.dispatch({
        type: "updateBoardDescription",
        board: this.boardToEdit,
        newBoardDescription: payload.newBoardDescription
      });
    },
    addTopic() {
      this.$store.dispatch({
        type: "addTopic",
        board: this.boardToEdit,
        newTopic: this.newTopicToEdit
      });
      this.newTopic.title = "";
      this.openForm();
    },
    removeTopic(topicTitle) {
      this.$store.dispatch({
        type: "removeTopic",
        board: this.boardToEdit,
        topicTitle: topicTitle
      });
    },
    updateTopic(payload) {
      this.$store.dispatch({
        type: "updateTopic",
        board: this.boardToEdit,
        oldTitle: payload.oldTitle,
        newTitle: payload.newTitle
      });
    },
    updateTask(payload) {
      this.$store.dispatch({
        type: "updateTask",
        board: this.boardToEdit,
        oldTitle: payload.oldTitle,
        newTitle: payload.newTitle
      });
    },
    addTask(payload) {
      this.$store.dispatch({
        type: "addTask",
        board: this.boardToEdit,
        topicTitle: payload.topicTitle,
        newTask: payload.newTask
      });
    },
    removeTask(payload) {
      this.$store.dispatch({
        type: "removeTask",
        board: this.boardToEdit,
        topicTitle: payload.topicTitle,
        taskTitle: payload.taskTitle
      });
    },
    showTaskDetails(payload) {
      
      this.currTaskDetails = payload.task;
      this.topicTitleForTaskDetails = payload.topicTitle;
      var boardId = this.$route.params.boardId;
      var taskId = payload.taskId;
      // console.log('BOARD.VUE is about to router PUSH to the taskDetails');
      this.$router.push(`/boards/${boardId}/tasks/${taskId}`);
    },
    openForm() {
      this.isAddTopic = !this.isAddTopic;
    },
    updateTaskTitle(payload) {
      this.$store.dispatch({
        type: "updateTaskTitle",
        board: this.boardToEdit,
        topicTitle: payload.topicTitle,
        newTitle: payload.newTitle,
        oldTitle: payload.oldTaskTitle
      });
    },
    updateTaskDescription(payload){
        this.$store.dispatch({
        type: "updateTaskDescription",
        board: this.boardToEdit,
        topicTitle: payload.topicTitle,
        taskTitle:payload.taskTitle,
        taskDescription:payload.description
      });
    },
    updateTaskTags(payload){
      // console.log("description payload at board.vue", payload);
        this.$store.dispatch({
        type: "updateTaskTags",
        board: this.boardToEdit,
        topicTitle: payload.topicTitle,
        taskTitle:payload.taskTitle,
        tag:payload.tag
      });
    },
    updateTopicColor(payload){
      this.$store.dispatch({
        type: "updateTopicColor",
        board: this.boardToEdit,
        topicTitle: payload.topicTitle,
        color:payload.color
      });
    },
    addCheckList(payload){
      this.$store.dispatch({
        type:"addCheckList",
        board: this.boardToEdit,
        topicTitle: payload.topicTitle,
        taskTitle:payload.taskTitle,
        checkList: payload.checkList
      });
    },
    addTodo(payload){
      console.log('log in board methods');
      this.$store.dispatch({
        type:"addTodo",
        board: this.boardToEdit,
        topicTitle: payload.topicTitle,
        taskTitle:payload.taskTitle,
        checkListTitle: payload.checkListTitle,
        todo: payload.todo
      });
    },
    toggleIsDoneCheckList(payload){
      this.$store.dispatch({
        type:"toggleIsDoneCheckList",
        board: this.boardToEdit,
        topicTitle: payload.topicTitle,
        taskTitle:payload.taskTitle,
        checkListTitle: payload.checkListTitle,
        currTodoTxt: payload.currTodoTxt
      });
    },
    removeCheckList(payload){
      this.$store.dispatch({
        type:"removeCheckList",
        board: this.boardToEdit,
        topicTitle: payload.topicTitle,
        taskTitle:payload.taskTitle,
        checkListTitle: payload.checkListTitle,
        
      });
    },
    addDueDate(payload){
      this.$store.dispatch({
        type:"addDueDate",
        board: this.boardToEdit,
        topicTitle: payload.topicTitle,
        taskTitle:payload.taskTitle,
        dueDate: payload.dueDate
      });
    }
    

  },

  async created() {
    var id = this.$route.params.boardId;
    this.$store.dispatch({ type: "getBoardById", boardId: id });
  
    socketService.setup();
    socketService.emit('gotOnBoard', id)
    socketService.on('boardUpdated', this.updateBoard) //// listening to "boardUpdated" in sockets

    eventBus.$on("updateBoardDescription", payload => {
      this.updateBoardDescription(payload);
    });
    eventBus.$on("updateTopic", payload => {
      this.updateTopic(payload);
    });
    eventBus.$on("removeTopic", payload => {
      this.removeTopic(payload);
    });
    eventBus.$on("addTask", payload => {
      this.addTask(payload);
    });
    eventBus.$on("removeTask", payload => {
      this.removeTask(payload);
    });
    eventBus.$on("showTaskDetails", payload => {
      this.showTaskDetails(payload);
    });
    eventBus.$on("updateTaskTitle", payload => {
      this.updateTaskTitle(payload);
    });
    eventBus.$on("updateTaskDescription", payload => {
      this.updateTaskDescription(payload);
    });
    eventBus.$on("updateTaskTags", payload => {
      this.updateTaskTags(payload);
    });
    eventBus.$on("updateTopicColor", payload => {
      this.updateTopicColor(payload);
    });
    eventBus.$on("addCheckList", payload => {
      this.addCheckList(payload);
    });
    eventBus.$on("addTodo", payload => {
      this.addTodo(payload);
    });
    eventBus.$on("toggleIsDoneCheckList", payload => {
      this.toggleIsDoneCheckList(payload);
    });
    eventBus.$on("removeCheckList", payload => {
      this.removeCheckList(payload);
    });
    eventBus.$on("addDueDate", payload => {
      this.addDueDate(payload);
    });
    eventBus.$on("clearLog", this.clearLog);
  },
destroyed(){
    socketService.off('chat addMsg', this.addMsg)
    socketService.terminate();
    eventBus.$off()
  },
  components: {
    Topic,
    BoardNavBar,
    MainNavBar,
    Draggable
  }
};
</script>

<style lang="scss" scoped>

body {
  background: url('../assets/board-hero.jpg') no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 100vh;
  width: 100vw;
}
</style>