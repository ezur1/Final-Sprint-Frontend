// 'use strict'

// import itemService from '../services/item.serivce.js'

// export default {
//     state: {
//         items: []
//     },
//     mutations: {
//         setItems(state, { items }) {
//             state.items = items
//         }
//     },
//     getters: {
//         itemsToShow(state) {
//             return state.items
//         }
//     },
//     actions: {
//         loadItems(context) {
//             return itemService.query()
//                 .then(items => context.commit({ type: 'setItems', items }));
//         }
//     }
// }