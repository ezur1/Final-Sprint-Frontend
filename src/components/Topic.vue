<template>
  <section>
    <div class="topic-wraper">
      <div class="topic-content flex col">
        <div
          class="topicTitle"
          contenteditable
          ref="topicTitle"
          v-html="topic.title"
          @blur="updateTopic"
          @keydown.enter="endEditTopicTitle"
        ></div>
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
      <button @click="removeTopic()">delete</button>
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
    removeTopic() {
      eventBus.$emit("removeTopic");
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
      this.isShow = !this.isShow;
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