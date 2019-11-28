<template>
  <section v-if="currBoard">
    <div class="actions">
      <button @click="openForm()">Add Topic</button>
      <form v-if="isAddTopic" @submit.prevent="addTopic" class="card edit-card">
        add topic title:
        <input type="text" v-model="newTopic.title" />
        <button type="submit">Add</button>
      </form>
    </div>
    <section class="board-lists">
      <topic
        v-for="topic in currBoard.topics"
        :key="topic.id"
        :topic="topic"
        :tasks="topic.tasks"
        @removeTopic="removeTopic(topic.title)"
        @updateTopic="updateTopic"
        @addTask="addTask"
        @showPreview="showPreview"
      />     
    </section>
  </section>
</template>

<script>
import Topic from "../components/Topic.vue";
import TaskPreview from "@/components/TaskPreview";
export default {
  data(){
    return{
      isAddTopic:false,
      isPreviewTask: false,
      newTopic:{
        title:'',
      }
    };
  },
  name: "board",
  computed: {
    currBoard() {
      return this.$store.getters.getCurrBoard;
    }
  },
  methods: {
    addTopic() {
      var boardToEdit = JSON.parse(JSON.stringify(this.currBoard));
      var newTopicEdit = JSON.parse(JSON.stringify(this.newTopic));
      boardToEdit.topics.push(newTopicEdit);
      this.$store.dispatch({ type: "updateBoard", board: boardToEdit });
      this.newTopic.title = "";
      this.openForm();
    },
    removeTopic(topicTitle) {
      var boardToEdit = JSON.parse(JSON.stringify(this.currBoard));
      var idx = boardToEdit.topics.findIndex(
        topic => topic.title === topicTitle
      );
      boardToEdit.topics.splice(idx, 1);
      this.$store.dispatch({ type: "updateBoard", board: boardToEdit });
    },
    updateTopic(payload) {
      var boardToEdit = JSON.parse(JSON.stringify(this.currBoard));
      var idx = boardToEdit.topics.findIndex(
        topic => topic.title === payload.oldTitle
      );
      boardToEdit.topics[idx].title = payload.newTitle;
      this.$store.dispatch({ type: "updateBoard", board: boardToEdit });
    },
    addTask(payload) {
      console.log("received from emission, this is the new task: ", payload);
      console.log('this is the topic to add the new task in: ',payload.topic);
      console.log('this is the new task title: ',payload.newTaskTitle);
      
    },
    showPreview(){
      console.log('ahao');
      this.isPreviewTask=true;
    },
    openForm() {
      this.isAddTopic = !this.isAddTopic;
    }
  },
  created() {
    var id = this.$route.params.id;
    this.$store.dispatch({ type: "getBoardById", boardId: id });
  },
  components: {
    Topic,
    TaskPreview
  }
};
</script>
