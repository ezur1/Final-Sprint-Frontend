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
          <p>{{list.title}}</p>
          <button @click="showForm()">edit</button>
        </div>

        <div class="list-items">
          <draggable v-model="listItems">
            <transition-group>
              <Item v-for="item in listItems" :item="item" :key="item.id" class="list-item" />
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
      newList: {
        title: ""
      },
      listItems: [
        { id: "a", title: "HELLO" },
        { id: "b", title: "WORLD" },
        { id: "c", title: "OF" },
        { id: "d", title: "MAGIC" }
      ],
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
      this.$store.dispatch({type: "updateList" ,list: this.newList});
    }
  },
  components: {
    Draggable,
    Item
  }
};
</script>