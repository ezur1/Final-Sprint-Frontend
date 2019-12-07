<template>
  <div v-if="checkList" class="checklist-container flex col">
    <div class="checklist-header flex">
        <font-awesome-icon class="icon" icon="tasks" />
        <h3 class="checklist-title">{{checkList.checkListTitle}}</h3>
        <font-awesome-icon class="remove-checklist" @click="removeCheckList" icon="trash"/>
    </div>
    <div class=" checklist-main flex col">
      <div v-for="currTodo in checkList.todos" :key="currTodo.txt" class="checklist-list space-between flex align-c">
        <div class="flex todo align-c">
          <input @click="toggleIsDoneCheckList(currTodo.txt)" type="checkbox" />
          <!-- <input @click="toggleIsDoneCheckList(currTodo.txt)" type="checkbox" else  /> -->
          <p :class="{active: currTodo.isDone }">{{currTodo.txt}}</p>
        </div>
        <font-awesome-icon class="icon remove-checklist-item" icon="backspace" />
      </div>
      <div class="add-todo" v-on-clickaway="showComposer">
        <div v-if="!isAddTodo">
          <span @click="isAddTodo=true">Add Item</span>
        </div>
        <div v-if="isAddTodo" class="flex">
          <input ref="todoItem" type="text" placeholder="Add an item" @keydown.enter="addTodo"/>
          <span @click="addTodo">Add</span>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import { eventBus } from "../main.js";
import { directive as onClickaway } from "vue-clickaway";

export default {
  name: "CheckList",
  props: ["checkList", "topicTitle", "originalTaskTitle"],
  data(){
    return{
      isAddTodo:false
    }
  },
   directives: {
    onClickaway: onClickaway
  },
  methods: {
    addTodo() {
        var todoItem = this.$refs.todoItem.value;
        if(todoItem==="")return;
        console.log('todoItem - ',todoItem);
        console.log('this.topicTitle - ',this.topicTitle);
        console.log('this.originalTaskTitle - ',this.originalTaskTitle);
        console.log('this.checkList.checkListTitle - ',this.checkList.checkListTitle);
      this.$refs.todoItem.value = "";
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
      // event.target.checked = !event.target.checked;
        eventBus.$emit("toggleIsDoneCheckList", {
        topicTitle: this.topicTitle,
        taskTitle: this.originalTaskTitle,
        checkListTitle: this.checkList.checkListTitle,
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
    },
    removeCheckListItem() {
      var currTaskTitle = this.originalTaskTitle;
      eventBus.$emit("removeCheckList", {
        taskTitle: currTaskTitle,
        topicTitle: this.topicTitle,
        checkListTitle: this.checkList.title
      });
    },
    showComposer(){
      this.isAddTodo=false;
    }
  }
};
</script>