<template>
  <!-- <div v-if="task" class="task" v-touch:longtap.prevent="longtapHandler" @click="showTaskDetails(task.id)"> -->
  <div v-if="task" class="task" @click="showTaskDetails(task.id)">
    <div class="task-preview flex col space-between">
      <div v-if="task.tags.length!==0" class="tags flex">
        <div v-for="tag in task.tags" :key="tag" :class="tag" class="tag-preview">
        </div>
      </div> 

      <div class="flex col space-between">
        <div class="task-title">{{task.title}}</div>
        <div v-if="task.imgUrls.length>0">
          <img class="task-preview-image" :src="task.imgUrls[0]" />
        </div>
      </div>
      <section class="flex space-between align-c indicators">
      <div v-if="task.dueDate" class="due-date">
        <font-awesome-icon class="icon" icon="clock" />
        {{task.dueDate | moment("MMM D")}}
      </div> 
      <div v-if="task.checkLists.length>0" class="checklist">
        <font-awesome-icon class="icon" icon="check-square" />
        {{checkListStats}}
      </div>   
      <div v-if="task.members.length!==0" class="members flex">
        <div v-for="member in task.members" :key="member._id" class="member-preview" @click="removeMemberFromTask(task.title, member._id)">
            <Avatar :size="30" :username="member.fullName"></Avatar>
        </div>
      </div>
      </section>
    </div>
  </div>
</template>
<script>
import {eventBus} from '../main.js'
import Avatar from 'vue-avatar'

export default {
  props: ['topic', 'task'],
  data() {
    return {};
  },
  computed: {
    checkListStats() {
      var counters = {
          total: 0,
          done: 0
      }
      this.task.checkLists.forEach(checkList =>{
        counters.total+=checkList.todos.length
        checkList.todos.forEach(todo => {
            if (todo.isDone) {
                counters.done++
            }  
        })
      })
      return `${counters.done}/${counters.total}`
    }
  },
  methods: {
    longtapHandler(){
      // console.log('long tap has been detected');
    },
    showTaskDetails(taskId) {
      eventBus.$emit('showTaskDetails', { taskId,topicTitle: this.topic.title});
    },
    removeMemberFromTask(taskTitle, memberId){
      eventBus.$emit("removeMemberFromTask", {
        topicTitle: this.topic.title,
        taskTitle,
        memberId
      });
    }
  },
  components: {
    Avatar
  }
};
</script>

