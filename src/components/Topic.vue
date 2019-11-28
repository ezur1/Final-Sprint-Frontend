<template>
  <section>
    <form v-if="isShowForm" @submit.prevent="saveTopic(topic.title)" class="card edit-card">
      edit topic title:
      <input type="text" v-model="newTopic.title" />
      <button type="submit">save</button>
    </form>

    <div class="topic-wraper">
      <div class="topic-content flex col">
        <div class="list-header">
          {{topic.title}}
          <button @click="showForm()">edit</button>
        </div>

        <div class="topic-tasks" @click="showTaskPreview()">
          <draggable v-model="tasks">
            <transition-group>
              <Task v-for="task in tasks" :task="task" :key="task._id" class="task" />
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
          <button type="submit">save</button>
        </form>

        <!-- <div class="list-item-title">{{task.title}}</div> -->

        this will be a lovely new task!
        <div class="list-item-composer">
          <button @click="openNewTask()">NEW-TASK</button>
        </div>
      </div>
      <button @click="remove()">delete</button>
    </div>
  </section>
</template>

<script>
import Draggable from "vuedraggable";
import Task from "@/components/Task";


export default {
  props: ['topic', 'tasks'],
  data() {
    return {
      // val: null,
      newTopic: {
        title: ""
      },
      newTask: {
        title: ""
      },
      isOpenNewTask:false,
      isShowForm: false
    };
  },
  methods: {
    showForm() {
      this.isShowForm = true;
    },
    openNewTask() {
      this.isOpenNewTask = !this.isOpenNewTask;
      console.log('ready to create a new task? ',this.isOpenNewTask)
    },
    remove() {
      this.$emit('removeTopic')
    },
    edit() {
      this.newTopic.id = this.topic.id;
      this.$store.dispatch({ type: "updateTopic", topic: this.newTopic });
    },
    showTaskPreview(){
          this.$emit('showPreview')
    },
    saveTopic(topicTitle) {
      this.$emit('updateTopic', {oldTitle: topicTitle, newTitle: this.newTopic.title})
    },
    addTask(topicTitle) {
      console.log('trying to add a new task', topicTitle);
      this.$emit('addTask', {topic: topicTitle, newTaskTitle: this.newTask.title})
    }
  },
  computed: {
    // items: {
    //   get() {
    //     // console.log('the val is: ', this.val);
    //     return this.list;
    //   },
    //   set(list) {
    //     this.val = list;
    //     this.$store.dispatch({ type: "updateItemOrder", items: list });
    //   }
    // }
  },
  components: {
    Draggable,
    Task,

  },
  created() {},

};
</script>