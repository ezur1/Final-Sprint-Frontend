import Vue from 'vue'
import Vuex from 'vuex'

import boardStore from './board.store.js'
// import userStore from './user.store'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        boardStore
        // userStore

    }
})