<template>
  <section v-if="checkList" class="checklist-container flex col">
    <div class="checklist-header flex space-between">
      <h3 class="checklist-title">{{checkList.checkListTitle}}</h3>
      <font-awesome-icon class="remove-checklist" @click="removeCheckList" icon="trash"/>
    </div>
    <div v-for="currTodo in checkList.todos" :key="currTodo.txt" class="flex align-c">
      <input @click="toggleIsDoneCheckList(currTodo.txt)" type="checkbox" />
      <p :class="{ active: currTodo.isDone }">{{currTodo.txt}}</p>
    </div>
    <div>
      <input ref="todoItem" type="text" placeholder="Add an item" />
      <button @click="addTodo">add</button>
    </div>
  </section>
</template>



<script>
import { eventBus } from "../main.js";

export default {
  name: "CheckList",
  props: ["checkList", "topicTitle", "originalTaskTitle"],
  methods: {
    addTodo() {
      var todoItem = this.$refs.todoItem.value;
      console.log('todoItem - ',todoItem);
      console.log('this.topicTitle - ',this.topicTitle);
      console.log('this.originalTaskTitle - ',this.originalTaskTitle);
      console.log('this.checkList.checkListTitle - ',this.checkList.checkListTitle);
      
      eventBus.$emit("addTodo", {
        topicTitle: this.topicTitle,
        taskTitle: this.originalTaskTitle,
        checkListTitle: this.checkList.checkListTitle,
        todo: {
          txt:todoItem,
          isDone:false
        }
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
  }
};
</script>