<template>
    <section class="task-preview flex col">
        <div class="preview-header flex space-between">
            <span>{{task.title}}</span>
            <span>{{task.createdBy}}</span>
        </div>
        <div class="preview-body flex space-between">
            <div class="preview-main">
               <section class="description">
                   
               </section>
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
computed:{
    task(){
        console.log(this.$store.getters.currTask);
        
        return this.$store.getters.currTask;
    }
}
}
</script>