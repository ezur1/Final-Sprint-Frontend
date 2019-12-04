<template>
  <section class="index">
    <div class="topic-wraper">
      <div class="topic-content flex col" :style="{ 'background-color': topic.color }">
        <div class="topic-content-header flex space-between">
          <div class="topic-title" contenteditable ref="topicTitle" v-html="topic.title" @blur="updateTopic" @keydown.enter="endEditTopicTitle"></div>
          <a href="#" class="prev-side-btn" @click.prevent="openMenu">
            <font-awesome-icon icon="ellipsis-h"/>
            <div v-on-clickaway="openMenu" v-if="TopicMenuOn" class="topic-mini-menu flex col" @click.stop>
              <span @click="openColorDropDown()">Topic Color</span>
                <div v-if="isColorDropDownOpen" class="color-dropdown flex col">
                  <div class="topic-color light-blue" @click="updateTopicColor(topic.title, 'rgba(173, 216, 230, 0.9)')"></div>
                  <div class="topic-color light-red" @click="updateTopicColor(topic.title, 'rgba(240, 128, 128, 0.9)')"></div>
                  <div class="topic-color light-green" @click="updateTopicColor(topic.title, '#a3f7bfd7')"></div>
                  <div class="topic-color light-pink" @click="updateTopicColor(topic.title, 'rgba(255, 182, 193, 0.9)')"></div>
                  <div class="topic-color light-yellow" @click="updateTopicColor(topic.title, 'rgba(255, 255, 224, 0.9)')"></div>
                  <div class="topic-color light-gray flex " @click="updateTopicColor(topic.title, 'rgba(228, 235, 234, 0.8)')"></div>
                  <div class="topic-color none flex " @click="updateTopicColor(topic.title, 'rgba(187, 229, 220, 0.9)')">reset</div>
                </div>            
              <span @click="removeTopic(topic.title)">Delete</span>
            </div>
          </a>
        </div>
        <div class="topic-tasks">
          <draggable v-model="tasks" group="tasks" :emptyInsertThreshold="100">
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
        <section class="task-composer flex align-c">
          <div>
            <p v-if="isAddTask" @click="openNewTaskModal()"><span>+ </span>Add task</p>
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
              <font-awesome-icon
                  class="exit-btn"
                  @click="exit"
                  icon="times"
                  size="2x"
              />
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<script>
import Draggable from "vuedraggable";
import TaskPreview from "@/components/TaskPreview";
import { utilService } from "../services/util.service.js";
import { eventBus } from "../main.js";
import { directive as onClickaway } from 'vue-clickaway';

export default {
  props: ["topic"],
  directives: {
    onClickaway: onClickaway,
  },
  data() {
    return {
      isAddTask: true,
      val: null,
      newTask: {
        title: "",
        id: null
      },
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
      this.isAddTask = !this.isAddTask;
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
      this.newTask.checkLists = [];
      this.newTask.dueDate = null;
      eventBus.$emit("addTask", {
        topicTitle: topicTitle,
        newTask: this.newTask
      });
      this.isAddTask = true;
    },
    exit() {
      this.isAddTask=true;
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
      this.openMenu()
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