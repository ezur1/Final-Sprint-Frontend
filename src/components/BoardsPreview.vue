<template>
  <section class="boards-preview ">
    <div class="board-card" @click="goToBoard"><h2>{{board.title}}</h2>
    </div>
    <button @click.stop="removeBoard">DELETE</button>
  </section>
</template>

<script>
import { eventBus } from "../main.js";

export default {
  props: ["board"],
  
  methods: {
    goToBoard() {
      this.$router.push(`/boards/${this.board._id}`);
    },
    removeBoard(){
      console.log('stam');
      eventBus.$emit('removeBoard', this.board._id)
    }
  },
};
</script>