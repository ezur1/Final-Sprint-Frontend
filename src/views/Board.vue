<template>
  <section v-if="currBoard" class="board-container flex col" :style="{ backgroundImage: `url(${currBoard.imgUrl})`}">
    <MainNavBar />
    <BoardNavBar :currBoard="currBoard" />
    <router-view :topicTitle="topicTitleForTaskDetails"></router-view>
    <section v-if="topics" class="topics-container flex">
      <Container @drop="onDrop" orientation="horizontal">  
        <Draggable v-for="topic in topics" :key="topic.title">
            <topic :topic="topic" :tasks="topic.tasks" />
        </Draggable>
      </Container>
      <!-- <div @click="openForm()" class="add-topic flex align-c">
        <div v-if="isAddTopic" >
          <p><span>+</span>Add Topic</p>
        </div>
        <div v-if="!isAddTopic" class="topic-composer flex space-between align-c">
          <input ref="input" type="text" placeholder="Topic title" v-model="newTopic.title" @keyup.enter="addTopic" @blur="exit" @click.stop />
          <font-awesome-icon class="exit-btn" @click="exit" icon="times" size="2x" />
        </div>
      </div> -->
    </section>
    <div ref="windowOverlay" id="window-overlay"></div>
  </section>
</template>

<script>
import BoardNavBar from "../components/BoardNavBar.vue";
import MainNavBar from "../components/MainNavBar.vue";
import { Container, Draggable } from "vue-smooth-dnd";
import { utilService } from "../services/util.service.js";
import Topic from "../components/Topic.vue";
import { eventBus } from "../main.js";
import socketService from '../services/socket.service.js';

export default {
  name: "board",
  data() {
    return {
      val: null,
      isPreviewTask: false,
      topicTitleForTaskDetails: null,
      currTaskDetails: null
    };
  },
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
  },
  methods: {
    onDrop(dropResult) {
      this.topics = utilService.applyDrag(this.topics, dropResult);
    },
    updateBoard() {
      let id = this.$route.params.boardId;
      this.$store.dispatch({ type: "getBoardById", boardId: id });
    },
    addMsg(){
      // console.log('added msg...');
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
    changeBoardBGImg(payload) {
      this.$store.dispatch({
        type: "changeBoardBGImg",
        board: this.boardToEdit,
        boardImgUrl: payload.boardImgUrl
      });
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
      this.$router.push({name: 'task', params: {boardId, taskId, board: this.currBoard}})
      // this.$router.push(`/boards/${boardId}/tasks/${taskId}`);
      this.$refs.windowOverlay.style.display="block";
    },
    // openForm() {
    //   this.isAddTopic = !this.isAddTopic;
    //   setTimeout(() => {
    //     this.$refs.input.focus();
    //   }, 200);
    // },
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
    updateTaskMembers(payload){
        this.$store.dispatch({
        type: "updateTaskMembers",
        board: this.boardToEdit,
        topicTitle: payload.topicTitle,
        taskTitle:payload.taskTitle,
        member:payload.member
      });
    },
    updateTaskTags(payload){
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
    },
    addImgToTask(payload){
      this.$store.dispatch({
        type:"addImgToTask",
        board: this.boardToEdit,
        topicTitle: payload.topicTitle,
        taskTitle:payload.taskTitle,
        imgUrl: payload.imgUrl
      });
    },
    removeImgFromTask(payload){
      this.$store.dispatch({
        type:"removeImgFromTask",
        board: this.boardToEdit,
        topicTitle: payload.topicTitle,
        taskTitle:payload.taskTitle,
        imgUrl: payload.imgUrl
      });
    }
  },
  async created() {
    var id = this.$route.params.boardId;
    this.$store.dispatch({ type: "getBoardById", boardId: id });

    socketService.setup();
    socketService.emit('gotOnBoard', id)
    socketService.on('boardUpdated', this.updateBoard)

    eventBus.$on("updateBoardDescription", payload => {
      this.updateBoardDescription(payload);
    });
    eventBus.$on("changeBoardBGImg", payload => {
      this.changeBoardBGImg(payload);
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
    eventBus.$on("updateTaskMembers", payload => {
      this.updateTaskMembers(payload);
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
    eventBus.$on("addImgToTask", payload => {
      this.addImgToTask(payload);
    });
    eventBus.$on("removeImgFromTask", payload => {
      this.removeImgFromTask(payload);
    });
    eventBus.$on("disableWindowOverlay", () => {
      this.$refs.windowOverlay.style.display="none";
    });
    eventBus.$on("clearLog", this.clearLog);
  },
  async deactivated(){
    await this.screenShot();
  },
  async destroyed(){
    await this.$store.dispatch({ type: "removeUserFromBoard" });
    socketService.off('chat addMsg', this.addMsg)
    socketService.terminate();
    eventBus.$off()
  },
  components: {
    Topic,
    BoardNavBar,
    MainNavBar,
    Container, 
    Draggable
  }
};
</script>

