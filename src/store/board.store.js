'use strict'

import boardService from '../services/board.service.js'

export default {
    state: {
        boards: [],
        currBoard: null
    },
    mutations: {
        setBoards(state, { boards }) {
            state.boards = boards;
        },

        setCurrBoard(state, { board }) {
            state.currBoard = board
        }
    },
    getters: {
        boardsToShow(state) {
            return state.boards
        }
    },
    actions: {
        loadBoards(context) {
            return boardService.query()
                .then(boards => {
                    return context.commit({ type: 'setBoards', boards })
                });
        },
        setCurrBoard(context, board) {
            return context.commit({ type: 'setCurrBoard', board })
        },
        updateBoard(context, { board }) {
            return boardService.update(board)
                .then(() => {
                    return boardService.query()
                        .then(boards => {
                            return context.commit({ type: 'setBoards', boards })
                        })
                })
        },
    }
}

// updateItemOrder(context, { items }) {
//     // return listService.update()
//     // .then(list => {
//     // console.log('B', items);
//     return context.commit({ type: 'setItems', items })
// }

// updateTopic(context, { topic }) {

//     console.log('topic in board store actions', topic)
//     return listService.update(topic)
//         .then(updatedTopic => {
//             console.log('updatedTopic', updatedTopic);
//             return context.commit({ type: 'updateTopic', tpoic: updatedTopic })
//         })
// },