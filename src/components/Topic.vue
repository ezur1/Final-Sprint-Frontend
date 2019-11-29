<template>
  <section>

    <div class="topic-wraper">
      <div class="topic-content flex col">
        <div contenteditable ref="topicTitle" v-html="topic.title" @blur="updateTopic" @keydown.enter="endEditTopicTitle"></div>
        <div class="topic-tasks">
          <draggable v-model="tasks">
            <transition-group>
              <TaskPreview
                v-for="task in tasks"
                :task="task"
                :key="task.title"
                :topic="topic"
                class="task"
                @taskToTopicRemoveTask="removeTask"
                @taskToTopicShowTaskDetails="showTaskDetails"
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
import { utilService } from '../services/util.service.js';

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
        // console.log('the val is: ', this.val);
        return this.topic.tasks;
      },
      set(newTaskOrder) {
        // console.log('the original task order is: ',this.topic.tasks);
        // console.log('the new task order is: ',newTaskOrder);
        
        // this.val = this.topic.tasks;
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
    removeTask(payload) {
      this.$emit("removeTask", payload);
    },
    removeTopic() {
      this.$emit("removeTopic");
    },
    showTaskPreview() {
      this.$emit("showPreview");
    },
    showTaskDetails(payload) {
      this.$emit("showTaskDetails", payload);
    },
    updateTopic(event) {
      this.$emit("updateTopic", {
        oldTitle: this.originalTopicTitle,
        newTitle: event.target.innerHTML
      });
      this.originalTopicTitle = event.target.innerHTML
    },
    endEditTopicTitle() {
      this.$refs.topicTitle.blur();
    },
    addTask(topicTitle) {
      this.newTask.id = utilService.makeId();
      console.log('this new task has ID: ',this.newTask.id);
      
      this.$emit("addTask", { topicTitle: topicTitle, newTask: this.newTask });
      this.isOpenNewTask = !this.isOpenNewTask;
    }
  },
  components: {
    Draggable,
    TaskPreview
  },
  created() {
    // this.$store.dispatch({ type: "getTasks", items: list });
    this.originalTopicTitle = this.topic.title;
    
  }
};
</script>