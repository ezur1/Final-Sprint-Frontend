<template>
  <div id="app" class="app">
    <div id="nav">
    </div>
    <router-view />
  </div>
</template>


<script>
export default {
  created() {
  this.$store.dispatch("loadBoards");
  }
}
</script>
