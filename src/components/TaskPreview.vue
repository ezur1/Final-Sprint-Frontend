<template>
    <section class="task-preview flex col">
        <div class="preview-header flex space-between">
            <div class="task-mid-info">
                <h1>{{task.title}}</h1>
                <span>{{task.createdBy}}</span>
            </div>
            
        </div>
        <div class="preview-body flex space-between">
            <div class="preview-main">
               <section class="description">
                   <h3>Description</h3>
                   <textarea name="description" @click="showDescBtns()"></textarea>
                   <div v-if="isDescBtns" class="descBtns">
                       <button>Save</button>
                       <button>X</button>
                   </div>
               </section>
               <section class="tasks">
                   <h3>Tasks</h3>
                   <div v-if="isDescBtns" class="descBtns">
                       <button>Save</button>
                       <button>X</button>
                   </div>
               </section>
            </div>
            <div class="preview-sidebar flex col">
                <div class="add-to-card flex col">
                    <h3>ADD TO CARD</h3>
                    <a href="#" title="Labels" class="prev-side-btn"><span>Labels</span></a>
                    <a href="#" title="Check List" class="prev-side-btn"><span>Checklist</span></a>
                    <a href="#" title="Due Date" class="prev-side-btn"><span>Due Date</span></a>
                </div>
                <div class="actions-on-card flex col">
                    <h3>ACTIONS</h3>
                    <a href="#" title="Move" class="prev-side-btn"><span>Move</span></a>
                    <a href="#" title="Copy" class="prev-side-btn"><span>Copy</span></a>
                    <a href="#" title="Delete" class="prev-side-btn"><span>Delete</span></a>
                </div>
            </div> 
        </div>
    </section>
</template>

<script>

export default {
    data(){
        return{
            isDescBtns:false
        }
    },
    methods:{
    showDescBtns(){
        console.log("fuk");
        this.isDescBtns=true;
    }
},
computed:{
    task(){
        console.log(this.$store.getters.currTask);
        
        return this.$store.getters.currTask;
    }
}
}
</script>