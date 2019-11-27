<template>
    <section>
        <div class="actions">
            <button>Add List</button>
        </div>
        <section class="board-lists">
            <List/>
        </section>
        
    </section>
</template>

<script>
// import Draggable from 'vuedraggable'
import List from '@/components/List.vue'
export default {
     components: {
            // Draggable,
            List
        },
}
</script>
