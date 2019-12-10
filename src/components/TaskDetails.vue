<template>
  <section v-on-clickaway="backToBoard" v-if="task" class="task-details flex col">
    <div class="preview-header flex space-between">
      <div class="task-mid-info flex space-between">
        <div class="top-header flex col">
            <div>
              <h1
              contenteditable
              ref="taskTitle"
              v-html="task.title"
              @blur="updateTaskTitle"
              @keydown.enter="endEditTaskTitle"
            >{{task.title}}</h1>
            <span>{{topicTitle}}</span>
            </div>
            <div v-if="task.members.length>0" class="flex members">
              <font-awesome-icon class="icon" icon="user-alt" />
              <MemberPreview class="flex" v-for="member in task.members" :key="member._id" :topicTitle="topicTitle" :taskTitle="originalTaskTitle" :member="member" />       
            </div>
        </div>
        
        <div v-if="tags" class="task-tags flex">
            <div v-for="tag in tags" :key="tag" :class="tag" class="tag-preview" />
        </div>
      </div>
      <font-awesome-icon class="exit-btn" icon="times" @click="backToBoard()" />
    </div>
    <div class="details-body flex space-between">
      <div class="details-main" @click="closeMiniMenu()">
       
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
            <font-awesome-icon @click="removeImgFromTask(imgUrl)" icon="times" class="remove-img-icon"/>
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

        <section class="task-activities">
          <div class="task-comments">
            <div>
              <h1 v-if="isAddComment" @click="openForm"><span>+ </span>Add Comment</h1>
            </div>
            <div v-if="!isAddComment" class="add-comment flex align-c">
              <input ref="newCommentInput" type="text" placeholder="add a comment..." @keyup.enter="addComment" @blur="exit" />
              <font-awesome-icon class="exit-btn" @click="exit" icon="times" size="2x" />
            </div>
          </div>
          <div class="toggle-task-activities">
            <span @click="showActivityDetails=!showActivityDetails">Toggle Details</span>
          </div>
          <div v-if="showActivityDetails">
            <div v-if="task.activities!=0" class="toggle-task-activities">
            <span @click="clearTaskActivities">Clear Activities</span>
          </div> 
            <div class="task-created-by flex col" v-for="activity in task.activities" :key="activity.txt">
              <div>
                <Avatar :size="30" :username="activity.user.fullName"></Avatar>
                <span class="task-activity-user-full-name">{{activity.user.firstName}}</span>
                <span class="task-activity-txt">{{activity.txt}}</span>
                <span>{{activity.timeStamp | moment("from", "now") }}</span>
              </div>
            </div>
          </div>
        </section>

      </div>

      <div class="details-sidebar flex col">
        <div class="add-to-card flex col">
          <h3>ADD TO CARD</h3>
          <div class="add-ons flex col">
            <a href="#" class="prev-side-btn" @click.prevent="openMenu('members')">
              <font-awesome-icon class="icon" icon="user-alt" />
              <span class="title">Members</span>
              <div v-if="membersMenuOn" class="members-menu mini-menu flex col" @click.stop>
                <span class="mini-menu-header">Members</span>
                <div class="minimenu-user flex align-c" v-for="member in currBoard.members" :key="member._id" @click="updateTaskMembers(member)">
                  <Avatar :size="30" :username="member.fullName"></Avatar>
                  <span class="title">{{member.fullName}}</span>
                </div>
              </div>
            </a>

            <a href="#" class="prev-side-btn" @click.prevent="openMenu('tags')">
              <font-awesome-icon class="icon" icon="tags" />
              <span class="title">Tags</span>
              <div v-if="tagsMenuOn" class="tags-menu mini-menu flex col" @click.stop>
                <span class="mini-menu-header">Tags</span>
                <div class="flex col tags">
                  <div
                    ref="blue-tag"
                    class="blue-tag tag"
                    :class="{'selected-tag':task.tags.includes('blue-tag')}"
                    @click="updateTaskTags('blue-tag')"
                  ></div>
                  <div
                    ref="pink-tag"
                    class="pink-tag tag"
                    :class="{'selected-tag':task.tags.includes('pink-tag')}"
                    @click="updateTaskTags('pink-tag')"
                  ></div>
                  <div
                    ref="yellow-tag"
                    class="yellow-tag tag"
                    :class="{'selected-tag':task.tags.includes('yellow-tag')}"
                    @click="updateTaskTags('yellow-tag')"
                  ></div>
                  <div
                    ref="green-tag"
                    class="green-tag tag"
                    :class="{'selected-tag':task.tags.includes('green-tag')}"
                    @click="updateTaskTags('green-tag')"
                  ></div>
                  <div
                    ref="red-tag"
                    class="red-tag tag"
                    :class="{'selected-tag':task.tags.includes('red-tag')}"
                    @click="updateTaskTags('red-tag')"
                  ></div>
                </div>
              </div>
            </a>

            <a href="#" class="prev-side-btn" @click.prevent="openMenu('checklist')">
              <font-awesome-icon class="icon" icon="list-alt" />
              <span class="title">Checklist</span>
              <div v-if="checklistMenuOn" class="checklist-menu mini-menu flex col" @click.stop>
                <span class="mini-menu-header">Add Checklist</span>
                <div class="flex">
                  <input @keyup.enter="updateCheckLists" type="text" ref="checklistTitle" placeholder="Checklist Title" />
                </div>
                <button @click="updateCheckLists">Add</button>
              </div>
            </a>

            <a href="#" class="prev-side-btn" @click.prevent="openMenu('duedate')">
              <font-awesome-icon class="icon" icon="clock" />
              <span class="title">Due Date</span>
              <div v-if="dueDateMenuOn" class="duedate-menu mini-menu flex col" @click.stop>
                <span class="mini-menu-header">Change Due Date</span>
                <input type="date" v-model="dueDate" />
                <button @click="addDueDate">Add</button>
              </div>
            </a>

            <a href="#" class="prev-side-btn" @click.prevent="openMenu('img')">
              <font-awesome-icon class="icon" icon="images" />
              <span class="title">Add Image</span>
              <div v-if="imgMenuOn" class="img-menu mini-menu flex col" @click.stop>
                <label class="add-img-link flex align-c" >
                  <font-awesome-icon class="icon" icon="cloud-upload-alt" />
                  <input hidden type="file" @change="uploadImg($event)" />
                  Upload Image
                </label>
                <div v-if="isUploading">
                  uploading...
                </div>
                <div v-if="imgUrl" ><img class="img-attachment" :src="imgUrl" /></div>
                <button ref="imgAddBtn" @click="addImgToTask()" disabled=true>Add</button>
              </div>
            </a>
          </div>
        </div>

        <div class="actions-on-card flex col">
          <h3>ACTIONS</h3>
          <div class="add-ons flex col">
            <div class="prev-side-btn">
              <font-awesome-icon class="icon" icon="chevron-right" />
              <span class="title">Move</span>
            </div>
            <div class="prev-side-btn">
              <font-awesome-icon class="icon" icon="copy"/>
              <span class="title">Copy</span>
            </div>
            <div @click="showConfirm=!showConfirm" class="prev-side-btn">
              <font-awesome-icon v-if="!showConfirm" class="icon" icon="trash-alt"/>
              <span class="title" v-if="!showConfirm">Delete</span>
              <div v-if="showConfirm" class="flex space-between">
                <span>are you sure?</span>
                <font-awesome-icon class="icon" @click="removeTask()" icon="check" />
                <font-awesome-icon class="icon" @click="showConfirm = true" icon="times" />
              </div>
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
      showActivityDetails: false,
      showImg: false,
      val: null,
      tagsMenuOn: false,
      checklistMenuOn: false,
      dueDateMenuOn: false,
      imgMenuOn: false,
      imgUrl: null,
      isUploading: false,
      taskDescription: "",
      isAddComment: true
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
    },
    currUser() {
      return this.$store.getters.loggedInUser;
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
    closeMiniMenu() {
      this.checklistMenuOn = false;
      this.tagsMenuOn = false;
      this.dueDateMenuOn = false;
    },
    updateTaskTitle(event) {
      var newTaskTitle = event.target.innerHTML
      eventBus.$emit('handleTask', {action: 'updateTaskTitle', topicTitle: this.topicTitle, newTaskTitle})
      this.originalTaskTitle = event.target.innerHTML;
    },
    endEditTaskTitle() {
      this.$refs.taskTitle.blur();
    },
    endEditDescription() {
      this.$refs.taskDescription.blur();
    },
    updateTaskDescription(event) {
      var description = event.target.innerHTML;
      if (description === "") {
        description = "Empty, click here to edit!";
        event.target.innerHTML = "Empty, click here to edit!";
      }
      eventBus.$emit('handleTask', {action: 'updateTaskDescription', topicTitle: this.topicTitle, description})
    },
    removeTask() {
      eventBus.$emit('handleTask', {action: 'removeTask', topicTitle: this.topicTitle})
      this.backToBoard();
    },
    updateTaskMembers(member){
      var isSelected = event.target.className.includes("selected-member");
      if (isSelected) {
        var classStr = event.target.className;
        classStr = classStr.replace(" selected-member", "");
        event.target.className = classStr;
      } else event.target.className += " selected-member";
      eventBus.$emit('handleTask', {action: 'updateTaskMembers', topicTitle: this.topicTitle, member})
    },
    updateTaskTags(tag) {
      var isSelected = event.target.className.includes("selected-tag");
      if (isSelected) {
        var classStr = event.target.className;
        classStr = classStr.replace(" selected-tag", "");
        event.target.className = classStr;
      } else event.target.className += " selected-tag";
      eventBus.$emit('handleTask', {action: 'updateTaskTags', topicTitle: this.topicTitle, tag})
    },
    updateCheckLists() {
      this.checklistMenuOn = !this.checklistMenuOn;
      var checkListTitle = this.$refs.checklistTitle.value;
      if(checkListTitle === "")return;
      var checkList = { title: checkListTitle, todos: [] }
      eventBus.$emit('handleTask', {action: 'updateCheckLists', topicTitle: this.topicTitle, checkListTitle, checkList})
    },
    openForm() {
      this.isAddComment = !this.isAddComment;
      setTimeout(()=>{
        this.$refs.newCommentInput.focus();
      },10) 
    },
    addComment() {
      var comment = {
            txt: `wrote: ${this.$refs.newCommentInput.value}`,
            user: this.currUser,
            timeStamp: Date.now()
          } 
      eventBus.$emit('handleTask', {action: 'addTaskComment', topicTitle: this.topicTitle, comment})
      this.exit();
    },
    addDueDate() {
      this.showDueDate = !this.showDueDate;
      this.dueDateMenuOn = !this.dueDateMenuOn;
      eventBus.$emit('handleTask', {action: 'addDueDate', topicTitle: this.topicTitle, dueDate: this.dueDate})
    },
    async uploadImg(ev) {
      this.isUploading = true
      var res = await imgService.uploadImg(ev);
      this.isUploading = false;
      this.$refs.imgAddBtn.disabled = false;
      this.imgUrl = res;
    },
    addImgToTask() {
      this.showImg = !this.showImg;
      this.imgMenuOn = !this.imgMenuOn;
      eventBus.$emit('handleTask', {action: 'addImgToTask', topicTitle: this.topicTitle, imgUrl: this.imgUrl})
      this.imgUrl = null;
    },
    removeImgFromTask(imgUrl){
      eventBus.$emit('handleTask', {action: 'removeImgFromTask', topicTitle: this.topicTitle, imgUrl})
    },
    exit() {
      this.isAddComment=true;
    },
    clearTaskActivities() {
      eventBus.$emit('handleTask', {action: 'clearTaskActivities', topicTitle: this.topicTitle})
    },
  },
  created() {
    var boardId = this.$route.params.boardId;
    var taskId = this.$route.params.taskId;
    var topicTitle = this.topicTitle;
    var board = this.$route.params.board
    if (!topicTitle) this.$router.push(`/boards/${boardId}`);
    this.$store.dispatch({ type: "getTaskById", board, taskId, topicTitle });
  },
  components: { 
    CheckList,
    MemberPreview,
    Avatar
  }
};
</script>