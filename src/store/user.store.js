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
        }
    },
    getters: {
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
        async logout(context) {
            await userService.logout()
            context.commit({ type: 'setUser', user: null })
        },

    },
    modules: {}
}