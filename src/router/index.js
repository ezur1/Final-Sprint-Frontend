import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Board from '../views/Board.vue'
import TaskDetails from '../components/TaskDetails.vue'
import TaskFloApp from '../views/TaskFloApp.vue'
import SignIn from '../views/SignIn.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/taskfloapp',
        name: 'taskfloapp',
        component: TaskFloApp
    },
    {
        path: '/signin',
        name: 'signin',
        component: SignIn
    },
    {
        path: '/about',
        name: 'about',
        component: About
    },
    {
        path: '/boards/:boardId?',
        name: 'board',
        component: Board,
        children: [{
            path: 'tasks/:taskId?',
            name: 'task',
            props: true,
            component: TaskDetails
        }]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router