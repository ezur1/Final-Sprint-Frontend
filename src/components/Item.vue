<template>
    <div v-if="item" class="list-item" @click="openItemModal()"> 
        <div class="list-item-details">
            <!-- <div class="labels"></div> -->
            <div class="list-item-title">{{item.title}}</div>
            <!-- <div class="tags"></div> -->
        </div>
        {{item.name}}
    </div>
</template>

<script>
// import { bus } from '../main'

export default {
    props:['item'],
    components:{},
    methods:{
        openItemModal(){
            console.log(this.item);
        }
    }
}
</script>