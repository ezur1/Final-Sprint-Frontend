import userService from '../services/user.service.js'

var localLoggedinUser = null;
if (sessionStorage.user) localLoggedinUser = JSON.parse(sessionStorage.user);

export default {
    state: {
        loggedinUser: localLoggedinUser,
        users: []
    },
    mutations: {
        setUser(state, { user }) {
            state.loggedinUser = user;
        },
        setUsers(state, { users }) {
            state.users = users;
        },
    },
    getters: {
        users(state) {
            return state.users
        },
        loggedInUser(state) {
            return state.loggedinUser
        }
    },
    actions: {
        async login(context, { userCred }) {
            const user = await userService.login(userCred);
            context.commit({ type: 'setUser', user })
            return user;
        },
        async signup(context, { userCred }) {
            const user = await userService.signup(userCred)
            context.commit({ type: 'setUser', user })
            return user;
        },
        async removeUser(context, { user }) {
            var boardsToScrub = user.boards;
            if (boardsToScrub.length > 0) {
                boardsToScrub.forEach(boardId => {
                    context.dispatch({ type: "scrubUserFromBoard", boardId, user });
                })
            }
            await context.dispatch({ type: "loadBoards" });
            await userService.remove(user._id)
            await context.dispatch({ type: 'loadUsers' })
        },
        async scrubUserFromBoard(context, { boardId, user }) {
            var board = await context.dispatch({ type: "getBoardById", boardId });
            var boardMemberIdx = _findBoardMemberIndex(board, user._id);
            board.members.splice(boardMemberIdx, 1);
            context.dispatch({ type: "updateBoardNoEmission", board });
        },
        async changeUserImg(context, { userImgUrl }) {
            var user = context.getters.loggedInUser
            user.imgUrl = userImgUrl;
            await context.dispatch({ type: "updateUser", user });
            context.commit({ type: 'setUser', user })
        },
        async logout(context) {
            // await context.dispatch({ type: "removeUserFromBoard" });
            await userService.logout()
            context.commit({ type: 'setUser', user: null })
        },
        async loadUsers(context) {
            var users = await userService.query()
            context.commit({ type: 'setUsers', users })
            return users
        },
        async getUserById(context, { userId }) {
            var user = await userService.getById(userId)
            return user
        },
        async addBoardToUser(context, { boardId, user }) {
            var testIfExist = user.boards.find(boardID => boardID === boardId);
            if (testIfExist) return // console.log('this board already has THIS member...');
            user.boards.push(boardId);
            await context.dispatch({ type: "updateUser", user });
            return user
        },
        async removeBoardFromUser(context, { boardId, userId }) {
            var user = await context.dispatch({ type: "getUserById", userId });
            var boardIdxInUser = _findBoardIdxInUser(user, boardId);
            user.boards.splice(boardIdxInUser, 1);
            var scrubbedUser = await context.dispatch({ type: "updateUser", user });
            return scrubbedUser
        },
        async updateUser(context, { user }) {
            await userService.update(user)
            var updatedUser = await userService.getById(user._id)
            return updatedUser
        },

    },
    modules: {}
}

function _findBoardIdxInUser(user, term) {
    return user.boards.findIndex(boardId => boardId === term);
}

function _findBoardMemberIndex(board, term) {
    return board.members.findIndex(currMember => currMember._id === term);
}