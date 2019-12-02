<template>
  <section class="boards-preview ">
    <div class="board-card" @click="goToBoard(board._id)">{{board.title}}</div>
  </section>
</template>

<script>
export default {
  props: ["board"],
  methods: {
    goToBoard(boardId) {
      this.$router.push(`/boards/${boardId}`);
    }
  },
};
</script>