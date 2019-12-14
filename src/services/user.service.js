import { httpService } from '../services/http.service.js';

const USER_ROUTE = '/user'
const AUTH_ROUTE = '/auth'

export default {
    query,
    getById,
    update,
    remove,
    login,
    signup,
    logout
}

async function query() {
    const users = await httpService.get(USER_ROUTE)
    return users
}

async function getById(id) {
    var user = await httpService.get(`${USER_ROUTE}/${id}`)
    return user
}

function update(user) {
    return httpService.put(`${USER_ROUTE}/${user._id}`, user)
}

function remove(userId) {
    return httpService.delete(`${USER_ROUTE}/${userId}`)
}

async function login(userCred) {
    const user = await httpService.post(`${AUTH_ROUTE}/login`, userCred)
    return _handleLogin(user)
}

async function signup(userCred) {
    const user = await httpService.post(`${AUTH_ROUTE}/signup`, userCred)
    return _handleLogin(user)
}

async function logout() {
    await httpService.post(`${AUTH_ROUTE}/logout`);
    sessionStorage.clear();
}

function _handleLogin(user) {
    sessionStorage.setItem('user', JSON.stringify(user))
    return user;
}