<template>
  <section class="checkList-container">
    <div class="flex space-between align-c">
      <h3 v-if="checkList" class="checkList-title">{{checkList.title}}</h3>
      <button @click="removeCheckList">remove checkList</button>
    </div>
    <input type="text" placeholder="add a todo" v-model="todo.txt" />
    <button @click="addTodo">add</button>
    <div v-for="currTodo in checkList.todos" :key="currTodo.txt" class="flex align-c">
      <input @click="toggleIsDoneCheckList(currTodo.txt)" type="checkbox" />
      <p :class="{ active: currTodo.isDone }">{{currTodo.txt}}</p>
    </div>
  </section>
</template>



<script>
import { eventBus } from "../main.js";

export default {
  name: "CheckList",
  props: ["checkList", "topicTitle", "originalTaskTitle"],
  data() {
    return {
      todo: {
        txt: "",
        isDone: false
      }
    };
  },
  methods: {
    addTodo() {
      eventBus.$emit("addTodo", {
        topicTitle: this.topicTitle,
        taskTitle: this.originalTaskTitle,
        checkListTitle: this.checkList.title,
        todo: this.todo
      });
    },
    toggleIsDoneCheckList(currTodoTxt) {
      eventBus.$emit("toggleIsDoneCheckList", {
        topicTitle: this.topicTitle,
        taskTitle: this.originalTaskTitle,
        checkListTitle: this.checkList.title,
        currTodoTxt: currTodoTxt
      });
    },
    removeCheckList() {
      var currTaskTitle = this.originalTaskTitle;
      eventBus.$emit("removeCheckList", {
        taskTitle: currTaskTitle,
        topicTitle: this.topicTitle,
        checkListTitle: this.checkList.title
      });
    }
  },
  created() {
    // console.log("CheckList in CheckList.vue ", this.checkList.title);
  }
};
</script>