<template>
    <section v-if="lists">
        <div class="actions">
            <button>Add List</button>
        </div>
        <section class="board-lists">
            <list v-for="list in lists" :key=list._id :list="list"> </list>
        </section>
        
    </section>
</template>

<script>
import List from '../components/List.vue';

export default {
  name: 'board',
  computed: {
    lists() {
      return this.$store.getters.listsToShow;
    }
  },
  methods: {},
  created() {
    this.$store.dispatch("loadLists");
    // console.log('the board.vue has gotten these lists: ',this.lists);
  },
  components: {
     List,
  }
}
</script>
