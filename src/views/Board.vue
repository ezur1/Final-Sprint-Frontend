<template>
    <section v-if="lists">
        <div class="actions">
            <button  @click="openForm()">Add List</button>
            <form v-if="isAddList" @submit.prevent="addList" class="card edit-card">
              add list title:
              <input type="text" v-model="newList.title" />
              <button type="submit">Add</button>
             </form>
        </div>
        <section class="board-lists">
            <list v-for="list in lists" :key=list._id :list="list"> </list>
        </section>
        
    </section>
</template>

<script>
import List from '../components/List.vue';

export default {
  data(){
    return{
      isAddList:false,
      newList:{
        title:'',
      }
    }
  },
  name: 'board',
  computed: {
    lists() {
      return this.$store.getters.listsToShow;
    }
  },
  methods: {
    addList() {
      this.$store.dispatch({ type: "addList", list: this.newList });
    },
    openForm(){
      this.isAddList=true
    }
  },
  created() {
    this.$store.dispatch("loadLists");
    // console.log('the board.vue has gotten these lists: ',this.lists);
  },
  components: {
     List,
  }
}
</script>
