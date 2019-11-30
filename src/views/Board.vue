<template>
  <section v-if="currBoard" class="flex col">
    <BoardNavBar/>
    <router-view :topicTitle="topicTitleForTaskDetails"></router-view>
    <div class="actions flex">
      <button @click="openForm()">Add Topic</button>
      <form v-if="isAddTopic" @submit.prevent="addTopic" class="card edit-card">
        add topic title:
        <input type="text" v-model="newTopic.title" />
        <button type="submit">Add</button>
      </form>
    </div>
    <section class="board-lists flex wrap">
      <topic
        v-for="topic in currBoard.topics"
        :key="topic.id"
        :topic="topic"
        :tasks="topic.tasks"
        @removeTopic="removeTopic(topic.title)"
        

       

        @showTaskDetails="showTaskDetails"
      />
    </section>
  </section>
</template>

<script>
import BoardNavBar from '../components/BoardNavBar.vue'
import Topic from '../components/Topic.vue';
import {eventBus} from '../main.js'
export default {
  data() {
    return {
      isAddTopic: false,
      isPreviewTask: false,
      newTopic: {
        title: "",
        tasks: []
      },
      topicTitleForTaskDetails: null
    };
  },
  name: "board",
  computed: {
    currBoard() {
      return this.$store.getters.getCurrBoard;
    },
    boardToEdit(){
      return JSON.parse(JSON.stringify(this.currBoard));
    },
    newTopicToEdit(){
      return JSON.parse(JSON.stringify(this.newTopic));
    }
  },
  methods: {
    addTopic() {
      this.$store.dispatch({ type: "addTopic", board: this.boardToEdit, newTopic: this.newTopicToEdit });
      this.newTopic.title = "";
      this.openForm();
    },
    removeTopic(topicTitle) {
      this.$store.dispatch({ type: "removeTopic", board: this.boardToEdit, topicTitle: topicTitle });
    },
    updateTopic(payload) {
       this.$store.dispatch({ type: "updateTopic", board: this.boardToEdit, oldTitle: payload.oldTitle, newTitle: payload.newTitle });
    },
    addTask(payload) {
      this.$store.dispatch({ type: "addTask", board: this.boardToEdit, topicTitle: payload.topicTitle, newTask: payload.newTask });
    },
    removeTask(payload) {
      this.$store.dispatch({ type: "removeTask", board: this.boardToEdit, topicTitle: payload.topicTitle, taskTitle: payload.taskTitle });
    },
    showTaskDetails(payload) {
      this.topicTitleForTaskDetails = payload.topicTitle
      var boardId = this.$route.params.boardId;
      var taskId = payload.taskId;
      this.$router.push(`/boards/${boardId}/tasks/${taskId}`)
    },
    openForm() {
      this.isAddTopic = !this.isAddTopic;
    },
    updateTaskTitle(payload){
      console.log(payload);
      
    }
  },
  created() {
    var id = this.$route.params.boardId;
    this.$store.dispatch({ type: "getBoardById", boardId: id });
    eventBus.$on('updateTopic', (payload) => {this.updateTopic(payload)})
    eventBus.$on('removeTopic', (payload) => {this.removeTopic(payload)})
    eventBus.$on('addTask', (payload) => {this.addTask(payload)})
    eventBus.$on('removeTask', (payload) => {this.removeTask(payload)})
    eventBus.$on('showTaskDetails', (payload) => {this.showTaskDetails(payload)})
  },
  components: {
    Topic,
     BoardNavBar
  }
};

</script>
