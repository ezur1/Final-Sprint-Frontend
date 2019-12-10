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
        <font-awesome-icon class="remove-checklist" @click="removeCheckList(checkList.title)" icon="trash"/>
    </div>
    <div v-if="checkList.todos.length>0" class="progress-bar flex ">
      <p>{{checkListStats}}%</p>
      <progress :value="checkListStats" max="100"></progress>
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
  directives: {
    onClickaway: onClickaway
  },
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
  methods: {
    updateCheckListTitle(event) {
      if (!event.target.innerHTML) event.target.innerHTML = "Checklist";
      eventBus.$emit('handleTask', { 
        action: 'updateCheckList', 
        checkListAction: 'updateCheckListTitle', 
        topicTitle: this.topicTitle, 
        checkListTitle: this.checkList.title, 
        newCheckListTitle: event.target.innerHTML})
      this.originalCheckListTitle = event.target.innerHTML;
    },
    endEditCheckListTitle() {
      this.$refs.checkListTitle.blur();
    },
    addTodoItem() {
      var todoItem = this.$refs.todoItem.value;
      if(todoItem==="")return;
      this.$refs.todoItem.value = "";
      eventBus.$emit('handleTask', { 
        action: 'updateCheckList', 
        checkListAction: 'updateTodos', 
        topicTitle: this.topicTitle, 
        checkListTitle: this.checkList.title, 
        todo: {
            txt:todoItem,
            isDone:false
          }})
    },
    removeCheckList(checkListTitle) {
      eventBus.$emit('handleTask', {action: 'updateCheckLists', topicTitle: this.topicTitle, checkListTitle})
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