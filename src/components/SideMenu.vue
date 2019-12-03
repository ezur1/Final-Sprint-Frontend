<template>
    <section class="side-menu">
      <h2 class="side-menu-header">{{board.title}}</h2>
      <label>
        <font-awesome-icon icon="images" />
        <input type="file" @click="changeBoardBGImg($event)" />
      </label>
      <div class="board-description">
        <h1>Board Description:</h1> 
        <div contenteditable ref="boardDescription" 
            v-html="board.description" 
            @blur="updateBoardDescription" 
            @keydown.enter="endEditBoardDescription">
        </div>
        <br>
        <h3>Activity Log:</h3>
        <section v-if="activities" class="logEntries">
          <ul class="activity" v-for="(activity,index) in activities" :activity="activity" :key="index">
            <li class="clean">
              <img :src="activity.user.imgUrl" @click="gotoUserPage(activity.user._id)"/> 
              {{activity.user.userName}} has 
              {{activity.title}}
              {{activity.timeStamp | moment("from", "now") }}
            </li>
          </ul>
        </section>
        <button @click="clearLog">Clear</button>
      </div>
    </section>
</template>


<script>
import {eventBus} from '../main.js'
import imgService from "../services/img.service.js";
export default {
  data() {
    return {
      // isShow: true,
      isOpen: false,
      descriptionTxt: "",
      originalBoardDescription: null,
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
      console.log('this is the event: ',ev);
      var res = await imgService.uploadImg(ev)
      console.log('this is the res: ',res);
      // eventBus.$emit("updateBoardDescription", { boardImgUrl: res });
    },
    // changeBoardBGImg(ev) {
    //   imgService.uploadImg(ev).then(res => {
    //     console.log('this is the res: ',res);
    //     this.copiedToy.imgURL = res;
    //   });
    // },
    gotoUserPage(userId){
      console.log('this is the requested userId: ',userId); /// future development
    },
    clearLog() {
      eventBus.$emit('clearLog')
    }
  },
  computed: {
    board(){
      return this.$store.getters.currBoard;
    },
    activities() {
      return this.$store.getters.currLog;
    },
  },
    created() {
    this.originalBoardDescription = this.board.title;
  },
  components: {}
};
</script>

