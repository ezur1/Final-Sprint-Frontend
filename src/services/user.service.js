import { httpService } from '../services/http.service.js';

const URL_KEY = 'http://localhost:3001/api'

export default {
    login,
    signup,
    logout
}

async function login(userCred) {
    const user = await httpService.post(`${URL_KEY}/auth/login`, userCred)
    return _handleLogin(user)
}

async function signup(userCred) {
    const user = await httpService.post(`${URL_KEY}/auth/signup`, userCred)
    return _handleLogin(user)
}

async function logout() {
    await httpService.post(`${URL_KEY}/auth/logout`);
    sessionStorage.clear();
}

function _handleLogin(user) {
    sessionStorage.setItem('user', JSON.stringify(user))
    return user;
}