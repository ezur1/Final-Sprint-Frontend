<template>
    <section class="side-menu">
      <font-awesome-icon icon="times" @click="remove" />
      <!-- <img class="remove-btn" @click="remove" src="@/assets/remove.png" /> -->
      <h1 class="side-menu-header">{{board.title}}</h1>
      <div class="board-description">
        
        <h3>about this board</h3>
        <textarea
          v-if="isShow"
          type="text"
          placeholder="add description to your board..."
          v-model="descriptionTxt"
        /> 
        <!-- <button v-if="isShow" @click="addDescription">add</button> -->
        <p>{{descriptionTxt}}</p>
        <h3>Activity Log:</h3>
        <section v-if="activities" class="logEntries">
          <ul class="activity" v-for="activity in activities" :activity="activity" :key="activity.title">
            <li class="clean"><img :src="activity.user.imgUrl"/> 
            {{activity.user.userName}} has 
            {{activity.title}}
            {{activity.timeStamp | moment("from", "now") }}</li>
          </ul>
        </section>
        <button @click="clearLog">Clear</button>
      </div>
    </section>
</template>


<script>
import {eventBus} from '../main.js'
export default {
  data() {
    return {
      isShow: true,
      isOpen: false,
      descriptionTxt: ""
    };
  },
  methods: {
    closeSideMenu() {
      this.isOpen = !this.isOpen;
    },
    addDescription() {
      this.isShow = false;
    },
    remove() {
      eventBus.$emit('removeSideMenu');
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
  components: {}
};
</script>

