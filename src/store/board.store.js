'use strict'

import listService from '../services/list.service.js'

export default {
    state: {
        lists: []
    },
    mutations: {
        setLists(state, { lists }) {
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
                .then(lists => {
                    // console.log('the board.store is getting these lists: ', lists);

                    return context.commit({ type: 'setLists', lists });
                })
        }
    }
}