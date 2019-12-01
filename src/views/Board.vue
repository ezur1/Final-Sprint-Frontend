<template>
  <section v-if="currBoard" class="board-container flex col">
    <MainNavBar />
    <BoardNavBar :currBoard="currBoard" />
    <router-view :topicTitle="topicTitleForTaskDetails"></router-view>
    <div class="actions flex">
      <button @click="openForm()">Add Topic</button>
      <form v-if="isAddTopic" @submit.prevent="addTopic" class="card edit-card">
        add topic title:
        <input type="text" v-model="newTopic.title" />
        <button type="submit">Add</button>
      </form>
    </div>
    <section class="topics-container">
      <draggable v-model="topics">
        <transition-group class="board-lists flex">
          <topic
            v-for="topic in currBoard.topics"
            :key="topic.title"
            :topic="topic"
            :tasks="topic.tasks"
          />
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
      return this.$store.getters.getCurrBoard;
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
    }
  },
  methods: {
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
      this.$router.push(`/boards/${boardId}/tasks/${taskId}`);
    },
    openForm() {
      this.isAddTopic = !this.isAddTopic;
    },
    updateTaskTitle(payload) {
      console.log(payload);
    }
  },
  created() {
    var id = this.$route.params.boardId;
    this.$store.dispatch({ type: "getBoardById", boardId: id });
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
    eventBus.$on("updateTask", payload => {
      this.updateTask(payload);
    });
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
  width: 100;
}
</style>