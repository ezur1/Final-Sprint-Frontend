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
        getCurrBoard(state) { //// take off the "get"
            return state.currBoard
        },
        usersOnBoard(state) {
            return state.currBoard.usersOnBoard
        },
        getCurrTopicTitle(state) { //// take off the "get"
            return state.currTopicTitle
        },
        currTaskTags(state){
            return state.currTask.tags
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
                    const loggedInUser = JSON.parse(sessionStorage.user);

                    if (loggedInUser) { ///// "IF" becuase what happens if someone got to this URL in another way...
                        var userIdxInUsersOnBoard = _findUserIndexInUsersOnBoard(board.usersOnBoard, loggedInUser._id);
                        if (userIdxInUsersOnBoard === -1) {
                            board.usersOnBoard.push(loggedInUser)
                            context.dispatch({ type: "updateBoard", board: board });
                        }
                    }
                })
        },
        getTaskById(context, { boardId, taskId, topicTitle }) {
            return boardService.getById(boardId) ///// maybe it would be better to use the state's "currBoard"....
                .then(board => {
                    ////// DONT KNOW WHERE TO GET THE "topicTitle" IF USER GOT HERE VIA BOOKMARK ///////
                    var topicIdx = _findTopicIndex(board, topicTitle);
                    var foundTask = board.topics[topicIdx].tasks.find(task => task.id === taskId);
                    context.commit({ type: 'setCurrTopicTitle', topicTitle });
                    context.commit({ type: 'setCurrTask', foundTask });
                })
        },
        updateBoard(context, { board }) {
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
        updateTopicColor(context, { board, topicTitle, color }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            board.topics[topicIdx].color = color;
            context.dispatch({ type: "updateBoard", board: board });
        },
        updateTaskTitle(context, { board, topicTitle, newTitle, oldTitle }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, oldTitle);
            board.topics[topicIdx].tasks[taskIdx].title = newTitle;
            context.dispatch({ type: "updateBoard", board: board });
        },
        updateTaskDescription(context, { board, topicTitle, taskTitle, taskDescription }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
            board.topics[topicIdx].tasks[taskIdx].description = taskDescription;
            context.dispatch({ type: "updateBoard", board: board });
        },
        updateTaskTags(context, { board, topicTitle, taskTitle, tag }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
            var currTagIdx = board.topics[topicIdx].tasks[taskIdx].tags.findIndex(currTag => currTag === tag);

            if (currTagIdx === -1) {
                board.topics[topicIdx].tasks[taskIdx].tags.push(tag);
                context.dispatch({ type: "updateBoard", board: board });
            } else {
                board.topics[topicIdx].tasks[taskIdx].tags.splice(currTagIdx, 1);
                context.dispatch({ type: "updateBoard", board: board });
            }
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
        },
        removeUserFromBoards(context) {
            var loggedInUserId = context.getters.loggedInUser._id;
            boardService.query()
                .then(boards => {
                    boards.forEach(board => {
                        var usersOnBoard = board.usersOnBoard;
                        var userIdxInUsersOnBoard = _findUserIndexInUsersOnBoard(usersOnBoard, loggedInUserId);
                        if (userIdxInUsersOnBoard !== -1) {
                            // console.log('found this user in thie board, and am removing from the usersOnBoard Array');
                            board.usersOnBoard.splice(userIdxInUsersOnBoard, 1);
                            context.dispatch({ type: "updateBoard", board: board });
                        }
                    })
                });
        },
        addCheckList(context, { board, topicTitle, taskTitle, checkList }) {
            console.log('this is the checkList: ', checkList);
            
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);

            board.topics[topicIdx].tasks[taskIdx].checkLists.push(checkList);
            context.dispatch({ type: "updateBoard", board: board });
        },
        addTodo(context, { board, topicTitle, taskTitle, checkListTitle, todo }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
            console.log('log in store');
            var checkListIdx=_findCheckListIndex(board, topicIdx, taskIdx, checkListTitle)
        
            board.topics[topicIdx].tasks[taskIdx].checkLists[checkListIdx].todos.push(todo);
            context.dispatch({ type: "updateBoard", board: board });
        },
        toggleIsDoneCheckList(context, { board, topicTitle, taskTitle, checkListTitle,currTodoTxt }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
            var checkListIdx=_findCheckListIndex(board, topicIdx, taskIdx, checkListTitle)
            
            var todoIdx=_findTodoIdx(board, topicIdx, taskIdx, checkListIdx, currTodoTxt)
            
            board.topics[topicIdx].tasks[taskIdx].checkLists[checkListIdx].todos[todoIdx].isDone=!board.topics[topicIdx].tasks[taskIdx].checkLists[checkListIdx].todos[todoIdx].isDone;
            context.dispatch({ type: "updateBoard", board: board });
            console.log('todos[todoIdx].isDone in store',board.topics[topicIdx].tasks[taskIdx].checkLists[checkListIdx].todos[todoIdx].isDone);
        }
    }
}


function _findTopicIndex(board, term) {
    return board.topics.findIndex(topic => topic.title === term);
}

function _findTaskIndex(board, topicIdx, term) {
    return board.topics[topicIdx].tasks.findIndex(task => task.title === term);
}

function _findCheckListIndex(board, topicIdx, taskIdx, term) {
    return board.topics[topicIdx].tasks[taskIdx].checkLists.findIndex(checkList => checkList.title === term);
}

function _findTodoIdx(board, topicIdx, taskIdx,checkListIdx, term) {
    return board.topics[topicIdx].tasks[taskIdx].checkLists[checkListIdx].todos.findIndex(todo => todo.txt === term);
}

function _findUserIndexInUsersOnBoard(usersOnBoard, loggedInUserId) {
    return usersOnBoard.findIndex(user => user._id === loggedInUserId);
}