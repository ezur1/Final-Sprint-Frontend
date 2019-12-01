<template>
  <section class="boards-preview ">
    <div class="board-card" @click="gotoBoard(board._id)">{{board.title}}</div>
  </section>
</template>

<script>
export default {
  props: ["board"],
  methods: {
    gotoBoard(boardId) {
      this.$router.push(`/boards/${boardId}`);
    }
  },
};
</script>