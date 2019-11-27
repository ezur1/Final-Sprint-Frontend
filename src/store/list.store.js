'use strict'

import itemService from '../services/item.serivce.js'

export default {
    state: {
        items: []
    },
    mutations: {
        setItems(state, { items }) {
            // console.log('THIS IS NOT OK: the mutation is getting the items like this: ', items);
            state.items = items
        }
    },
    getters: {
        itemsToShow(state) {
            return state.items
        }
    },
    actions: {
        loadItems(context) {
            return itemService.query()
                .then(items => {
                    // console.log('A', items);
                    return context.commit({ type: 'setItems', items })
                });
        },
        updateItemOrder(context, { items }) {
            // console.log('B', items);
            return context.commit({ type: 'setItems', items })
        }
    }
}