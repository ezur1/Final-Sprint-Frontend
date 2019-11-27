
import listService from '../services/list.service.js'

export default {
    state: {
        lists: []
    },
    mutations: {
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
            return listService.query()
                .then(lists => context.commit({ type: 'setlists', lists }));
        }
    }
}