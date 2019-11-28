<template>
  <section>
    <form v-if="isShowForm" @submit.prevent="save(topic.title)" class="card edit-card">
      edit topic title:
      <input type="text" v-model="newTopic.title" />
      <button type="submit">save</button>
    </form>

    <div class="list-wraper">
      <div class="list-content flex col">
        <div class="list-header">
          {{topic.title}}
          <button @click="showForm()">edit</button>
        </div>

        <div class="list-items">
          <draggable v-model="tasks">
            <transition-group>
              <Task v-for="task in tasks" :task="task" :key="task._id" class="list-item" />
            </transition-group>
          </draggable>
        </div>

        <div class="list-item-composer">Item - Composer</div>
      </div>
      <button @click="remove()">delete</button>
    </div>
  </section>
</template>

<script>
import Draggable from "vuedraggable";
import Task from "@/components/Task";
export default {
  props: ['topic', 'tasks'],
  data() {
    return {
      // val: null,
      newTopic: {
        title: ""
      },

      isShowForm: false
    };
  },
  methods: {
    showForm() {
      this.isShowForm = true;
    },
    remove() {
      this.$emit('removeTopic')
    },
    save(topicTitle) {
      this.$emit('updateTopic', {oldTitle: topicTitle, newTitle: this.newTopic.title})
      // this.newTopic.id = this.topic.id;
      // this.$store.dispatch({ type: "updateTopic", topic: this.newTopic });
    }
  },
  computed: {
    // items: {
    //   get() {
    //     // console.log('the val is: ', this.val);
    //     return this.list;
    //   },
    //   set(list) {
    //     this.val = list;
    //     this.$store.dispatch({ type: "updateItemOrder", items: list });
    //   }
    // }
  },
  components: {
    Draggable,
    Task
  },
  created() {},
  // watch: {
  //   value(newVal) {
  //     this.val = newVal;
  //   }
  // }
};
</script>