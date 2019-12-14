<template>
  <section class="member-container">
    <div @click.stop="removeMemberModal=!removeMemberModal">
      <Avatar :size="28" :username="member.fullName" class="member-preview"></Avatar>
      <div v-if="removeMemberModal" v-on-clickaway="closeRemoveMemberModal" class="member-prev-mini-menu">
        <div class="flex col space-around">
          <p>{{member.fullName}}</p>
          <button @click.stop="removeMemberFromBoard(member)" class="confirm-btn">Remove Member</button>
          <!-- <button @click="showConfirm=!showConfirm" class="cancel-btn">Cancel</button> -->
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import { directive as onClickaway } from "vue-clickaway";
import Avatar from 'vue-avatar'
// import { eventBus } from '../main';

export default {
  name: "BoardMemberPreview",
  props: ["member"],
  directives: {
    onClickaway: onClickaway
  },
  data() {
    return {
      removeMemberModal: false
    };
  },
  methods: {
    removeMemberFromBoard(member){
      this.$emit('removeMemberFromBoard', member);
      this.closeRemoveMemberModal()
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