<template>
    <section class="side-menu">
      <img class="remove-btn" @click="remove" src="@/assets/remove.png" />
      <h1 class="side-menu-header">Menu</h1>
      <div class="board-description">
        <h3>about this board</h3>
        <textarea
          v-if="isShow"
          type="text"
          placeholder="add description to your board..."
          v-model="descriptionTxt"
        /> 
        <button v-if="isShow" @click="addDescription">add</button>
        <p>{{descriptionTxt}}</p>
      </div>
    </section>
</template>


<script>
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
      this.$emit("removeSideMenu");
    }
  },
  components: {}
};
</script>

