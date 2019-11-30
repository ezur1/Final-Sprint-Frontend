<template>
  <section v-if="task" class="task-preview flex col">
    <div class="preview-header flex space-between">
      <div class="task-mid-info">
        <h1>{{task.foundTask.title}}</h1>
        <span>{{task.foundTask.createdBy}}</span>
      </div>
      <i class="fas fa-times"></i>
    </div>
    <div class="preview-body flex space-between">
      <div class="preview-main">
        <section class="description">
          <h3>Description</h3>
          <textarea
            name="description"
            placeholder="Add a description to your task.."
            @click="showDescBtns()"
          ></textarea>
          <div v-if="isDescBtns" class="descBtns">
            <button>Save</button>
            <button>X</button>
          </div>
        </section>
      </div>
      <div class="preview-sidebar flex col">
        <div class="add-to-card flex col">
          <h3>ADD TO CARD</h3>
          <a href="#" title="Labels" class="prev-side-btn">
            <span>Labels</span>
            <div v-if="labelsMenuOn" class="labels-menu mini-menu">
              <div class="blue-lable"></div>
            </div>
          </a>
          <a
            href="#"
            title="Check List"
            class="prev-side-btn"
            @click.prevent="openMenu('checklist')"
          >
            <span>Checklist</span>
            <div v-if="checklistMenuOn" class="checklist-menu mini-menu flex col" @click.stop>
              <span class="mini-menu-header">Add Checklist</span>
              <div class="flex">
                <h3>Title</h3>
                <input type="text" />
              </div>
              <button>Add</button>
            </div>
          </a>
          <a href="#" title="Due Date" class="prev-side-btn">
            <span>Due Date</span>
          </a>
        </div>
        <div class="actions-on-card flex col">
          <h3>ACTIONS</h3>
          <a href="#" title="Move" class="prev-side-btn">
            <span>Move</span>
          </a>
          <a href="#" title="Copy" class="prev-side-btn">
            <span>Copy</span>
          </a>
          <a href="#" title="Delete" class="prev-side-btn">
            <span>Delete</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props:['topicTitle'],
  data() {
    return {
      isDescBtns: false,
      checklistMenuOn: false,
      labelsMenuOn:false,
      // isTaskBtns:false,
    };
  },
  methods: {
    showDescBtns() {
      this.isDescBtns = true;
    },
    openMenu(menu) {
      switch (menu) {
        case "checklist":
          this.checklistMenuOn = !this.checklistMenuOn;
      }
    }
  },
  computed: {
    task() {
      return this.$store.getters.currTask;
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