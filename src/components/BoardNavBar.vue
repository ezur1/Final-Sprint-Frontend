<template>
  <section class="board-nav-bar-container flex align-c">
    <h1 class="nav-bar-logo">taskflo</h1>
    <input type="text" placeholder="search..." />
    <div class="search-icon-container">
      <img src="@/assets/search-24.png" />
    </div>
    <SideMenu :isOpen="isOpen">
     
    </SideMenu>
  </section>
</template>

<script>
import SideMenu from "../components/SideMenu.vue";
export default {
    data(){
        return{
            isOpen:true
        }
    },
  components: {
    SideMenu // Register your component
  }
};
</script>