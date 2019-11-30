<template>
  <section class="board-nav-bar-container flex align-c space-between">
    <div class="flex">
      <h1 class="nav-bar-logo">taskflo</h1>
      <input type="text" placeholder="search..." />
      <div class="search-icon-container">
        <img src="@/assets/search-24.png" />
      </div>
    </div>
    <div>
      <p class="open-menu-btn" @click="openSideMenu">Open Menu</p>
    </div>
    <SideMenu v-if="isOpen" @removeSideMenu="removeSideMenu()"></SideMenu>
  </section>
</template>

<script>
import {eventBus} from '../main.js'
import SideMenu from '../components/SideMenu.vue';
export default {
  data(){
    return{
      isOpen:false
    }
  },
  methods:{
    openSideMenu(){
      this.isOpen=!this.isOpen
    },
    removeSideMenu(){
      this.isOpen=false
    }
  },
  components: {
    SideMenu // Register your component
  },
  created() {
    eventBus.$on('removeSideMenu', this.removeSideMenu);
  },
};
</script>