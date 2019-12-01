<template>
  <section class="boards-preview">
    <button @click="gotoBoard(board._id)">{{board.title}}</button>
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