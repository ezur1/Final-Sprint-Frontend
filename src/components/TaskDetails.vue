<template>
  <section v-on-clickaway="backToBoard" v-if="task" class="task-details flex col">
    <div class="preview-header flex space-between">
      <div class="task-mid-info flex space-between">
        <h1
          contenteditable
          ref="taskTitle"
          v-html="task.title"
          @blur="updateTaskTitle"
          @keydown.enter="endEditTaskTitle"
        >{{task.title}}</h1>
        <div v-if="tags" class="task-tags flex">
            <div v-for="tag in tags" :key="tag" :class="tag" class="tag-preview" />
        </div>
      </div>
      <font-awesome-icon class="exit-btn" icon="times" @click="backToBoard()" />
    </div>

    <div class="preview-body flex space-between">
      <div class="preview-main" @click="closeMiniMenu()">
       
        <section class="description">
          <div class="description-header flex align-c">
            <font-awesome-icon class="icon" icon="align-left" />
            <h3>Description</h3>
          </div>
          <span
            contenteditable
            ref="taskDescription"
            v-html="task.description"
            @blur="updateTaskDescription"
            @keydown.enter="endEditDescription"
          ></span>
        </section>

        <section class="members">
          <div v-if="task.members.length>0" class="flex align-c">
            <font-awesome-icon class="icon" icon="user-alt" />
            <h3>Members</h3>
          </div>
          <div class="flex">
            <MemberPreview class="flex" v-for="member in task.members" :key="member._id" :topicTitle="topicTitle" :taskTitle="originalTaskTitle" :member="member" />       
          </div>
        </section>

        <section class="due-date">
          <div v-if="task.dueDate" class="due-date-header flex align-c">
            <font-awesome-icon class="icon" icon="clock" />
            <h3>Due date</h3>
          </div>
            <span v-if="task.dueDate">{{ task.dueDate | moment("dddd, MMMM Do YYYY") }}</span>
        </section>

        <section v-if="task.imgUrls.length>0" class="task-images">
          <div v-if="task.imgUrls.length>0" class="flex align-c">
            <font-awesome-icon class="icon" icon="images" />
            <h3 >Attached Images</h3>
          </div>
          <div v-for="(imgUrl, index) in task.imgUrls" :key="index">
            <img :src="imgUrl" />
            <font-awesome-icon @click="removeImg(imgUrl)" icon="times" />
          </div>
        </section>

        <section class="check-list flex col">
          <CheckList
            v-for="checkList in task.checkLists"
            :key="checkList.title"
            :checkList="checkList"
            :taskTitle="originalTaskTitle"
            :topicTitle="topicTitle"
          />
        </section>
      </div>

      <div class="preview-sidebar flex col">
        <div class="add-to-card flex col">
          <h3>ADD TO CARD</h3>

          <a href="#" class="prev-side-btn" @click.prevent="openMenu('members')">
            <font-awesome-icon class="icon" icon="user-alt" />
            <span>Members</span>
            <div v-if="membersMenuOn" class="members-menu mini-menu flex col" @click.stop>
              <span class="mini-menu-header">Members</span>
              <div class="flex col">
                <h3>Board Members</h3>
                <!-- <input type="text" placeholder="Search members" ref="memberSearch" /> -->
              </div>
              <div class="flex" v-for="member in currBoard.members" :key="member._id" @click="addMemberToTask(member)">
                <Avatar :size="30" :username="member.fullName"></Avatar>
                {{member.fullName}}
              </div>
            </div>
          </a>

          <a href="#" class="prev-side-btn" @click.prevent="openMenu('tags')">
            <font-awesome-icon class="icon" icon="tags" />
            <span>Tags</span>
            <div v-if="tagsMenuOn" class="tags-menu mini-menu flex col" @click.stop>
              <span class="mini-menu-header">Tags</span>
              <div class="flex col">
                <div
                  ref="blue-tag"
                  class="blue-tag tag"
                  :class="{'selected-tag':task.tags.includes('blue-tag')}"
                  @click="addTag('blue-tag')"
                ></div>
                <div
                  ref="orange-tag"
                  class="orange-tag tag"
                  :class="{'selected-tag':task.tags.includes('orange-tag')}"
                  @click="addTag('orange-tag')"
                ></div>
                <div
                  ref="yellow-tag"
                  class="yellow-tag tag"
                  :class="{'selected-tag':task.tags.includes('yellow-tag')}"
                  @click="addTag('yellow-tag')"
                ></div>
                <div
                  ref="green-tag"
                  class="green-tag tag"
                  :class="{'selected-tag':task.tags.includes('green-tag')}"
                  @click="addTag('green-tag')"
                ></div>
                <div
                  ref="red-tag"
                  class="red-tag tag"
                  :class="{'selected-tag':task.tags.includes('red-tag')}"
                  @click="addTag('red-tag')"
                ></div>
              </div>
            </div>
          </a>

          <a href="#" class="prev-side-btn" @click.prevent="openMenu('checklist')">
            <font-awesome-icon class="icon" icon="list-alt" />
            <span>Checklist</span>
            <div v-if="checklistMenuOn" class="checklist-menu mini-menu flex col" @click.stop>
              <span class="mini-menu-header">Add Checklist</span>
              <div class="flex">
                <h3>Title:</h3>
                <input @keyup.enter="addCheckList" type="text" ref="checklistTitle" />
              </div>
              <button @click="addCheckList">Add</button>
            </div>
          </a>

          <a href="#" class="prev-side-btn" @click.prevent="openMenu('duedate')">
            <font-awesome-icon class="icon" icon="clock" />
            <span>Due Date</span>
            <div v-if="dueDateMenuOn" class="duedate-menu mini-menu flex col" @click.stop>
              <span class="mini-menu-header">Change Due Date</span>
              <input type="date" v-model="dueDate" />
              <button @click="addDueDate">Add</button>
            </div>
          </a>

          <a href="#" class="prev-side-btn" @click.prevent="openMenu('img')">
            <font-awesome-icon class="icon" icon="images" />
            <span>Add Image</span>
            <div v-if="imgMenuOn" class="img-menu mini-menu flex col" @click.stop>
              <label >
                <font-awesome-icon class="icon" icon="cloud-upload-alt" />
                <input hidden type="file" @change="uploadImg($event)" />
              </label>
              <div v-if="imgUrl" ><img class="img-attachment" :src="imgUrl" /></div>
              <button @click="addImg">Add</button>
            </div>
          </a>
        </div>

        <div class="actions-on-card flex col">
          <h3>ACTIONS</h3>
          <div class="prev-side-btn">
            <font-awesome-icon class="icon" icon="chevron-right" />
            <span>Move</span>
          </div>
          <div class="prev-side-btn">
            <font-awesome-icon class="icon" icon="copy"/>
            <span>Copy</span>
          </div>
          <div @click="showConfirm=!showConfirm" class="prev-side-btn">
            <font-awesome-icon v-if="!showConfirm" class="icon" icon="trash-alt"/>
            <span v-if="!showConfirm">Delete</span>
            <div v-if="showConfirm" class="flex space-between">
              <span>are you sure?</span>
              <font-awesome-icon class="icon" @click="removeTask(task.title)" icon="check" />
              <font-awesome-icon class="icon" @click="showConfirm = true" icon="times" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { eventBus } from "../main.js";
import imgService from "../services/img.service.js";
import CheckList from "./CheckList.vue";
import MemberPreview from "./MemberPreview";
import Avatar from 'vue-avatar'
import { directive as onClickaway } from "vue-clickaway";

export default {
  name: "TaskDetails",
  props: ["topicTitle"],
  directives: {
    onClickaway: onClickaway
  },
  data() {
    return {
      membersMenuOn: false,
      dueDate: null,
      showDueDate: false,
      showConfirm: false,
      showImg: false,
      val: null,
      tagsMenuOn: false,
      checklistMenuOn: false,
      dueDateMenuOn: false,
      imgMenuOn: false,
      imgUrl: null,
      taskDescription: ""
    };
  },
  computed: {
    task() {
      return this.$store.getters.currTask;
    },
    currBoard() {
      return this.$store.getters.currBoard;
    },
    originalTaskTitle: {
      get() {
        var taskTitle = this.$store.getters.currTask;
        taskTitle = taskTitle.title;
        return taskTitle;
      },
      set(value) {
        this.val = value;
      }
    },
    tags() {
      var tags = this.$store.getters.currTaskTags;
      return tags;
    }
  },
  methods: {
    openMenu(menu) {
      switch (menu) {
        case "members":
          this.membersMenuOn = !this.membersMenuOn;
          this.tagsMenuOn = false;
          this.checklistMenuOn = false;
          this.dueDateMenuOn = false;
          this.imgMenuOn = false;
          break;
        case "tags":
          this.tagsMenuOn = !this.tagsMenuOn;
          this.membersMenuOn = false;
          this.checklistMenuOn = false;
          this.dueDateMenuOn = false;
          this.imgMenuOn = false;
          break;
        case "checklist":
          this.checklistMenuOn = !this.checklistMenuOn;
          this.membersMenuOn = false;
          this.tagsMenuOn = false;
          this.dueDateMenuOn = false;
          this.imgMenuOn = false;
          break;
        case "duedate":
          this.dueDateMenuOn = !this.dueDateMenuOn;
          this.membersMenuOn = false;
          this.checklistMenuOn = false;
          this.tagsMenuOn = false;
          this.imgMenuOn = false;
          break;
        case "img":
          this.imgMenuOn = !this.imgMenuOn;
          this.membersMenuOn = false;
          this.checklistMenuOn = false;
          this.dueDateMenuOn = false;
          this.tagsMenuOn = false;
          break;
      }
    },
    backToBoard() {
      var boardId = this.$route.params.boardId;
      eventBus.$emit("disableWindowOverlay");
      this.$router.push(`/boards/${boardId}`);
    },
    // closeRemoveMemberModal(){
    //   this.removeMemberModal= false
    // },
    closeMiniMenu() {
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
      eventBus.$emit("removeTask", {
        topicTitle: this.topicTitle,
        taskTitle: taskTitle
      });
      this.backToBoard();
    },
    addMemberToTask(member){
      var currTaskTitle = this.originalTaskTitle;
      var isSelected = event.target.className.includes("selected-member");
      if (isSelected) {
        var classStr = event.target.className;
        classStr = classStr.replace(" selected-member", "");
        event.target.className = classStr;
      } else event.target.className += " selected-member";
      eventBus.$emit("updateTaskMembers", {
        taskTitle: currTaskTitle,
        topicTitle: this.topicTitle,
        member
      });
    },
    removeMemberFromTask(member){
      var currTaskTitle = this.originalTaskTitle;
      eventBus.$emit("updateTaskMembers", {
        taskTitle: currTaskTitle,
        topicTitle: this.topicTitle,
        member
      });
    },
    addTag(tag) {
      var currTaskTitle = this.originalTaskTitle;
      var isSelected = event.target.className.includes("selected-tag");
      if (isSelected) {
        var classStr = event.target.className;
        classStr = classStr.replace(" selected-tag", "");
        event.target.className = classStr;
      } else event.target.className += " selected-tag";
      eventBus.$emit("updateTaskTags", {
        taskTitle: currTaskTitle,
        topicTitle: this.topicTitle,
        tag
      });
      // console.log("this.tags:", this.tags);
    },
    addCheckList() {
      this.checklistMenuOn = !this.checklistMenuOn;
      var checkListTitle = this.$refs.checklistTitle.value;
      if(checkListTitle === "")return;
      var currTaskTitle = this.originalTaskTitle;
      eventBus.$emit("addCheckList", {
        taskTitle: currTaskTitle,
        topicTitle: this.topicTitle,
        checkList: { title: checkListTitle, todos: [] }
      });
    },
    addDueDate() {
      this.showDueDate = !this.showDueDate;
      this.dueDateMenuOn = !this.dueDateMenuOn;
      var currTaskTitle = this.originalTaskTitle;
      eventBus.$emit("addDueDate", {
        taskTitle: currTaskTitle,
        topicTitle: this.topicTitle,
        dueDate: this.dueDate
      });
    },
    async uploadImg(ev) {
      var res = await imgService.uploadImg(ev)
      this.imgUrl = res;
    },
    addImg() {
      this.showImg = !this.showImg;
      this.imgMenuOn = !this.imgMenuOn;
      var currTaskTitle = this.originalTaskTitle;
      eventBus.$emit("addImgToTask", {taskTitle: currTaskTitle, topicTitle: this.topicTitle, imgUrl: this.imgUrl });
    },
    removeImg(imgUrl){
      var currTaskTitle = this.originalTaskTitle;
      eventBus.$emit("removeImgFromTask", {taskTitle: currTaskTitle, topicTitle: this.topicTitle, imgUrl: imgUrl });
    }
  },
  created() {
    var boardId = this.$route.params.boardId;
    var taskId = this.$route.params.taskId;
    var topicTitle = this.topicTitle;
    var board = this.$route.params.board
    if (!topicTitle) this.$router.push(`/boards/${boardId}`);
    // this.$store.dispatch({ type: "getTaskById", boardId, taskId, topicTitle });
    this.$store.dispatch({ type: "getTaskById", board, taskId, topicTitle });
    

  //   var members = this.currBoard.members;
  //   console.log('these are the members: ', members);
  //   var memberObjects = members.map(userId => {
  //     var memberObject = await this.$store.dispatch({ type: "getUserById", userId })
  //     console.log('got this memberObject: ',memberObject);
  //     return memberObject
  //   })
  //   this.members = memberObjects
    
  },
  components: { 
    CheckList,
    MemberPreview,
    Avatar
  }
};
</script>