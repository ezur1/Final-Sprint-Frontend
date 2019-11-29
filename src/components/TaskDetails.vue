<template>
  <section v-if="task" class="task-preview flex col">
    <div class="preview-header flex space-between">
      <span>{{task.foundTask.title}}</span>
      <span>{{task.foundTask.createdBy}}</span>
      <span>{{task.foundTask.id}}</span>
    </div>
    <div class="preview-body flex space-between">
      <div class="preview-main">
        <section class="description"></section>
      </div>
      <div class="preview-sidebar">
        <div>yes</div>
        <div>yes</div>
        <div>yes</div>
        <div>yes</div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ['topicTitle'],
  computed: {
    task() {
       return this.$store.getters.currTask; 
      //  return task.foundTask
    }
  },
  created() {
    var boardId = this.$route.params.boardId;
    var taskId = this.$route.params.taskId;
    var topicTitle = this.topicTitle
    this.$store.dispatch({ type: "getTaskById", boardId, taskId, topicTitle })
  }
};
</script>