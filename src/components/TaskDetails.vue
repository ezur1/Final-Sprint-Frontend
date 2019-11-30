<template>
  <section v-if="task" class="task-preview flex col">
    <div class="preview-header flex space-between">
      <div class="task-mid-info"> <h1>{{task.title}}</h1><span>{{task.createdBy}}</span>
      </div>
      <font-awesome-icon icon="times" @click="backToBoard()" />
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

          <a href="#" class="prev-side-btn" @click.prevent="openMenu('labels')">
            <span>Labels</span>
            <div v-if="labelsMenuOn" class="labels-menu mini-menu flex col" @click.stop>
              <span class="mini-menu-header">Labels</span>
              <div class="flex col">
                <div class="blue-label label"></div>
                <div class="orange-label label"></div>
                <div class="yello-label label"></div>
                <div class="green-label label"></div>
                <div class="red-label label"></div>
              </div>
              <button>Add</button>
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
            <div v-if="dueDateMenuOn" class="checklist-menu mini-menu flex col" @click.stop>
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
            <span>Delete</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ["topicTitle"],
  data() {
    return {
      isDescBtns: false,
      checklistMenuOn: false,
      labelsMenuOn: false,
      dueDateMenuOn: false
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
          this.labelsMenuOn = false;
          this.dueDateMenuOn = false;
          break;
        case "labels":
          this.labelsMenuOn = !this.labelsMenuOn;
          this.checklistMenuOn = false;
          this.dueDateMenuOn = false;
          break;
        case "duedate":
          this.dueDateMenuOn = !this.dueDateMenuOn;
          this.checklistMenuOn = false;
          this.labelsMenuOn = false;
          break;
      }
    },
    backToBoard() {
      var boardId = this.$route.params.boardId;
      this.$router.push(`/boards/${boardId}`);
    }
  },
  computed: {
    task() {
      return this.$store.getters.currTask;
    }
  },

  created() {
    var boardId = this.$route.params.boardId;
    console.log(this.$route.params);
    
    var taskId = this.$route.params.taskId;
    var topicTitle = this.topicTitle;
    this.$store.dispatch({ type: "getTaskById", boardId, taskId, topicTitle });
  }
};
</script>