<template>
    <section class="side-menu">
      <h2 class="side-menu-header">Menu</h2>
      <div class="side-menu-content">
        <div class="about-board">
          <div @click="showAboutBoard=!showAboutBoard" class="flex align-c">
            <font-awesome-icon icon="chalkboard" class="fa-icon" />
            <p :class="{picked:showAboutBoard}">About This Board</p>
          </div>
          <div class="menu-board-description" v-if="showAboutBoard">
              <h1>Board Name: {{board.title}}</h1> 
              <div contenteditable ref="boardDescription" 
                  v-html="board.description" 
                  @blur="updateBoardDescription" 
                  @keydown.enter="endEditBoardDescription">
              </div>
          </div>
        </div>
        <div class="change-board-bgc">
          <div @click="showChangeBgc=!showChangeBgc" class="flex align-c">
            <font-awesome-icon icon="images" class="fa-icon" />
            <p :class="{picked:showChangeBgc}">Change Board Background</p>
          </div>
          <div v-if="showChangeBgc" class="board-background flex col">
            <label>
              <div class="flex">
                <font-awesome-icon icon="file-upload" class="fa-icon"/>
                <h3>Upload Image</h3>
              </div>
              <input hidden type="file" @change="changeBoardBGImg($event)" />
            </label>
            <label>
              <div class="flex">
              <font-awesome-icon icon="camera-retro" class="fa-icon "/>
               <h3 @click="openLibrary">Choose From Library</h3>
               </div>
               <div v-if="showLibrary" class="side-menu-library flex wrap">
                 <div class="bg-img" >
                  <img ref="bgImg" @click="setBackground('https://res.cloudinary.com/ddvdpsmgu/image/upload/v1575394762/zwqecioqitzmvvzeaici.jpg')" src="https://res.cloudinary.com/ddvdpsmgu/image/upload/v1575394762/zwqecioqitzmvvzeaici.jpg">
                 </div>
                 <div class="bg-img">2</div>
                 <div class="bg-img">3</div>
                 <div class="bg-img">4</div>
               </div>
            </label>
          </div>
        </div>
        <div class="avtivity-log flex col">
          <h3 class="activity-header">Activity Log</h3>
            <section v-if="activities" class="logEntries">
              <ul class="activity" >
                <li style="border-bottom: 1px solid rgb(182, 202, 197);padding-bottom:.3rem" class="clean" v-for="(activity,index) in activities" :activity="activity" :key="index">
                  <span class="username-activity"><img :src="activity.user.imgUrl" @click="gotoUserPage(activity.user._id)"/> {{activity.user.userName}}</span>
                  <span class="activity-txt"> {{activity.title}} {{activity.timeStamp | moment("from", "now") }} </span>
                </li>
              </ul>
            </section>
            <div @click="showConfirm=!showConfirm" class="prev-side-btn">
              <span v-if="!showConfirm">Clear Log</span>
              <div v-if="showConfirm" class="flex space-between">
                <span>are you sure?</span>
                <font-awesome-icon @click="clearLog" icon="check" />
                <font-awesome-icon @click="showConfirm = true" icon="times" />
              </div>
            </div>
        </div>
      </div>
    </section>
</template>


<script>
import {eventBus} from '../main.js'
import imgService from "../services/img.service.js";
export default {
  data() {
    return {
      originalBoardDescription: null,
      showAboutBoard:false,
      showChangeBgc:false,
      showConfirm: false,
      showLibrary:false
    };
  },
  methods: {
    updateBoardDescription(event) {
      if (!event.target.innerHTML) event.target.innerHTML = 'What is this board used for?'
      eventBus.$emit("updateBoardDescription", {
        newBoardDescription: event.target.innerHTML
      });
      this.originalTopicTitle = event.target.innerHTML;
    },
    endEditBoardDescription() {
      this.$refs.boardDescription.blur();
    },
    async changeBoardBGImg(ev) {
      var res = await imgService.uploadImg(ev)
      eventBus.$emit("changeBoardBGImg", { boardImgUrl: res });
    },
    setBackground(imgUrl){
      eventBus.$emit("changeBoardBGImg", { boardImgUrl: imgUrl });
    },
    gotoUserPage(userId){
      console.log('this is the requested userId: ',userId); /// future development
    },
    clearLog() {
      eventBus.$emit('clearLog')
    },
    openLibrary(){
      this.showLibrary=!this.showLibrary
    }
  },
  computed: {
    board(){
      return this.$store.getters.currBoard;
    },
    user(){
      return this.$store.getters.loggedInUser
    },
    activities() {
      var activities = this.$store.getters.currLog;
      return activities.reverse();
    },
  },
    created() {
    this.originalBoardDescription = this.board.title;
  },
  components: {}
};
</script>

