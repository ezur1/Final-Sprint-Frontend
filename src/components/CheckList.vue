<template>
    <section class="checkList-container">
        <h3 v-if="checkList" class="checkList-title">{{checkList.title}}</h3>
    
        <input type="text" placeholder="add a todo" v-model="newTodo">
        <button @click="addTodo">add</button>
        <p>{{newTodo}}</p>
    </section>
</template>

<script>
export default {
    name:'CheckList',
    props:['checkList'],
    data(){
        return{
            newTodo:''
        }
    },
    methods:{
        addTodo(){
            console.log('yessssssssssssssssssssssssss');
        }
    },
    created(){
        console.log('CheckList in CheckList.vue ',this.checkList.title);
        
    }
}
</script>