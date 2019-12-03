import socketService from '../services/socket.service.js'

export default {
    state: {

    },
    getters: {

    },
    mutations: {

    },
    actions: {
        sendMsg(context, { msg }) {
            socketService.emit('sendMsg', msg)
        },
        getChatHistory(context, { chatId }) {
            socketService.emit('getHistory', chatId)
        }
    }
}