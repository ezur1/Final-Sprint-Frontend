<template>
  <section class="member-container">
    <div @click="removeMemberModal=!removeMemberModal">
      <Avatar :size="40" :username="member.fullName" class="member-preview"></Avatar>
      <div v-if="removeMemberModal" v-on-clickaway="closeRemoveMemberModal" class="member-prev-mini-menu">
        <div class="flex col space-around">
          <p>{{member.fullName}}</p>
          <button @click="removeMemberFromTask(member)" class="confirm-btn">Remove from Task</button>
          <!-- <button @click="showConfirm=!showConfirm" class="cancel-btn">Cancel</button> -->
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import { directive as onClickaway } from "vue-clickaway";
import Avatar from 'vue-avatar'
import { eventBus } from '../main';

export default {
  name: "MemberPreview",
  props: ["topicTitle", "taskTitle", "member"],
  directives: {
    onClickaway: onClickaway
  },
  data() {
    return {
      removeMemberModal: false
    };
  },
  methods: {
    removeMemberFromTask(member){
      eventBus.$emit("updateTaskMembers", {
        taskTitle: this.taskTitle,
        topicTitle: this.topicTitle,
        member
      });
    },
    closeRemoveMemberModal(){
      this.removeMemberModal= false
    },
  },
    components: { 
      Avatar
  }
};
</script>