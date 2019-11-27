<template>
  <div class="list-wraper">
    <div class="list-content flex col">
      <div class="list-header">{{list.title}}</div>
      <div v-if="items" class="list-items">
        <draggable v-model="items">
          <transition-group>
            <Item v-for="item in items" :item="item" :key="item._id" class="list-item" />
          </transition-group>
        </draggable>
      </div>
      <div class="list-item-composer">Item - Composer</div>
    </div>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
import Item from "@/components/Item";
export default {
  props: ["list"],
  data(){
return {
  val:null
}
  },
  computed: {
    items:{
      get()
        {
          // console.log('the val is: ', this.val);
          return this.$store.getters.itemsToShow;
        },
        set(list)
        {
          this.val = list
          this.$store.dispatch({type: "updateItemOrder", items:list});
        }
    }
  },
  components: {
    Draggable,
    Item
  },
  created() {
    this.$store.dispatch("loadItems");
    console.log('the list.vue has gotten these items: ',this.items);
    
  },
  watch: {
   value(newVal) {
       this.val = newVal
   }
}
};
</script>