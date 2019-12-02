'use strict'

import boardService from '../services/board.service.js'

export default {
    state: {
        boards: [],
        currBoard: null,
        currTask: null,
        currTopicTitle: null
    },
    mutations: {
        setCurrTask(state, { foundTask }) {
            state.currTask = foundTask;
        },
        setBoards(state, { boards }) {
            state.boards = boards;
        },
        setCurrBoard(state, { board }) {
            state.currBoard = board
        },
        setCurrTopicTitle(state, topicTitle) {
            state.currTopicTitle = topicTitle;
        }
    },
    getters: {
        boardsToShow(state) {
            return state.boards
        },
        currTask(state) {
            return state.currTask;
        },
        currBoard(state) {
            return state.currBoard
        },
        usersOnBoard(state) {
            return state.currBoard.usersOnBoard
        },
    },
    actions: {
        async loadBoards(context) {
            var boards = await boardService.query()
            context.commit({ type: 'setBoards', boards })
            return boards
        },
        async getBoardById(context, { boardId }) {
            var board = await boardService.getById(boardId)
            context.commit({ type: 'setCurrBoard', board })
            const loggedInUser = JSON.parse(sessionStorage.user);
            if (loggedInUser) { ///// "IF" becuase what happens if someone got to this URL in another way...
                var userIdxInUsersOnBoard = _findUserIndexInUsersOnBoard(board.usersOnBoard, loggedInUser._id);
                if (userIdxInUsersOnBoard === -1) {
                    board.usersOnBoard.push(loggedInUser)
                    context.dispatch({ type: "updateBoard", board: board });
                    return board
                }
            }
            return board
        },
        async getTaskById(context, { boardId, taskId, topicTitle }) {
            var board = await boardService.getById(boardId) ///// maybe it would be better to use the state's "currBoard"....
                ////// DONT KNOW WHERE TO GET THE "topicTitle" IF USER GOT HERE VIA BOOKMARK ///////
            var topicIdx = _findTopicIndex(board, topicTitle);
            var foundTask = board.topics[topicIdx].tasks.find(task => task.id === taskId);
            context.commit({ type: 'setCurrTopicTitle', topicTitle });
            context.commit({ type: 'setCurrTask', foundTask });
            return foundTask
        },

        async updateBoard(context, { board }) {
            await boardService.update(board)
            var updatedBoard = await boardService.getById(board._id)
            context.commit({ type: 'setCurrBoard', board: updatedBoard })
            return updatedBoard
        },
        async addTopic(context, { board, newTopic }) {
            board.topics.push(newTopic)
            await context.dispatch({ type: "updateBoard", board: board });
            return board
        },
        async removeTopic(context, { board, topicTitle }) {
            var idx = _findTopicIndex(board, topicTitle);
            board.topics.splice(idx, 1);
            await context.dispatch({ type: "updateBoard", board: board });
            return board
        },
        async updateTopic(context, { board, oldTitle, newTitle }) {
            var idx = _findTopicIndex(board, oldTitle);
            board.topics[idx].title = newTitle;
            await context.dispatch({ type: "updateBoard", board: board });
            return board
        },
        async updateTopicColor(context, { board, topicTitle, color }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            board.topics[topicIdx].color = color;
            await context.dispatch({ type: "updateBoard", board: board });
            return board
        },
        async updateTaskTitle(context, { board, topicTitle, newTitle, oldTitle }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, oldTitle);
            board.topics[topicIdx].tasks[taskIdx].title = newTitle;
            await context.dispatch({ type: "updateBoard", board: board });
            return board
        },
        async updateTaskDescription(context, { board, topicTitle, taskTitle, taskDescription }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
            board.topics[topicIdx].tasks[taskIdx].description = taskDescription;
            await context.dispatch({ type: "updateBoard", board: board });
            return board
        },
        async updateTaskTags(context, { board, topicTitle, taskTitle, tag }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
            var currTagIdx = board.topics[topicIdx].tasks[taskIdx].tags.findIndex(currTag => currTag === tag);

            if (currTagIdx === -1) {
                board.topics[topicIdx].tasks[taskIdx].tags.push(tag);
                await context.dispatch({ type: "updateBoard", board: board });
                return board
            } else {
                board.topics[topicIdx].tasks[taskIdx].tags.splice(currTagIdx, 1);
                await context.dispatch({ type: "updateBoard", board: board });
                return board
            }
        },
        async addTask(context, { board, topicTitle, newTask }) {
            var idx = _findTopicIndex(board, topicTitle);
            console.log('this is the board: ', board.title);

            console.log('this is the index: ', idx);
            board.topics[idx].tasks.push(newTask);
            await context.dispatch({ type: "updateBoard", board: board });
            return board
        },
        async removeTask(context, { board, topicTitle, taskTitle }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
            board.topics[topicIdx].tasks.splice(taskIdx, 1);
            await context.dispatch({ type: "updateBoard", board: board });
            return board
        },
        async updateTaskOrder(context, { topicTitle, tasks }) {
            var board = context.getters.currBoard;
            var topicIdx = _findTopicIndex(board, topicTitle);
            board.topics[topicIdx].tasks = tasks
            await context.dispatch({ type: "updateBoard", board: board });
            return board
        },
        async updateTopicOrder(context, { topics }) {
            var board = context.getters.currBoard;
            board.topics = topics
            await context.dispatch({ type: "updateBoard", board: board });
            return board
        },
        async removeUserFromBoards(context) {
            var loggedInUserId = context.getters.loggedInUser._id;
            var boards = await boardService.query()
            boards.forEach(board => {
                var usersOnBoard = board.usersOnBoard;
                var userIdxInUsersOnBoard = _findUserIndexInUsersOnBoard(usersOnBoard, loggedInUserId);
                if (userIdxInUsersOnBoard !== -1) {
                    board.usersOnBoard.splice(userIdxInUsersOnBoard, 1);
                    context.dispatch({ type: "updateBoard", board: board });
                }
            })
        }
    }
}

function _findTopicIndex(board, term) {
    return board.topics.findIndex(topic => topic.title === term);
}

function _findTaskIndex(board, topicIdx, term) {
    return board.topics[topicIdx].tasks.findIndex(task => task.title === term);
}

function _findUserIndexInUsersOnBoard(usersOnBoard, loggedInUserId) {
    return usersOnBoard.findIndex(user => user._id === loggedInUserId);
}