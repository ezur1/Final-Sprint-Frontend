<template>
  <section class="checkList-container">
    <h3 v-if="checkList" class="checkList-title">{{checkList.title}}</h3>

    <input type="text" placeholder="add a todo" v-model="todo.txt" />
    <button @click="addTodo">add</button>
    <div v-for="currTodo in checkList.todos" :key="currTodo.txt">

        <input @click="toggleIsDoneCheckList(currTodo.txt)" type="checkbox">
        
        <p>{{currTodo.txt}}</p>
        <!-- currTodo.isDone:{{currTodo.isDone}} -->
    </div>
  </section>
</template>

<script>
import {eventBus} from '../main.js'

export default {
  name: 'CheckList',
  props: ['checkList','topicTitle','originalTaskTitle'],
  data() {
    return {
        todo:{
            txt:'',
            isDone:false
        },
    };
  },
  methods: {
    addTodo() {
    //   console.log("newTodo", this.todo);
    //   console.log('this.topicTitle',this.topicTitle);
    //   console.log('this.originalTaskTitle',this.originalTaskTitle);
    //   console.log('this.checkList.title',this.checkList.title);
      // console.log('log in CheckList ');

      eventBus.$emit("addTodo", {
        topicTitle: this.topicTitle,
        taskTitle: this.originalTaskTitle,
        checkListTitle: this.checkList.title,
        todo: this.todo
      });
    },
    toggleIsDoneCheckList(currTodoTxt){
        eventBus.$emit("toggleIsDoneCheckList", {
        topicTitle: this.topicTitle,
        taskTitle: this.originalTaskTitle,
        checkListTitle: this.checkList.title,
        currTodoTxt:currTodoTxt
      });
      
    }
  },
  created() {
    // console.log("CheckList in CheckList.vue ", this.checkList.title);
  }
};
</script>