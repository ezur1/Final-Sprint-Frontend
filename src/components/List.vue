<template>
    <div class="list-wraper"> 
        <div class="list-content flex col">
            <div class="list-header">List - Header</div>
            <div class="list-items">
                <draggable v-model="listItems">
                    <transition-group>
                        <Item v-for="item in listItems" :item="item" :key="item.id" class="list-item"/>
                    </transition-group>
                </draggable>
            </div>
            <div class="list-item-composer">Item - Composer</div>
        </div> 
    </div>
</template>

<script>
import Draggable from 'vuedraggable'
import Item from '@/components/Item'
export default {
    data(){
        return {
            listItems:[{id:"a",title:"HELLO"},{id:"b",title:"WORLD"},{id:"c",title:"OF"},{id:"d",title:"MAGIC"}]
        }
    },
    components: {
        Draggable,
        Item
    },
}
</script>