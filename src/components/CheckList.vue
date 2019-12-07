<template>
  <div v-if="checkList" class="checklist-container flex col">
    <div class="checklist-header flex">
        <font-awesome-icon class="icon" icon="tasks" />
        <h3 contenteditable 
        ref="checkListTitle" 
        v-html="checkList.title" 
        class="checklist-title"
        @blur="updateCheckListTitle"
        @keydown.enter="endEditCheckListTitle">
        </h3>
        <font-awesome-icon class="remove-checklist" @click="removeCheckList" icon="trash"/>
    </div>
    <div class="flex space-between">
      <p>{{checkListStats}}%</p>
      <progress v-if="checkList.todos.length>0" :value="checkListStats" max="100"></progress>
    </div>
    <div class=" checklist-main flex col">
      <ToDoItem 
        v-for="currTodo in checkList.todos" 
        :key="currTodo.txt"
        :todo="currTodo"
        :checkList="checkList"
        :taskTitle="taskTitle"
        :topicTitle="topicTitle"
        class="checklist-list space-between flex align-c" 
        />
      <div class="add-todo" v-on-clickaway="showComposer">
        <div v-if="!isAddTodo">
          <span @click="isAddTodo=true">Add Item</span>
        </div>
        <div v-if="isAddTodo" class="flex">
          <input ref="todoItem" type="text" placeholder="Add an item" @keydown.enter="addTodoItem"/>
          <span @click="addTodoItem">Add</span>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import { eventBus } from "../main.js";
import { directive as onClickaway } from "vue-clickaway";
import ToDoItem from "./ToDoItem";

export default {
  name: "CheckList",
  props: ["checkList", "topicTitle", "taskTitle"],
  data(){
    return{
      isAddTodo:false,
      originalCheckListTitle: null
    }
  },
  computed: {
    checkListStats() {
      var counters = {
          total: this.checkList.todos.length,
          done: 0
      }
      this.checkList.todos.forEach(todo => {
          if (todo.isDone) {
              counters.done++
          }  
      })
      return parseInt((counters.done / counters.total) * 100)
    }
  },
   directives: {
    onClickaway: onClickaway
  },
  methods: {
    updateCheckListTitle(event) {
      if (!event.target.innerHTML)
        event.target.innerHTML = "Checklist";
      eventBus.$emit("updateCheckListTitle", {
        topicTitle: this.topicTitle,
        taskTitle: this.taskTitle,
        oldCheckListTitle: this.checkList.title,
        newCheckListTitle: event.target.innerHTML
      });
      this.originalCheckListTitle = event.target.innerHTML;
    },
    endEditCheckListTitle() {
      this.$refs.checkListTitle.blur();
    },
    addTodoItem() {
      var todoItem = this.$refs.todoItem.value;
      if(todoItem==="")return;
      this.$refs.todoItem.value = "";
        eventBus.$emit("addTodoItem", {
          taskTitle: this.taskTitle,
          topicTitle: this.topicTitle,
          checkListTitle: this.checkList.title,
          todo: {
            txt:todoItem,
            isDone:false
          }
        });
    },
    removeTodoItem(todo) {
      // var currTaskTitle = this.originalTaskTitle;
      eventBus.$emit("removeTodoItem", {
        taskTitle: this.taskTitle,
        topicTitle: this.topicTitle,
        checkListTitle: this.checkList.title,
        todo
      });
    },
    toggleIsDoneCheckList(currTodoTxt) {
      // event.target.checked = !event.target.checked;
        eventBus.$emit("toggleIsDoneCheckList", {
        topicTitle: this.topicTitle,
        taskTitle: this.taskTitle,
        checkListTitle: this.checkList.title,
        currTodoTxt: currTodoTxt
      });
    },
    removeCheckList() {
      // var currTaskTitle = this.originalTaskTitle;
      eventBus.$emit("removeCheckList", {
        taskTitle: this.taskTitle,
        topicTitle: this.topicTitle,
        checkList: this.checkList
      });
    },
    showComposer(){
      this.isAddTodo=false;
    }
  },
  created() {
    this.originalCheckListTitle = this.checkList.title;
  },
  components: { 
    ToDoItem
  }
};
</script>