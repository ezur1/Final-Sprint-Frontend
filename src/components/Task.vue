<template>
    <div v-if="task" class="list-item" @click="openTaskModal()"> 
        <div class="list-item-details">
            <!-- <div class="labels"></div> -->
            <div class="list-item-title">{{task.title}}</div>
            <!-- <div class="tags"></div> -->
        </div>
        {{task.name}}
    </div>
</template>

<script>

export default {
    props:['task'],
    components:{},
    methods:{
        openTaskModal(){
            console.log(this.task);
        }
    }
}
</script>