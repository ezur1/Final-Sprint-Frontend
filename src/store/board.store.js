'use strict'
import Vue from 'vue'
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
        async setCurrBoard(context, { boardId }) {
            var board = await boardService.getById(boardId)
            context.commit({ type: 'setCurrBoard', board })
            return board
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
        async handleBoard(context, { payload }) {
            var action = payload.action;
            if (action === 'updateBoardDescription' || action === 'changeBoardBGImg') {
                var board = context.getters.currBoard;
            }
            switch (action) {
                case "addBoard":
                    payload.board.activityLog.push(_makeLogEntry(payload.board.title, 'board', 'added', context.getters.loggedInUser))
                    var addedBoard = await boardService.add(payload.board)
                    context.dispatch({ type: "loadBoards" });
                    context.dispatch({ type: "addBoardToUser", boardId: addedBoard._id, user: payload.firstMember });
                    break;
                case "removeBoard":
                    await boardService.remove(payload.boardId);
                    context.dispatch({ type: "loadBoards" });
                    break;
                case "addUserToBoard":
                    var testIfExist = payload.board.members.find(user => user._id === payload.user._id);
                    if (testIfExist) return // console.log('this user is already a member...');
                    payload.board.members.push(payload.user);
                    await context.dispatch({ type: "updateBoard", board: payload.board });
                    break;
                case "updateBoardDescription":
                    board.description = payload.newBoardDescription;
                    board.activityLog.push(_makeLogEntry(board.title, 'board-description', 'updated', context.getters.loggedInUser))
                    await context.dispatch({ type: "updateBoard", board: board });
                    break;
                case "changeBoardBGImg":
                    board.imgUrl = payload.boardImgUrl;
                    await context.dispatch({ type: "updateBoard", board });
                    break;
            }
            if (action === 'addBoard') return addedBoard;
            if (action === 'changeBoardBGImg' || action === 'updateBoardDescription') return board;
        },
        async handleTopic(context, { payload }) {
            var board = context.getters.currBoard;
            var action = payload.action;
            var topicTitle = payload.topicTitle
            var topicIdx = _findTopicIndex(board, topicTitle);
            switch (action) {
                case "addTopic":
                    if (board.topics.find(topic => topic.title === payload.newTopic.title)) return // show an error message to the user;
                    board.topics.push(payload.newTopic)
                    board.activityLog.push(_makeLogEntry(payload.newTopic.title, 'topic', 'added', context.getters.loggedInUser))
                    break;
                case "removeTopic":
                    board.topics.splice(topicIdx, 1);
                    board.activityLog.push(_makeLogEntry(topicTitle, 'topic', 'removed', context.getters.loggedInUser))
                    break;
                case "updateTopicTitle":
                    board.topics[topicIdx].title = payload.newTopicTitle;
                    board.activityLog.push(_makeLogEntry(topicTitle, 'topic', 'updated', context.getters.loggedInUser))
                    break;
                case "updateTopicColor":
                    board.topics[topicIdx].color = payload.color;
                    break;
            }
            await context.dispatch({ type: "updateBoard", board: board });
            return board
        },
        async handleTask(context, { payload }) {
            var board = context.getters.currBoard;
            var action = payload.action;
            var topicTitle = payload.topicTitle;
            var topicIdx = _findTopicIndex(board, topicTitle);
            if (action !== 'addTask') {
                var taskTitle = context.getters.currTask.title;
                var taskIdx = _findTaskIndex(board, topicIdx, taskTitle);
                var foundTask = board.topics[topicIdx].tasks[taskIdx];
            }
            if (action === 'updateCheckLists' || action === 'updateCheckList') {
                var checkListIdx = _findCheckListIndex(board, topicIdx, taskIdx, payload.checkListTitle);
            }
            switch (action) {
                case "addTask":
                    board.topics[topicIdx].tasks.push(payload.newTask);
                    board.activityLog.push(_makeLogEntry(payload.newTask.title, 'task', 'added', context.getters.loggedInUser))
                    break;
                case "removeTask":
                    board.topics[topicIdx].tasks.splice(taskIdx, 1);
                    board.activityLog.push(_makeLogEntry(taskTitle, 'task', 'removed', context.getters.loggedInUser))
                    break;
                case "updateTaskTitle":
                    board.topics[topicIdx].tasks[taskIdx].activities.unshift(_makeTaskActivityEntry(`the task title from ${payload.taskTitle} to ${payload.newTaskTitle} `, 'updated ', context.getters.loggedInUser))
                    board.topics[topicIdx].tasks[taskIdx].title = payload.newTaskTitle;
                    board.activityLog.push(_makeLogEntry(taskTitle, 'task', 'updated', context.getters.loggedInUser))
                    break;
                case "updateTaskDescription":
                    board.topics[topicIdx].tasks[taskIdx].activities.unshift(_makeTaskActivityEntry('the description', 'updated', context.getters.loggedInUser))
                    board.topics[topicIdx].tasks[taskIdx].description = payload.description;
                    break;
                case "updateTaskMembers":
                    var memberIdx = _findMemberIndex(board, topicIdx, taskIdx, payload.member._id);
                    if (memberIdx === -1) {
                        board.topics[topicIdx].tasks[taskIdx].activities.unshift(_makeTaskActivityEntry(payload.member.firstName, 'assigned this task to ', context.getters.loggedInUser))
                        board.topics[topicIdx].tasks[taskIdx].members.push(payload.member);
                    } else {
                        board.topics[topicIdx].tasks[taskIdx].activities.unshift(_makeTaskActivityEntry(payload.member.firstName, 'unassigned this task from', context.getters.loggedInUser))
                        board.topics[topicIdx].tasks[taskIdx].members.splice(memberIdx, 1);
                    }
                    break;
                case "updateTaskTags":
                    var tagIdx = _findTagIndex(board, topicIdx, taskIdx, payload.tag);
                    if (tagIdx === -1) {
                        board.topics[topicIdx].tasks[taskIdx].activities.unshift(_makeTaskActivityEntry(payload.tag, 'added a ', context.getters.loggedInUser))
                        board.topics[topicIdx].tasks[taskIdx].tags.push(payload.tag);
                    } else {
                        board.topics[topicIdx].tasks[taskIdx].activities.unshift(_makeTaskActivityEntry(payload.tag, 'removed a ', context.getters.loggedInUser))
                        board.topics[topicIdx].tasks[taskIdx].tags.splice(tagIdx, 1);
                    }
                    break;
                case "updateCheckLists":
                    if (checkListIdx === -1) {
                        board.topics[topicIdx].tasks[taskIdx].activities.unshift(_makeTaskActivityEntry(payload.checkList.title, 'added checklist ', context.getters.loggedInUser))
                        board.topics[topicIdx].tasks[taskIdx].checkLists.push(payload.checkList);
                    } else {
                        board.topics[topicIdx].tasks[taskIdx].activities.unshift(_makeTaskActivityEntry(payload.checkListTitle, 'removed checklist ', context.getters.loggedInUser))
                        board.topics[topicIdx].tasks[taskIdx].checkLists.splice(checkListIdx, 1);
                    }
                    break;
                case "updateCheckList":
                    var checkListAction = payload.checkListAction
                    if (checkListAction !== 'updateCheckListTitle') {
                        var todoIdx = _findTodoIdx(board, topicIdx, taskIdx, checkListIdx, payload.todo.txt)
                    }
                    switch (checkListAction) {
                        case "updateCheckListTitle":
                            board.topics[topicIdx].tasks[taskIdx].checkLists[checkListIdx].title = payload.newCheckListTitle;
                            board.topics[topicIdx].tasks[taskIdx].activities.unshift(_makeTaskActivityEntry(`checklist: ${payload.checkListTitle}'s title `, 'updated ', context.getters.loggedInUser))
                            board.activityLog.push(_makeLogEntry(payload.checkListTitle, `checklist's title`, 'updated', context.getters.loggedInUser))
                            break;
                        case "updateTodos":
                            if (todoIdx === -1) {
                                board.topics[topicIdx].tasks[taskIdx].activities.unshift(_makeTaskActivityEntry(`checklist item: ${payload.todo.txt} to ${payload.checkListTitle} `, 'added ', context.getters.loggedInUser))
                                board.topics[topicIdx].tasks[taskIdx].checkLists[checkListIdx].todos.push(payload.todo);
                            } else {
                                board.topics[topicIdx].tasks[taskIdx].activities.unshift(_makeTaskActivityEntry(`checklist item: ${payload.todo.txt} from ${payload.checkListTitle} `, 'removed ', context.getters.loggedInUser))
                                board.topics[topicIdx].tasks[taskIdx].checkLists[checkListIdx].todos.splice(todoIdx, 1);
                            }
                            break;
                        case "toggleToDoIsDone":
                            board.topics[topicIdx].tasks[taskIdx].checkLists[checkListIdx].todos[todoIdx].isDone = !board.topics[topicIdx].tasks[taskIdx].checkLists[checkListIdx].todos[todoIdx].isDone;
                            break;
                        case "updateToDoItemTxt":
                            board.topics[topicIdx].tasks[taskIdx].activities.unshift(_makeTaskActivityEntry(`checklist item from ${payload.toDoItemTxt} to ${payload.newToDoItemTxt} `, 'updated ', context.getters.loggedInUser))
                            board.topics[topicIdx].tasks[taskIdx].checkLists[checkListIdx].todos[todoIdx].txt = payload.newToDoItemTxt;
                            break;
                    }
                    break;
                case "addTaskComment":
                    board.topics[topicIdx].tasks[taskIdx].activities.unshift(payload.comment);
                    break;
                case "addDueDate":
                    board.topics[topicIdx].tasks[taskIdx].activities.unshift(_makeTaskActivityEntry(`due date: ${Vue.moment(payload.dueDate).format("MMM Do")}, `, 'added ', context.getters.loggedInUser))
                    board.topics[topicIdx].tasks[taskIdx].dueDate = payload.dueDate;
                    break;
                case "addImgToTask":
                    board.topics[topicIdx].tasks[taskIdx].imgUrls.push(payload.imgUrl);
                    break;
                case "removeImgFromTask":
                    var imgIdx = _findImgIndex(board, topicIdx, taskIdx, payload.imgUrl);
                    board.topics[topicIdx].tasks[taskIdx].imgUrls.splice(imgIdx, 1);
                    break;
                case "clearTaskActivities":
                    board.topics[topicIdx].tasks[taskIdx].activities = [];
                    break;

            }
            if (action !== 'addTask' || action !== 'removeTask') context.commit({ type: 'setCurrTask', foundTask });
            await context.dispatch({ type: "updateBoard", board: board });
            return board
        },
        async clearLog(context, { board }) {
            board.activityLog = [];
            await context.dispatch({ type: "updateBoard", board: board });
        },
        getTaskById(context, { board, taskId, topicTitle }) {
            var topicIdx = _findTopicIndex(board, topicTitle);
            var foundTask = board.topics[topicIdx].tasks.find(task => task.id === taskId);
            context.commit({ type: 'setCurrTopicTitle', topicTitle });
            context.commit({ type: 'setCurrTask', foundTask });
            return foundTask
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

        async updateTopicOrder(context, { topics }) {
            var board = context.getters.currBoard;
            board.topics = topics
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

function _findMemberIndex(board, topicIdx, taskIdx, term) {
    return board.topics[topicIdx].tasks[taskIdx].members.findIndex(currMember => currMember._id === term);
}

function _findCheckListIndex(board, topicIdx, taskIdx, term) {
    return board.topics[topicIdx].tasks[taskIdx].checkLists.findIndex(currCheckList => currCheckList.title === term);
}

function _findTagIndex(board, topicIdx, taskIdx, term) {
    return board.topics[topicIdx].tasks[taskIdx].tags.findIndex(tag => tag === term);
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

function _makeTaskActivityEntry(what, action, loggedInUser) {
    return {
        txt: ` has ${action} ${what}`,
        user: loggedInUser,
        timeStamp: Date.now()
    }
}