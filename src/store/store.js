import Vue from 'vue'
import Vuex from 'vuex'

import boardStore from './board.store.js'
import listStore from './list.store'
import itemStore from './item.store'
import userStore from './user.store'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        boardStore,
        listStore,
        itemStore,
        userStore
    }
})