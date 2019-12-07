<template>
  <div>
    <div class="flex todo align-c">
      <input @click="toggleIsDoneTodo(todo.txt)" :checked="todo.isDone" type="checkbox" />
        <p :class="{active: todo.isDone}"
        contenteditable
        ref="toDoItemTxt"
        v-html="todo.txt"
        @blur="updateToDoItemTxt"
        @keydown.enter="endEditToDoItemTxt">
        </p>
      </div>
    <font-awesome-icon class="icon remove-checklist-item" icon="backspace" @click="removeTodoItem(todo)" />
  </div>       
</template>

<script>
import { eventBus } from "../main.js";

export default {
  name: "Todo",
  props: ["checkList", "topicTitle", "taskTitle", "todo"],
  data(){
    return{
      originalToDoItemTxt: null
    }
  },
  methods: {
    updateToDoItemTxt(event) {
      if (!event.target.innerHTML)
        event.target.innerHTML = "Todo";
      eventBus.$emit("updateToDoItemTxt", {
        topicTitle: this.topicTitle,
        taskTitle: this.taskTitle,
        checkListTitle: this.checkList.title,
        oldToDoItemTxt: this.todo.txt,
        newToDoItemTxt: event.target.innerHTML
      });
      this.originalToDoItemTxt = event.target.innerHTML;
    },
    endEditToDoItemTxt() {
      this.$refs.toDoItemTxt.blur();
    },
    removeTodoItem(todo) {
      eventBus.$emit("removeTodoItem", {
        taskTitle: this.taskTitle,
        topicTitle: this.topicTitle,
        checkListTitle: this.checkList.title,
        todo
      });
    },
    toggleIsDoneTodo(currTodoTxt) {
        eventBus.$emit("toggleIsDoneCheckList", {
        topicTitle: this.topicTitle,
        taskTitle: this.taskTitle,
        checkListTitle: this.checkList.title,
        currTodoTxt: currTodoTxt
      });
    },
  },
  created() {
    this.originalToDoItemTxt = this.todo.txt;
  },
};
</script>