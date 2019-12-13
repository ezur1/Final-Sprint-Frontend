<template>
  <section class="boards-preview flex col aglin-c align-center">
    <div
      class="board-card flex col space-between"
      @click="goToBoard"
      :style="{ backgroundImage: `url(${board.imgUrl})` }">
      <a href="#" class="board-prev-side-btn" @click.stop="openMenu">
        <font-awesome-icon icon="ellipsis-h" />
        <div v-on-clickaway="openMenu" v-if="boardMenuOn" class="board-prev-mini-menu flex col" @click.stop>
          <span @click="showUsersMenu">Add Member</span>
          <div v-if="showUsers">
            <div v-for="user in users" :key="user._id">
              <div class="board-color none flex" @click="updateBoardMembers(user)">
                <Avatar :size="30" :username="user.fullName"></Avatar>
                <p>{{ user.firstName }}</p>
              </div>
            </div>
          </div>
          <span @click.stop="showConfirmMenu">Delete</span>
          <div v-if="showConfirm" class="confirmation-modal">
            <p>are you sure?</p>
            <div class="flex space-between">
              <button @click="removeBoard(board)" class="confirm-btn">yes</button>
              <button @click="showConfirm = !showConfirm" class="cancel-btn">no</button>
            </div>
          </div>
        </div>
      </a>
      <div v-if="board.members.length>0" class="flex align-c">
        <BoardMemberPreview class="flex" v-for="member in board.members" :key="member._id" :member="member" @removeMemberFromBoard="updateBoardMembers" />       
      </div>
    </div>
    <h2 class="board-title">{{ board.title }}</h2>
  </section>
</template>

<script>
import { directive as onClickaway } from 'vue-clickaway';
import BoardMemberPreview from "./BoardMemberPreview";
import Avatar from 'vue-avatar';

export default {
  props: ['board', 'users'],
  directives: {
    onClickaway: onClickaway
  },
  data() {
    return {
      boardMenuOn: false,
      showConfirm: false,
      showUsers: false
    };
  },
  computed: {
    boardToEdit() {
      return JSON.parse(JSON.stringify(this.board));
    }
  },
  methods: {
    async goToBoard() {
      await this.$store.dispatch({
        type: 'setCurrBoard',
        boardId: this.board._id
      });
      this.$router.push(`/boards/${this.board._id}`);
    },
    openMenu() {
      this.boardMenuOn = !this.boardMenuOn;
      this.showConfirm = false;
    },
    showUsersMenu() {
      this.showUsers = !this.showUsers;
      this.showConfirm = false;
    },
    showConfirmMenu() {
      this.showConfirm = !this.showConfirm;
      this.showUsers = false;
    },
    removeBoard(board) {
      this.$emit('removeBoard', board);
    },
    updateBoardMembers(member) {
      this.$emit('updateBoardMembers', { board: this.boardToEdit, member });
      this.showUsers = false;
      this.boardMenuOn = false;
    },
  },
  components: {
    Avatar,
    BoardMemberPreview
  }
};
</script>
