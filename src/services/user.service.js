import { httpService } from '../services/http.service.js';

const ROUTE = '/auth'

export default {
    login,
    signup,
    logout
}

async function login(userCred) {
    const user = await httpService.post(`${ROUTE}/login`, userCred)
    return _handleLogin(user)
}

async function signup(userCred) {
    const user = await httpService.post(`${ROUTE}/signup`, userCred)
    return _handleLogin(user)
}

async function logout() {
    await httpService.post(`${ROUTE}/logout`);
    sessionStorage.clear();
}

function _handleLogin(user) {
    sessionStorage.setItem('user', JSON.stringify(user))
    return user;
}