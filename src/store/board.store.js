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
        },
        removeList(state, { listId }) {
            const idx = state.lists.findIndex(list => list._id === listId);
            state.lists.splice(idx, 1);
            
          },
          updateList(state, { updatedList, id  }) {
            const idx = state.lists.findIndex(list => list._id === id);
            state.lists.splice(idx, 1, updatedList);
          },
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
        },
        removeList(context, { listId }) {
            listService.remove(listId)
                .then(() => context.commit({ type: 'removeList', listId }))
        },
        updateList(context, { list  }) {
            
            console.log('list in board store actions',list)
            return listService.update(list)
              .then(updatedList => {
                  console.log('updatedList',updatedList);
                  return context.commit({ type: 'updateList', list:updatedList })
                })
          },
    }
}