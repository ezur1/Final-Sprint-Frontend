<template>
  <div v-if="task" class="task" @click="showTaskDetails(task.id)">
    <div class="task-preview flex col space-between">
      <div v-if="task.tags.length!==0" class="tags flex">
        <div v-for="tag in task.tags" :key="tag" :class="tag" class="tag-preview">
        </div>
      </div> 
      <div class="flex space-between">
        <div class="task-title">{{task.title}}</div>
      </div>
  
    </div>
  </div>
</template>
<script>
import {eventBus} from '../main.js'
export default {
  props: ['topic', 'task'],
  data() {
    return {};
  },
  methods: {
    removeTask(taskTitle) {
      eventBus.$emit('removeTask', { topicTitle: this.topic.title, taskTitle: taskTitle });
    },
    showTaskDetails(taskId) {
      eventBus.$emit('showTaskDetails', { taskId,topicTitle: this.topic.title});
    }
  },
  components: {}
};
</script>

