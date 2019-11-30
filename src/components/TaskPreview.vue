<template>
  <div v-if="task" class="task" @click="showTaskDetails(task.id)">
    <div class="task-details flex space-between">
      <!-- <div class="labels"></div> -->
      <div class="task-title">{{task.title}}</div>
      <!-- <div class="tags"></div> -->
      <font-awesome-icon icon="times" @click.stop="removeTask(task.title)"/>
    </div>
  </div>
</template>
<script>
export default {
  props: ['topic', 'task'],
  data() {
    return {};
  },
  methods: {
    removeTask(taskTitle) {
      this.$emit("taskToTopicRemoveTask", {
        topicTitle: this.topic.title,
        taskTitle: taskTitle
      });
    },
    showTaskDetails(taskId) {
      console.log('this is topic at taskprev',this.topic.title);
      console.log('this is topic at taskId',taskId);
      this.$emit("taskToTopicShowTaskDetails", {taskId,topicTitle: this.topic.title});
    }
  },
  components: {}
};
</script>

