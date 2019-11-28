<template>
    <section v-if="topics">
        <div class="actions">
            <button  @click="openForm()">Add Topic</button>
            <form v-if="isAddTopic" @submit.prevent="addTopic" class="card edit-card">
              add topic title:
              <input  type="text" v-model="newTopic.title" />
              <button type="submit">Add</button>
             </form>
        </div>
        <section class="board-lists">
            <topic  v-for="topic in topics" :key=topic.id :topic="topic" :tasks="topic.tasks" @removeTopic="removeTopic"/>
        </section>
        
    </section>
</template>

<script>
import Topic from '../components/Topic.vue';

export default {
  props:['board', 'topics'],
  data(){
    return{
      isAddTopic:false,
      newTopic:{
        title:'',
      }
    }
  },
  name: 'board',
  computed: {},
  methods: {
     addTopic() {
      var boardToEdit = JSON.parse(JSON.stringify(this.board))
      var newTopicEdit = JSON.parse(JSON.stringify(this.newTopic))
      boardToEdit.topics.push(newTopicEdit)
      this.$store.dispatch({ type: "updateBoard", board: boardToEdit});
      this.newTopic.title='';
      this.openForm()
    },
    removeTopic(topicId) {
      var boardToEdit = JSON.parse(JSON.stringify(this.board))
      var idx = boardToEdit.topics.findIndex(topic=> topic.id === topicId)
      boardToEdit.topics.splice(idx,1)
      this.$store.dispatch({ type: "updateBoard", board: boardToEdit });
    },
    openForm(){
      this.isAddTopic=!this.isAddTopic;
    },
  },
  created() {
    this.$store.dispatch("setCurrBoard", this.board);
  },
  components: {
     Topic,
  }
}
</script>
