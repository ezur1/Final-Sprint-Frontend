import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Board from '../views/Board.vue'
import SignIn from '../views/SignIn.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: Home
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
        path: '/board/:id?',
        name: 'board',
        component: Board
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router