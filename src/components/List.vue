<template>
  <section>
    <form v-if="isShowForm" @submit.prevent="edit" class="card edit-card">
      edit list title:
      <input type="text" v-model="newList.title" />
      <button type="submit">save</button>
    </form>

    <div class="list-wraper">
      <div class="list-content flex col">
        <div class="list-header">
          {{list.title}}
          <button @click="showForm()">edit</button>
        </div>

        <div class="list-items">
          <draggable v-model="items">
            <transition-group>
              <Item v-for="item in items" :item="item" :key="item._id" class="list-item" />
            </transition-group>
          </draggable>
        </div>

        <div class="list-item-composer">Item - Composer</div>
      </div>
      <button @click="remove(list._id)">delete</button>
    </div>
  </section>
</template>

<script>
import Draggable from "vuedraggable";
import Item from "@/components/Item";
export default {
  props: ["list"],
  data() {
    return {
      val: null,
      newList: {
        title: ""
      },

      isShowForm: false
    };
  },
  methods: {
    showForm() {
      this.isShowForm = true;
    },
    remove(listId) {
      this.$store.dispatch({ type: "removeList", listId });
    },
    edit() {
      this.newList._id = this.list._id;
      this.$store.dispatch({ type: "updateList", list: this.newList });
    }
  },
  computed: {
    items: {
      get() {
        // console.log('the val is: ', this.val);
        return this.$store.getters.itemsToShow;
      },
      set(list) {
        this.val = list;
        this.$store.dispatch({ type: "updateItemOrder", items: list });
      }
    }
  },
  components: {
    Draggable,
    Item
  },
  created() {
    this.$store.dispatch("loadItems");
    console.log("the list.vue has gotten these items: ", this.items);
  },
  watch: {
    value(newVal) {
      this.val = newVal;
    }
  }
};
</script>