<template>
  <section>

    <div class="topic-wraper">
      <div class="topic-content flex col">
        <div contenteditable ref="topicTitle" v-html="topic.title" @blur="updateTopic" @keydown.enter="endEditTopicTitle"></div>
        <div class="topic-tasks">
          <draggable v-model="tasks">
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
        <form v-if="isOpenNewTask" @submit.prevent="addTask(topic.title)" class="card edit-card">
          <input
            class="list-item-details"
            type="text"
            placeholder="start typing..."
            v-model="newTask.title"
          />
        </form>
        <div class="list-item-composer">
          <button @click="openNewTaskModal()">NEW-TASK</button>
        </div>
      </div>
      <button @click="removeTopic()">delete</button>
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
      val: null,
      newTask: {
        title: "",
        id: null
      },
      isOpenNewTask: false,
      isShowForm: false,
      originalTopicTitle: null
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
      this.newTask.title = "";
    },
    removeTopic() {
      eventBus.$emit('removeTopic')
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
      eventBus.$emit('addTask', { topicTitle: topicTitle, newTask: this.newTask });
      this.isOpenNewTask = !this.isOpenNewTask;
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