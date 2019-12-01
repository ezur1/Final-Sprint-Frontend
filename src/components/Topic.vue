<template>
  <section>

    <div class="topic-wraper">
      <div class="topic-content flex col">
        <div class="topic-content-header flex space-between">
          <div class="topic-title" contenteditable ref="topicTitle" v-html="topic.title" @blur="updateTopic" @keydown.enter="endEditTopicTitle"></div>
          <a href="#" class="prev-side-btn" @click.prevent="openMenu">
            <font-awesome-icon icon="ellipsis-h" :style="{ color: 'grey' }"/>
            <div v-if="TopicMenuOn" class="topic-mini-menu flex col" @click.stop>
              <button @click="openColorDropDown()">Topic Color</button>
                    <div v-if="isColorDropDownOpen" class="flex col">
                      <div class="topic-color-light-blue" @click="setTopicColor(topic.title, 'lightBlue')"></div>
                      <div class="topic-color-light-red" @click="setTopicColor(topic.title, 'lightRed')"></div>
                      <div class="topic-color-light-green" @click="setTopicColor(topic.title, 'lightGreen')"></div>
                      <div class="topic-color-light-pink" @click="setTopicColor(topic.title, 'lightPink')"></div>
                      <div class="topic-color-light-yellow" @click="setTopicColor(topic.title, 'lightYellow')"></div>
                    </div>            
              <button @click="removeTopic(topic.title)">Delete</button>
            </div>
          </a>
        </div>
        <div class="topic-tasks">
          <draggable v-model="tasks" group="tasks">
            <transition-group>
              <TaskPreview class="task" v-for="task in tasks" :task="task" :key="task.title" :topic="topic" />
            </transition-group>
          </draggable>
        </div>
        <form v-if="isOpenNewTask" @submit.prevent="addTask(topic.title)" class="card edit-card">
          <input
            class="list-item-details"
            type="text"
            placeholder="start typing..."
            v-model="newTask.title"
          />
        </form>
        <div class="list-item-composer">
          <p v-if="isShow" @click="openNewTaskModal()"><span>+</span> add new task...</p>
          <button v-if="isOpenNewTask" @click="addTask(topic.title)">add</button>
          <font-awesome-icon icon="times" v-if="isOpenNewTask"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Draggable from "vuedraggable";
import TaskPreview from "@/components/TaskPreview";
import {utilService} from '../services/util.service.js';
import {eventBus} from '../main.js'

export default {
  props: ["topic"],
  data() {
    return {
      isShow:true,
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
        this.$store.dispatch({ type: "updateTaskOrder", topicTitle: this.topic.title, tasks: newTaskOrder });
      }
    }
  },
  methods: {
    openNewTaskModal() {
      this.isOpenNewTask = !this.isOpenNewTask;
      this.isShow=!this.isShow;
      this.newTask.title = "";
    },
    removeTopic(topicTitle) {
      eventBus.$emit('removeTopic', topicTitle)
    },
    updateTopic(event) {
      eventBus.$emit('updateTopic', { oldTitle: this.originalTopicTitle, newTitle: event.target.innerHTML });
      this.originalTopicTitle = event.target.innerHTML
    },
    endEditTopicTitle() {
      this.$refs.topicTitle.blur();
    },
    addTask(topicTitle) {
      this.newTask.id = utilService.makeId();
      this.newTask.description="Empty, click here to edit.";
      this.newTask.tags=[];
      eventBus.$emit('addTask', { topicTitle: topicTitle, newTask: this.newTask });
      this.isOpenNewTask = !this.isOpenNewTask;
      this.isShow=!this.isShow;
    },
    openMenu() {
      this.TopicMenuOn = !this.TopicMenuOn;
    },
    openColorDropDown() {
      this.isColorDropDownOpen = !this.isColorDropDownOpen;
    },
    setTopicColor(topicTitle, color){
      console.log('got here, with topicTitle and color: ',topicTitle, color);
      // switch (color) {
      //   case "lightBlue":
      //     eventBus.$emit('changeTopicColor', {topicTitle, color: 'hex value'})
      //     break;
      }
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