'use strict'

import listService from '../services/list.service.js'

export default {
    state: {
        lists: []
    },
    mutations: {
        addList(state, { addedList }) {
            state.lists.push(addedList);
        },
        setlists(state, { lists }) {
            state.lists = lists
        }
    },
    getters: {
        listsToShow(state) {
            return state.lists
        }
    },
    actions: {
        loadLists(context) {
            // console.log('getting here');

            return listService.query()
                .then(lists => context.commit({ type: 'setlists', lists }));
        },
        addList(context, { list }) {
            return listService.add(list)
                .then(addedList => context.commit({ type: 'addList', addedList }))
        }
    }
}