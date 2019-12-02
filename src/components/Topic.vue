<template>
  <section>
    <div class="topic-wraper">
      <div class="topic-content flex col" :style="{ 'background-color': topic.color }">
        <div class="topic-content-header flex space-between">
          <div class="topic-title" contenteditable ref="topicTitle" v-html="topic.title" @blur="updateTopic" @keydown.enter="endEditTopicTitle"></div>
          <a href="#" class="prev-side-btn" @click.prevent="openMenu">
            <font-awesome-icon icon="ellipsis-h" :style="{ color: 'grey' }"/>
            <div v-if="TopicMenuOn" class="topic-mini-menu flex col" @click.stop>
              <button @click="openColorDropDown()">Topic Color</button>
                    <div v-if="isColorDropDownOpen" class="flex col">
                      <div class="topic-color light-blue" @click="updateTopicColor(topic.title, 'rgba(173, 216, 230, 0.9)')"></div>
                      <div class="topic-color light-red" @click="updateTopicColor(topic.title, 'rgba(240, 128, 128, 0.9)')"></div>
                      <div class="topic-color light-green" @click="updateTopicColor(topic.title, 'rgba(32, 178, 171, 0.9)')"></div>
                      <div class="topic-color light-pink" @click="updateTopicColor(topic.title, 'rgba(255, 182, 193, 0.9)')"></div>
                      <div class="topic-color light-yellow" @click="updateTopicColor(topic.title, 'rgba(255, 255, 224, 0.9)')"></div>
                      <div class="topic-color none" @click="updateTopicColor(topic.title, '#ebecf0d3')">reset</div>
                    </div>            
              <button @click="removeTopic(topic.title)">Delete</button>
            </div>
          </a>
        </div>
        <div class="topic-tasks">
          <draggable v-model="tasks" group="tasks">
            <transition-group>
              <TaskPreview
                class="task"
                v-for="task in tasks"
                :task="task"
                :key="task.title"
                :topic="topic"
              />
            </transition-group>
          </draggable>
        </div>
        <form v-show="isOpenNewTask" @submit.prevent="addTask(topic.title)" class="card edit-card">
          <input
            class="list-item-details"
            ref="input"
            type="text"
            placeholder="start typing..."
            v-model="newTask.title"
          />
        </form>
        <div class="list-item-composer flex align-c">
          <p v-if="isShow" @click="openNewTaskModal()">
            <span>+</span> add new task...
          </p>
          <button class="add-topic-btn" v-if="isOpenNewTask" @click="addTask(topic.title)">add</button>
          <font-awesome-icon
            class="exit-btn"
            @click="exit"
            icon="times"
            v-if="isOpenNewTask"
            size="2x"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Draggable from "vuedraggable";
import TaskPreview from "@/components/TaskPreview";
import { utilService } from "../services/util.service.js";
import { eventBus } from "../main.js";

export default {
  props: ["topic"],
  data() {
    return {
      isShow: true,
      val: null,
      newTask: {
        title: "",
        id: null
      },
      isOpenNewTask: false,
      isShowForm: false,
      originalTopicTitle: null,
      TopicMenuOn: false,
      isColorDropDownOpen: false
    };
  },
  computed: {
    tasks: {
      get() {
        return this.topic.tasks;
      },
      set(newTaskOrder) {
        this.val = newTaskOrder;
        this.$store.dispatch({
          type: "updateTaskOrder",
          topicTitle: this.topic.title,
          tasks: newTaskOrder
        });
      }
    }
  },
  methods: {
    openNewTaskModal() {
      this.isOpenNewTask = !this.isOpenNewTask;
      this.isShow = !this.isShow;
      this.newTask.title = "";
      setTimeout(()=>{
        this.$refs.input.focus();
      },10)
        
    },
    removeTopic(topicTitle) {
      eventBus.$emit('removeTopic', topicTitle)
    },
    updateTopic(event) {
      eventBus.$emit("updateTopic", {
        oldTitle: this.originalTopicTitle,
        newTitle: event.target.innerHTML
      });
      this.originalTopicTitle = event.target.innerHTML;
    },
    endEditTopicTitle() {
      this.$refs.topicTitle.blur();
    },
    addTask(topicTitle) {
      if (!this.newTask.title) return;
      this.newTask.id = utilService.makeId();
      this.newTask.description = "Empty, click here to edit.";
      this.newTask.tags = [];
      eventBus.$emit("addTask", {
        topicTitle: topicTitle,
        newTask: this.newTask
      });
      this.isOpenNewTask = !this.isOpenNewTask;
      this.isShow = !this.isShow;
    },
    exit() {
      this.isOpenNewTask = !this.isOpenNewTask;
      this.isShow=!this.isShow;
    },
    openMenu() {
      this.TopicMenuOn = !this.TopicMenuOn;
    },
    openColorDropDown() {
      this.isColorDropDownOpen = !this.isColorDropDownOpen;
    },
    updateTopicColor(topicTitle, color){
      eventBus.$emit('updateTopicColor', {topicTitle, color})
      this.openColorDropDown()
      }
  },
  components: {
    Draggable,
    TaskPreview
  },
  created() {
    this.originalTopicTitle = this.topic.title;
  }
};
</script>