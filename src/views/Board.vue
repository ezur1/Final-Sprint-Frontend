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
    </section>
    <mobileNavBar :currBoard="currBoard" class="show-on-mobile" />
    <div ref="windowOverlay" id="window-overlay"></div>
  </section>
</template>

<script>
import BoardNavBar from "../components/BoardNavBar.vue";
import MainNavBar from "../components/MainNavBar.vue";
import mobileNavBar from '../components/MobileNavBar.vue';
import { Container, Draggable } from "vue-smooth-dnd";
import { utilService } from "../services/util.service.js";
import Topic from "../components/Topic.vue";
import { eventBus } from "../main.js";
import socketService from '../services/socket.service.js';
export default {
  name: "board",
  data() {
    return {
      topicTitleForTaskDetails: null,
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
    showTaskDetails(payload) {
      this.topicTitleForTaskDetails = payload.topicTitle;
      var boardId = this.$route.params.boardId;
      var taskId = payload.taskId;
      this.$router.push({name: 'task', params: {boardId, taskId, board: this.currBoard}})
      this.$refs.windowOverlay.style.display="block";
    },
    handleBoard(payload){
       this.$store.dispatch({ type:"handleBoard", payload });
    },
    handleTopic(payload){
       this.$store.dispatch({ type:"handleTopic", payload });
    },
    handleTask(payload){
       this.$store.dispatch({ type:"handleTask", payload });
    }
  },
  async created() {
    var id = this.$route.params.boardId;
    this.$store.dispatch({ type: "getBoardById", boardId: id });

    socketService.setup();
    socketService.emit('gotOnBoard', id)
    socketService.on('boardUpdated', this.updateBoard)

    eventBus.$on('handleBoard', payload => { this.handleBoard(payload) });
    eventBus.$on('handleTopic', payload => { this.handleTopic(payload) });
    eventBus.$on('handleTask', payload => { this.handleTask(payload) });
    
    eventBus.$on("showTaskDetails", payload => {
      this.showTaskDetails(payload);
    });
    eventBus.$on("disableWindowOverlay", () => {
      this.$refs.windowOverlay.style.display="none";
    });
    eventBus.$on("clearLog", this.clearLog);
  },
  async destroyed(){
    await this.$store.dispatch({ type: "removeUserFromBoard" });
    await this.$store.dispatch({ type: 'setCurrBoardToNull' })
    socketService.off('chat addMsg', this.addMsg)
    socketService.terminate();
    eventBus.$off()
  },
  components: {
    Topic,
    BoardNavBar,
    MainNavBar,
    Container, 
    Draggable,
    mobileNavBar
  }
};
</script>

