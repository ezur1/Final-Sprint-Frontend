<template>
  <section v-if="task" class="task-details flex col">
    <div class="preview-header flex space-between">
      <div class="task-mid-info">
        <h1
          contenteditable
          ref="taskTitle"
          v-html="task.title"
          @blur="updateTaskTitle"
          @keydown.enter="endEditTaskTitle"
        >{{task.title}}</h1>
        <!-- <span>{{task.createdBy}}</span> -->
      </div>
      <font-awesome-icon icon="times" @click="backToBoard()" />
    </div>

    <div class="preview-body flex space-between">
      <div class="preview-main" @click="closeMiniMenu()">
        <section v-if="tags" class="taskTags flex">
          <div v-for="tag in tags" :key="tag" :class="tag" class="tag-preview"/>
        </section>
        <section class="description">
          <h3>Description</h3>
          <span
            contenteditable
            ref="taskDescription"
            v-html="task.description"
            @blur="updateTaskDescription"
            @keydown.enter="endEditDescription"
          ></span>
        </section>
      </div>

      <div class="preview-sidebar flex col">
        <div class="add-to-card flex col">
          <h3>ADD TO CARD</h3>

          <a href="#" class="prev-side-btn" @click.prevent="openMenu('tags')">
            <span>Tags</span>
            <div v-if="tagsMenuOn" class="tags-menu mini-menu flex col" @click.stop>
              <span class="mini-menu-header">Tags</span>
              <div class="flex col">
                <div ref="blue-tag" class="blue-tag tag" :class="{'selected-tag':task.tags.includes('blue-tag')}" @click="addTag('blue-tag')"></div>
                <div ref="orange-tag" class="orange-tag tag" :class="{'selected-tag':task.tags.includes('orange-tag')}" @click="addTag('orange-tag')"></div>
                <div ref="yello-tag" class="yello-tag tag" :class="{'selected-tag':task.tags.includes('yello-tag')}" @click="addTag('yello-tag')"></div>
                <div ref="green-tag" class="green-tag tag" :class="{'selected-tag':task.tags.includes('green-tag')}" @click="addTag('green-tag')"></div>
                <div ref="red-tag" class="red-tag tag" :class="{'selected-tag':task.tags.includes('red-tag')}" @click="addTag('red-tag')"></div>
              </div>
            </div>
          </a>

          <a href="#" class="prev-side-btn" @click.prevent="openMenu('checklist')">
            <span>Checklist</span>
            <div v-if="checklistMenuOn" class="checklist-menu mini-menu flex col" @click.stop>
              <span class="mini-menu-header">Add Checklist</span>
              <div class="flex">
                <h3>Title:</h3>
                <input type="text" />
              </div>
              <button>Add</button>
            </div>
          </a>

          <a href="#" class="prev-side-btn" @click.prevent="openMenu('duedate')">
            <span>Due Date</span>
            <div v-if="dueDateMenuOn" class="duedate-menu mini-menu flex col" @click.stop>
              <span class="mini-menu-header">Change Due Date</span>
              <div class="flex">
                <input type="date" />
              </div>
              <button>Add</button>
            </div>
          </a>
        </div>

        <div class="actions-on-card flex col">
          <h3>ACTIONS</h3>
          <a href="#" class="prev-side-btn">
            <span>Move</span>
          </a>
          <a href="#" class="prev-side-btn">
            <span>Copy</span>
          </a>
          <a href="#" class="prev-side-btn">
            <span @click.stop="removeTask(task.title)">Delete</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {eventBus} from '../main.js'
// import {uploadImg} from '../services/img.service.js'

export default {
  props: ["topicTitle"],
  data() {
    return {
      val: null,
      checklistMenuOn: false,
      tagsMenuOn: false,
      dueDateMenuOn: false,
      taskDescription: "",

    };
  },
  methods: {
    openMenu(menu) {
      switch (menu) {
        case "checklist":
          this.checklistMenuOn = !this.checklistMenuOn;
          this.tagsMenuOn = false;
          this.dueDateMenuOn = false;
          break;
        case "tags":
          this.tagsMenuOn = !this.tagsMenuOn;
          this.checklistMenuOn = false;
          this.dueDateMenuOn = false;
          break;
        case "duedate":
          this.dueDateMenuOn = !this.dueDateMenuOn;
          this.checklistMenuOn = false;
          this.tagsMenuOn = false;
          break;
      }
    },
    backToBoard() {
      var boardId = this.$route.params.boardId;
      this.$router.push(`/boards/${boardId}`);
    },
    closeMiniMenu(){
        this.checklistMenuOn = false;
        this.tagsMenuOn = false;
        this.dueDateMenuOn = false;
    },
    updateTaskTitle(event) {
      var oldTaskTitle = this.originalTaskTitle;
      eventBus.$emit("updateTaskTitle", {
        oldTaskTitle,
        newTitle: event.target.innerHTML,
        topicTitle: this.topicTitle
      });
      this.originalTaskTitle = event.target.innerHTML;
    },
    endEditTaskTitle() {
      this.$refs.taskTitle.blur();
    },
    endEditDescription() {
      this.$refs.taskDescription.blur();
    },
    updateTaskDescription(event) {
      var currTaskTitle = this.originalTaskTitle;
      var newDescription = event.target.innerHTML;
      if (newDescription === "") {
        newDescription = "Empty, click here to edit!";
        event.target.innerHTML = "Empty, click here to edit!";
      }
      eventBus.$emit("updateTaskDescription", {
        taskTitle: currTaskTitle,
        topicTitle: this.topicTitle,
        description: newDescription
      });
    },
    removeTask(taskTitle) {    
      eventBus.$emit('removeTask', { topicTitle: this.topicTitle, taskTitle: taskTitle });
      this.backToBoard()
    },
    addTag(tag){
      var currTaskTitle = this.originalTaskTitle;
      var isSelected = event.target.className.includes("selected-tag");
      // console.log(isSelected);
      if(isSelected){
        var classStr = event.target.className
        classStr = classStr.replace(' selected-tag','');
        // console.log(classStr);
        event.target.className = classStr;
      }
      else event.target.className += ' selected-tag';
       
      eventBus.$emit("updateTaskTags", {
        taskTitle: currTaskTitle,
        topicTitle: this.topicTitle,
        tag
      });
    }
  },
  computed: {
    task() {
      console.log('aha');
      
      var task = this.$store.getters.currTask;
      return task;
    },
    originalTaskTitle: {
      get() {
        var taskTitle = this.$store.getters.currTask;
        taskTitle = taskTitle.title;
        // console.log("taskTitle at computed:", taskTitle);
        return taskTitle;
      },
      set(value) {
        this.val = value;
      }
    },
    tags(){
      var tags = this.$store.getters.currTaskTags;
      console.log(tags);
      return tags;
    }
  },
  created() {
    var boardId = this.$route.params.boardId;
    var taskId = this.$route.params.taskId;
    var topicTitle = this.topicTitle;
    this.$store.dispatch({ type: "getTaskById", boardId, taskId, topicTitle });
  }
};
</script>