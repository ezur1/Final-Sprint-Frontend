<template>
  <section class="index">
    <div class="topic-wraper">
      <div class="topic-content flex col" :style="{ 'background-color': topic.color }">
        <div class="topic-content-header flex space-between">
          <div
            class="topic-title"
            contenteditable
            ref="topicTitle"
            v-html="topic.title"
            @blur="updateTopicTitle"
            @keydown.enter="endEditTopicTitle"
          ></div>
          <a href="#" class="prev-side-btn" @click.prevent="openMenu">
            <font-awesome-icon class="mini-menu-topic-icon" icon="ellipsis-h" />
            <div
              v-on-clickaway="openMenu"
              v-if="TopicMenuOn"
              class="topic-mini-menu flex col"
              @click.stop
            >
              <span @click="showSortBy=!showSortBy">Sort By</span>
              <div v-if="showSortBy" class="confirmation-modal">
                <div class="flex col space-between">
                  <button class="sortby-option title flex" @click="setSort('title')">Title</button>
                  <button class="sortby-option duedate flex" @click="setSort('dueDate')">Due Date</button>
                  <button class="sortby-option creation flex" @click="setSort('createdAt')">Creation Date</button>
                </div>
              </div>

              <span @click="openColorDropDown()">Topic Color</span>
                <div v-if="isColorDropDownOpen" class="color-dropdown flex col">
                  <div class="topic-color light-blue" @click="updateTopicColor(topic.title, 'rgba(173, 216, 230, 0.9)')"></div>
                  <div class="topic-color light-red" @click="updateTopicColor(topic.title, 'rgba(240, 128, 128, 0.9)')"></div>
                  <div class="topic-color light-green" @click="updateTopicColor(topic.title, 'rgba(187, 229, 220, 0.9)')"></div>
                  <div class="topic-color light-pink" @click="updateTopicColor(topic.title, 'rgba(255, 182, 193, 0.9)')"></div>
                  <div class="topic-color light-yellow" @click="updateTopicColor(topic.title, 'rgba(255, 255, 224, 0.9)')"></div>
                  <div class="topic-color none flex " @click="updateTopicColor(topic.title, 'rgba(228, 235, 234, 0.9)')">reset</div>
                </div> 

              <span @click="showConfirm=!showConfirm">Delete</span>
              <div v-if="showConfirm" class="confirmation-modal">
                <p>Are you sure?</p>
                <div class="flex space-around">
                  <button @click="removeTopic(topic.title)" class="confirm-btn">Yes</button>
                  <button @click="showConfirm=!showConfirm" class="cancel-btn">Cancel</button>
                </div>
              </div>
            </div>
          </a>
        </div>
        <div class="topic-tasks">
          <Container 
          @drop="onDrop" 
          group-name="tasks" 
          :get-child-payload="getTaskPayload(topic.title)"
          drag-class="task-drag"
          drop-class="task-drop"
          >
            <Draggable v-for="task in tasks" :key="task.id">
              <TaskPreview class="task" :board="currBoard" :task="task" :topic="topic" />
            </Draggable>
          </Container>
        </div>
        <section class="task-composer flex align-c">
          <div>
            <p v-if="isAddTask" @click="openNewTaskModal()">
              <span>+</span>Add Task
            </p>
          </div>
          <div v-if="!isAddTask" class="add-task-title flex space-between align-c">
            <input
              ref="input"
              type="text"
              placeholder="Task title"
              v-model="newTask.title"
              @keyup.enter="addTask(topic.title)"
              @blur="exit"
            />
            <font-awesome-icon class="exit-btn" @click="exit" icon="times" size="2x" />
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<script>
import { eventBus } from "../main.js";
import TaskPreview from "@/components/TaskPreview";
import { Container, Draggable } from "vue-smooth-dnd";
import { utilService } from "../services/util.service.js";
import { directive as onClickaway } from "vue-clickaway";

export default {
  props: ["topic"],
  directives: {
    onClickaway: onClickaway
  },
  data() {
    return {
      isAddTask: true,
      newTask: {
        title: "",
        id: null
      },
      isShowForm: false,
      showConfirm:false,
      showSortBy:false,
      originalTopicTitle: null,
      TopicMenuOn: false,
      isColorDropDownOpen: false,
      
    };
  },
  computed: {
    currBoard() {
      return this.$store.getters.currBoard;
    },
    currUser() {
      return this.$store.getters.loggedInUser;
    },
    tasks: {
      get() {
        return this.topic.tasks;
      },
      set(newTaskOrder) {
        this.$store.dispatch({
          type: "updateTaskOrder",
          topicTitle: this.topic.title,
          tasks: newTaskOrder
        });
      }
    }
  },
  methods: {
    onDrop(dropResult) {
      this.tasks = utilService.applyDrag(this.tasks, dropResult);
    },
    getTaskPayload (topicTitle) {
      return index => {
        return this.currBoard.topics.filter(topic => topic.title === topicTitle)[0].tasks[index]
      }
    },
    openNewTaskModal() {
      this.isAddTask = !this.isAddTask;
      this.newTask.title = "";
      setTimeout(() => {
        this.$refs.input.focus();
      }, 10);
    },
    removeTopic(topicTitle) {
      eventBus.$emit('handleTopic', {action: 'removeTopic', topicTitle})
    },
    updateTopicTitle(event){
      var topicTitle = this.originalTopicTitle;
      var newTopicTitle = event.target.innerHTML;
      eventBus.$emit('handleTopic', {action: 'updateTopicTitle', topicTitle, newTopicTitle})
      this.originalTopicTitle = event.target.innerHTML;
    },
    updateTopicColor(topicTitle, color){
      eventBus.$emit('handleTopic', {action: 'updateTopicColor', topicTitle, color})
      this.openColorDropDown();
      this.openMenu();
    },
    addTask(topicTitle) {
      if (!this.newTask.title) return;
      this.newTask.id = utilService.makeId();
      this.newTask.description = "Empty, click here to edit.";
      this.newTask.members = [];
      this.newTask.tags = [];
      this.newTask.checkLists = [];
      this.newTask.activities = [{txt:'has created this task', user: this.currUser, timeStamp: Date.now()}];
      this.newTask.imgUrls = [];
      this.newTask.dueDate = 0;
      this.newTask.createdAt = Date.now();
      var taskTitle = this.newTask.title;
      eventBus.$emit('handleTask', {action: 'addTask', topicTitle, taskTitle, newTask: this.newTask})
      this.isAddTask = true;
    },
    setSort(key){
      if (key === 'dueDate'){
        var tasksWithDueDate = this.tasks.filter(task => task.dueDate !== 0);
        var tasksWithNoDueDate = this.tasks.filter(task => task.dueDate === 0);
        tasksWithDueDate = utilService.setSort(tasksWithDueDate, key)
        var sortedbyDueDate = tasksWithDueDate.concat(tasksWithNoDueDate);
        this.tasks = sortedbyDueDate
      } else utilService.setSort(this.tasks, key)
      this.showSortBy = !this.showSortBy;
      this.TopicMenuOn = !this.TopicMenuOn;
    },
    exit() {
      this.isAddTask = true;
    },
    endEditTopicTitle() {
      this.$refs.topicTitle.blur();
    },
    openMenu() {
      this.TopicMenuOn = !this.TopicMenuOn;
      this.showConfirm=false
    },
    openColorDropDown() {
      this.isColorDropDownOpen = !this.isColorDropDownOpen;
    },
  },
  components: {
    TaskPreview,
    Container, 
    Draggable
  },
  created() {
    this.originalTopicTitle = this.topic.title;
  }
};
</script>

