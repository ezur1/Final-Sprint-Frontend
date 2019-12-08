'use strict'

import boardService from '../services/board.service.js'
import socketService from '../services/socket.service.js';

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
        boards(state) {
            return state.boards
        },
        currBoard(state) {
            return state.currBoard
        },
        currLog(state) {
            return state.currBoard.activityLog
        },
        currTask(state) {
            return state.currTask;
        },
        usersOnBoard(state) {
            return state.currBoard.usersOnBoard
        },
        currTaskTags(state) {
            return state.currTask.tags
        }
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
            if (loggedInUser) { ///// what happens if someone got to this URL in another way...
                var userIdxInUsersOnBoard = _findUserIndexInUsersOnBoard(board.usersOnBoard, loggedInUser._id);
                if (userIdxInUsersOnBoard === -1) {
                    board.usersOnBoard.push(loggedInUser)
                    context.dispatch({ type: "updateBoard", board: board });
                    return board
                }
            }
            return board
        },
        async updateBoard(context, { board }) {
            await boardService.update(board)
            var updatedBoard = await boardService.getById(board._id)
            context.commit({ type: 'setCurrBoard', board: updatedBoard })
            _broadcastUpdate()
            return updatedBoard
        },
        async clearLog(context, { board }) {
            board.activityLog = [];
            await context.dispatch({ type: "updateBoard", board: board });
        },
        async addUserToBoard(context, { board, user }) {
            var testIfExist = board.members.find(User => User._id === user._id);
            if (testIfExist) return // console.log('this user is already a member...');
            board.members.push(user);
            await context.dispatch({ type: "updateBoard", board: board });
            return board
        },
        getTaskById(context, { board, taskId, topicTitle }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var foundTask = board.topics[topicIdx].tasks.find(task => task.id === taskId);
            context.commit({ type: 'setCurrTopicTitle', topicTitle });
            context.commit({ type: 'setCurrTask', foundTask });
            return foundTask
        },
        async addBoard(context, { newBoard, firstMember }) {
            var newLogEntry = _makeLogEntry(newBoard.title, 'board', 'added', context.getters.loggedInUser)
            newBoard.activityLog.push(newLogEntry)
            var addedBoard = await boardService.add(newBoard)
            context.dispatch({ type: "loadBoards" });
            context.dispatch({ type: "addBoardToUser", boardId: addedBoard._id, user: firstMember });
            return newBoard
        },
        async removeBoard(context, { boardId }) {
            await boardService.remove(boardId)
            context.dispatch({ type: "loadBoards" });
        },
        async updateBoardDescription(context, { board, newBoardDescription }) {
            board.description = newBoardDescription;
            var newLogEntry = _makeLogEntry(board.title, 'board-description', 'updated', context.getters.loggedInUser)
            board.activityLog.push(newLogEntry)
            await context.dispatch({ type: "updateBoard", board: board });
            return board
        },
        async changeBoardBGImg(context, { board, boardImgUrl }) {
            board.imgUrl = boardImgUrl;
            await context.dispatch({ type: "updateBoard", board: board });
            return board
        },
        async addTopic(context, { board, newTopic }) {
            var testIfExist = board.topics.find(topic => topic.title === newTopic.title)
            if (testIfExist) return // console.log('this topic already exists...');
            board.topics.push(newTopic)
            var newLogEntry = _makeLogEntry(newTopic.title, 'topic', 'added', context.getters.loggedInUser)
            board.activityLog.push(newLogEntry)
            await context.dispatch({ type: "updateBoard", board: board });
            return board
        },
        async removeTopic(context, { board, topicTitle }) {
            var idx = _findTopicIndex(board, topicTitle);
            board.topics.splice(idx, 1);
            var newLogEntry = _makeLogEntry(topicTitle, 'topic', 'removed', context.getters.loggedInUser)
            board.activityLog.push(newLogEntry)
            await context.dispatch({ type: "updateBoard", board: board });
            return board
        },
        async updateTopic(context, { board, oldTitle, newTitle }) {
            var idx = _findTopicIndex(board, oldTitle);
            board.topics[idx].title = newTitle;
            var newLogEntry = _makeLogEntry(oldTitle, 'topic', 'updated', context.getters.loggedInUser)
            board.activityLog.push(newLogEntry)
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
            var newLogEntry = _makeLogEntry(oldTitle, 'task', 'updated', context.getters.loggedInUser)
            board.activityLog.push(newLogEntry)
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
        async updateTaskMembers(context, { board, topicTitle, taskTitle, member }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
            var currMemberIdx = board.topics[topicIdx].tasks[taskIdx].members.findIndex(currMember => currMember._id === member._id);
            var foundTask = board.topics[topicIdx].tasks[taskIdx];
            if (currMemberIdx === -1) {
                board.topics[topicIdx].tasks[taskIdx].members.push(member);
                context.commit({ type: 'setCurrTask', foundTask });
                await context.dispatch({ type: "updateBoard", board: board });
                return board
            } else {
                board.topics[topicIdx].tasks[taskIdx].members.splice(currMemberIdx, 1);
                context.commit({ type: 'setCurrTask', foundTask });
                await context.dispatch({ type: "updateBoard", board: board });
                return board
            }
        },
        async updateTaskTags(context, { board, topicTitle, taskTitle, tag }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
            var currTagIdx = board.topics[topicIdx].tasks[taskIdx].tags.findIndex(currTag => currTag === tag);
            var foundTask = board.topics[topicIdx].tasks[taskIdx];
            if (currTagIdx === -1) {
                board.topics[topicIdx].tasks[taskIdx].tags.push(tag);
                context.commit({ type: 'setCurrTask', foundTask });
                await context.dispatch({ type: "updateBoard", board: board });
                return board
            } else {
                board.topics[topicIdx].tasks[taskIdx].tags.splice(currTagIdx, 1);
                context.commit({ type: 'setCurrTask', foundTask });
                await context.dispatch({ type: "updateBoard", board: board });
                return board
            }
        },
        async addTask(context, { board, topicTitle, newTask }) {
            var idx = _findTopicIndex(board, topicTitle);
            board.topics[idx].tasks.push(newTask);
            var newLogEntry = _makeLogEntry(newTask.title, 'task', 'added', context.getters.loggedInUser)
            board.activityLog.push(newLogEntry)
            await context.dispatch({ type: "updateBoard", board: board });
            return board
        },
        async removeTask(context, { board, topicTitle, taskTitle }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
            board.topics[topicIdx].tasks.splice(taskIdx, 1);
            var newLogEntry = _makeLogEntry(taskTitle, 'task', 'removed', context.getters.loggedInUser)
            board.activityLog.push(newLogEntry)
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
        async removeUserFromBoard(context) {
            var loggedInUserId = context.getters.loggedInUser._id;
            var board = context.getters.currBoard;
            var usersOnBoard = board.usersOnBoard;
            var userIdxInUsersOnBoard = _findUserIndexInUsersOnBoard(usersOnBoard, loggedInUserId);
            board.usersOnBoard.splice(userIdxInUsersOnBoard, 1);
            await context.dispatch({ type: "updateBoard", board: board });
            return board;
        },
        async updateCheckLists(context, { board, topicTitle, taskTitle, checkList }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
            // var checkListIdx = _findCheckListIndex(board, topicIdx, taskIdx, checkListTitle)
            var currCheckListIdx = board.topics[topicIdx].tasks[taskIdx].checkLists.findIndex(currCheckList => currCheckList.title === checkList.title);
            var foundTask = board.topics[topicIdx].tasks[taskIdx];
            if (currCheckListIdx === -1) {
                board.topics[topicIdx].tasks[taskIdx].checkLists.push(checkList);
                context.commit({ type: 'setCurrTask', foundTask });
                await context.dispatch({ type: "updateBoard", board: board });
                return board
            } else {
                board.topics[topicIdx].tasks[taskIdx].checkLists.splice(currCheckListIdx, 1);
                context.commit({ type: 'setCurrTask', foundTask });
                await context.dispatch({ type: "updateBoard", board: board });
                return board
            }
        },
        async updateCheckListTitle(context, { board, topicTitle, taskTitle, oldCheckListTitle, newCheckListTitle }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
            var checkListIdx = _findCheckListIndex(board, topicIdx, taskIdx, oldCheckListTitle)
            board.topics[topicIdx].tasks[taskIdx].checkLists[checkListIdx].title = newCheckListTitle;
            var newLogEntry = _makeLogEntry(oldCheckListTitle, `checklist's title`, 'updated', context.getters.loggedInUser)
            board.activityLog.push(newLogEntry)
            await context.dispatch({ type: "updateBoard", board: board });
            return board
        },
        async updateTodos(context, { board, topicTitle, taskTitle, checkListTitle, todo }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
            var checkListIdx = _findCheckListIndex(board, topicIdx, taskIdx, checkListTitle)
            var currTodoIdx = board.topics[topicIdx].tasks[taskIdx].checkLists[checkListIdx].todos.findIndex(currTodo => currTodo.txt === todo.txt);
            var foundTask = board.topics[topicIdx].tasks[taskIdx];
            if (currTodoIdx === -1) {
                board.topics[topicIdx].tasks[taskIdx].checkLists[checkListIdx].todos.push(todo);
                context.commit({ type: 'setCurrTask', foundTask });
                await context.dispatch({ type: "updateBoard", board: board });
                return board
            } else {
                board.topics[topicIdx].tasks[taskIdx].checkLists[checkListIdx].todos.splice(currTodoIdx, 1);
                context.commit({ type: 'setCurrTask', foundTask });
                await context.dispatch({ type: "updateBoard", board: board });
                return board
            }
        },
        async updateToDoItemTxt(context, { board, topicTitle, taskTitle, checkListTitle, oldToDoItemTxt, newToDoItemTxt }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
            var checkListIdx = _findCheckListIndex(board, topicIdx, taskIdx, checkListTitle)
            var todoIdx = board.topics[topicIdx].tasks[taskIdx].checkLists[checkListIdx].todos.findIndex(currTodo => currTodo.txt === oldToDoItemTxt);
            board.topics[topicIdx].tasks[taskIdx].checkLists[checkListIdx].todos[todoIdx].txt = newToDoItemTxt;
            await context.dispatch({ type: "updateBoard", board: board });
            return board
        },
        async toggleIsDoneCheckList(context, { board, topicTitle, taskTitle, checkListTitle, currTodoTxt }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
            var checkListIdx = _findCheckListIndex(board, topicIdx, taskIdx, checkListTitle)
            var todoIdx = _findTodoIdx(board, topicIdx, taskIdx, checkListIdx, currTodoTxt)
            board.topics[topicIdx].tasks[taskIdx].checkLists[checkListIdx].todos[todoIdx].isDone = !board.topics[topicIdx].tasks[taskIdx].checkLists[checkListIdx].todos[todoIdx].isDone;
            var foundTask = board.topics[topicIdx].tasks[taskIdx];
            context.commit({ type: 'setCurrTask', foundTask });
            await context.dispatch({ type: "updateBoard", board: board });
            return board;
        },
        async addDueDate(context, { board, topicTitle, taskTitle, dueDate }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
            board.topics[topicIdx].tasks[taskIdx].dueDate = dueDate;
            var foundTask = board.topics[topicIdx].tasks[taskIdx];
            context.commit({ type: 'setCurrTask', foundTask });
            await context.dispatch({ type: "updateBoard", board: board });
            return board;
        },
        async addImgToTask(context, { board, topicTitle, taskTitle, imgUrl }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
            board.topics[topicIdx].tasks[taskIdx].imgUrls.push(imgUrl);
            var foundTask = board.topics[topicIdx].tasks[taskIdx];
            context.commit({ type: 'setCurrTask', foundTask });
            await context.dispatch({ type: "updateBoard", board: board });
            return board;
        },
        async removeImgFromTask(context, { board, topicTitle, taskTitle, imgUrl }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
            var imgIdx = _findImgIndex(board, topicIdx, taskIdx, imgUrl);
            board.topics[topicIdx].tasks[taskIdx].imgUrls.splice(imgIdx, 1);
            var foundTask = board.topics[topicIdx].tasks[taskIdx];
            context.commit({ type: 'setCurrTask', foundTask });
            await context.dispatch({ type: "updateBoard", board: board });
            return board;
        },
        async addTaskComment(context, { board, topicTitle, taskTitle, newComment }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
            board.topics[topicIdx].tasks[taskIdx].activities.unshift(newComment);
            var foundTask = board.topics[topicIdx].tasks[taskIdx];
            context.commit({ type: 'setCurrTask', foundTask });
            await context.dispatch({ type: "updateBoard", board: board });
            return board;
        },
        // async addSomethingToTask(context, { board, topicTitle, taskTitle, imgUrl }) { ////////// <--- work in progress
        //     var type = 
        //     var topicIdx = _findTopicIndex(board, topicTitle);
        //     var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
        //     board.topics[topicIdx].tasks[taskIdx].dueDate = dueDate;
        //     var foundTask = board.topics[topicIdx].tasks[taskIdx];
        //     context.commit({ type: 'setCurrTask', foundTask });
        //     await context.dispatch({ type: "updateBoard", board: board });
        //     return board;
        // },


    }
}

function _findTopicIndex(board, term) {
    return board.topics.findIndex(topic => topic.title === term);
}

function _findTaskIndex(board, topicIdx, term) {
    return board.topics[topicIdx].tasks.findIndex(task => task.title === term);
}

function _findImgIndex(board, topicIdx, taskIdx, term) {
    return board.topics[topicIdx].tasks[taskIdx].imgUrls.findIndex(img => img === term);
}

function _findCheckListIndex(board, topicIdx, taskIdx, term) {
    return board.topics[topicIdx].tasks[taskIdx].checkLists.findIndex(checkList => checkList.title === term);
}

function _findTodoIdx(board, topicIdx, taskIdx, checkListIdx, term) {
    return board.topics[topicIdx].tasks[taskIdx].checkLists[checkListIdx].todos.findIndex(todo => todo.txt === term);
}

function _findUserIndexInUsersOnBoard(usersOnBoard, loggedInUserId) {
    return usersOnBoard.findIndex(user => user._id === loggedInUserId);
}

function _broadcastUpdate() {
    const msg = ('board has been updated!');
    socketService.emit('boardUpdated', msg);
}

function _makeLogEntry(name, type, action, loggedInUser) {
    return {
        title: ` has ${action} the "${name}" ${type}`,
        user: loggedInUser,
        timeStamp: Date.now()
    }
}

// function _makeTaskActivityEntry(name, type, action, loggedInUser) {
//     return {
//         title: ` has ${action} the "${name}" ${type}`,
//         user: loggedInUser,
//         timeStamp: Date.now()
//     }
// }