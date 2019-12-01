'use strict'

import boardService from '../services/board.service.js'

export default {
    state: {
        boards: [],
        currBoard: null,
        currTask: null,
        currTopicTitle:null
    },
    mutations: {
        setCurrTask(state, {foundTask}) {
            console.log('setting currTask:',foundTask);
            state.currTask = foundTask;
        },

        setBoards(state, { boards }) {
            state.boards = boards;
        },

        setCurrBoard(state, { board }) {
            state.currBoard = board
        },
        setCurrTopicTitle(state,topicTitle){
            console.log('setting CurrTopicTitle:',topicTitle);

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
        getCurrBoard(state) {
            return state.currBoard
        },
        getCurrTopicTitle(state){
            return state.currTopicTitle
        }
    },
    actions: {
        loadBoards(context) {
            return boardService.query()
                .then(boards => {
                    return context.commit({ type: 'setBoards', boards })
                });
        },
        getBoardById(context, { boardId }) {
            return boardService.getById(boardId)
                .then(board => {
                    context.commit({ type: 'setCurrBoard', board })
                })
        },
        getTaskById(context, { boardId, taskId, topicTitle }) {
            return boardService.getById(boardId) ///// maybe it would be better to use the state's "currBoard"....
                .then(board => {
                    console.log('this is the Board ID: ', boardId);
                    console.log('this is the topicTitle: ', topicTitle);
                    console.log('this is the taskID: ', taskId);
                    // var board = context.getters.getCurrBoard; ///// but what if someone tries to access a taskDetails URL?
                    ////// DONT KNOW WHERE TO GET THE "topicTitle" FROM IN SUCH A CASE! ///////
                    var topicIdx = _findTopicIndex(board, topicTitle);
                    var foundTask = board.topics[topicIdx].tasks.find(task => task.id === taskId);
                    console.log('this is the foundTask: ', foundTask);
                    context.commit({type:'setCurrTopicTitle',topicTitle});
                    context.commit({ type: 'setCurrTask', foundTask });
                })
        },
        updateBoard(context, { board }) {
            console.log(board);
            
            return boardService.update(board)
                .then(() => {
                    return boardService.getById(board._id)
                        .then(board => {
                            return context.commit({ type: 'setCurrBoard', board })
                        })
                })
        },
        addTopic(context, { board, newTopic }) {
            board.topics.push(newTopic)
            context.dispatch({ type: "updateBoard", board: board });
        },
        removeTopic(context, { board, topicTitle }) {
            var idx = _findTopicIndex(board, topicTitle);
            board.topics.splice(idx, 1);
            context.dispatch({ type: "updateBoard", board: board });
        },
        updateTopic(context, { board, oldTitle, newTitle }) {
            var idx = _findTopicIndex(board, oldTitle);
            board.topics[idx].title = newTitle;
            context.dispatch({ type: "updateBoard", board: board });
        },
        updateTaskTitle(context, { board, topicTitle, newTitle ,oldTitle}) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, oldTitle );
            board.topics[topicIdx].tasks[taskIdx].title = newTitle;
            context.dispatch({ type: "updateBoard", board: board });
        },
        updateTaskDescription(context,{board,topicTitle,taskTitle,taskDescription}){
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle );
            board.topics[topicIdx].tasks[taskIdx].description = taskDescription;
            context.dispatch({ type: "updateBoard", board: board });
        },
        updateTaskTags(context,{board,topicTitle,taskTitle,tag}){
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle );
            // console.log(context);
            // console.log(label);
            
            board.topics[topicIdx].tasks[taskIdx].tags.push(tag);
            context.dispatch({ type: "updateBoard", board: board });
            
            console.log(board.topics[topicIdx].tasks[taskIdx]);
        },
        addTask(context, { board, topicTitle, newTask }) {
            var idx = _findTopicIndex(board, topicTitle);
            board.topics[idx].tasks.push(newTask);
            context.dispatch({ type: "updateBoard", board: board });
        },
        removeTask(context, { board, topicTitle, taskTitle }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
            board.topics[topicIdx].tasks.splice(taskIdx, 1);
            context.dispatch({ type: "updateBoard", board: board });
        },
        updateTaskOrder(context, { topicTitle, tasks }) {
            var board = context.getters.getCurrBoard;
            var topicIdx = _findTopicIndex(board, topicTitle);
            board.topics[topicIdx].tasks = tasks
            context.dispatch({ type: "updateBoard", board: board });
        },
        updateTopicOrder(context, { topics }) {
            var board = context.getters.getCurrBoard;
            board.topics = topics
            context.dispatch({ type: "updateBoard", board: board });
        }
    }
}

function _findTopicIndex(board, term) {
    return board.topics.findIndex(topic => topic.title === term);
}

function _findTaskIndex(board, topicIdx, term) {
    console.log('term',term);
    
    return board.topics[topicIdx].tasks.findIndex(task => task.title === term);
}