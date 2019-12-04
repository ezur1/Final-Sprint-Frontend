<template>
  <section class="boards-preview ">
    <div class="board-card" @click="goToBoard"><h2>{{board.title}}</h2>
    </div>
    <div @click="showConfirm=!showConfirm" class="prev-side-btn">
      <span v-if="!showConfirm">Delete</span>
      <div v-if="showConfirm" class="flex space-between">
        <span>are you sure?</span>
        <font-awesome-icon @click="removeBoard(board._id)" icon="check" />
        <font-awesome-icon @click="showConfirm = true" icon="times" />
      </div>
    </div>
  </section>
</template>

<script>

export default {
  props: ["board"],
  data() {
    return {
      showConfirm: false
    };
  },
  methods: {
    goToBoard() {
      this.$router.push(`/boards/${this.board._id}`);
    },
    removeBoard(boardId){
      this.$emit('removeBoard', boardId)
    }
  },
};
</script>