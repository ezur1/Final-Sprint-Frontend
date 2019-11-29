<template>
    <div v-if="task" class="task" @click="showTaskDetails(task.id)"> 
        <div class="task-details flex space-between">
            <!-- <div class="labels"></div> -->
            <div class="task-title">{{task.title}}</div>
            <!-- <div class="tags"></div> -->
            <button @click.stop="removeTask(task.title)">X</button>
        </div>
    </div>
</template>

<script>
export default {
    props:['topic','task'],
    data(){
        return{
        }
    },
    methods:{
        removeTask(taskTitle){
            this.$emit('taskToTopicRemoveTask', {topicTitle: this.topic.title, taskTitle:taskTitle});
        },
        showTaskDetails(taskId){
            this.$emit('taskToTopicShowTaskDetails', {taskId, topicTitle: this.topic.title}) 
        }
    },
    components:{
    },
}
</script>