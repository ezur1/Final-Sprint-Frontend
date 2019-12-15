<template>
    <section class="mobile-nav-container flex">
        <div @click="openSearchModal" class="board-search justify-center flex align-center">
            <font-awesome-icon
            class="search-icon"
            icon="search"
            />
            <span>Search</span>
            <input
            ref="filter"
            @keyup="filter"
            v-if="isSearchModal"
            type="text"
            @click.stop
            placeholder="search for a task"
            />
            <transition name="fade">
                <div v-if="isSearchModal" class="search-modal">
                    <h1>search results</h1>
                    <h3
                    @click="openTaskDetails(task.taskId)"
                    v-for="task in filterRes"
                    :key="task.taskId"
                    >
                    {{ task.taskTitle }}
                    </h3>
                </div>
            </transition>
      </div>
      <div class="board-add-topic flex justify-center align-center">
            <span>+Add Topic</span>
      </div>
      <div @click="openSideMenu()" class="board-menu flex justify-center align-center">
            <span>Menu</span>
      </div>
    </section>
</template>


<script>
import { eventBus } from '../main.js';
export default {
    props:['currBoard'],
    data(){
        return{
            isSearchModal: false,
            filterRes : ''
        }
    },
    methods: {
        filter() {
            this.filterRes = null;
            var searchRes = [];
            let filterBy = this.$refs.filter.value;
            let titles = this.currBoard.topics.map(topic => {
                let res = { topicTitle: topic.title };
                res.taskTitles = topic.tasks.map(task => {
                    let taskObj = { title: '', id: '' };
                    taskObj.title = task.title;
                    taskObj.id = task.id;
                    return taskObj;
                });
                return res;
            });
            // console.log(titles);
            
            return titles.map(topicTitle => {
                let topic = topicTitle.topicTitle;
                return topicTitle.taskTitles.filter(taskTitle => {
                    var regex = new RegExp(filterBy, 'i');
                    if (regex.test(filterBy) === regex.test(taskTitle.title)) {
                    searchRes.push({
                        topic: topic,
                        taskTitle: taskTitle.title,
                        taskId: taskTitle.id
                    });
                    this.filterRes = searchRes;
                    }
                });
            });
        },
        openSearchModal() {
            this.isSearchModal = !this.isSearchModal;
            this.filterRes = null;
        },
        openSideMenu(){
            eventBus.$emit('openSideMenu')
        }    
    },
}
</script>