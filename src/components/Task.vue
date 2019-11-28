<template>
    <div v-if="task" class="task" @click="setCurrTask()"> 
        <div class="task-details">
            <!-- <div class="labels"></div> -->
            <div class="task-title">{{task.title}}</div>
            <!-- <div class="tags"></div> -->
        </div>
        {{task.name}}
    </div>
</template>

<script>
export default {
    props:['task'],
    data(){
        return{
        }
    },
    methods:{
        setCurrTask(){
            this.$store.dispatch({ type: "setCurrTask", task: this.task });
        }
    },
    components:{
    },
}
</script>