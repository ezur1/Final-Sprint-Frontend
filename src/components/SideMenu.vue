<template>
  <section>
    <p class="show-menu-btn">show menu</p>
    <Slide right noOverlay>
      <a id="home" href="#">
        <span>Home</span>
      </a>
    </Slide>
  </section>
</template>


<script>
import { Slide } from "vue-burger-menu";
export default {
  data() {
    return {
      isOpen: false
    };
  },
  methods:{},
  components: {
    Slide // Register your component
  }
};
</script>

