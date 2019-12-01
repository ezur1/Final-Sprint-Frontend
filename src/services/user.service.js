import { httpService } from '../services/http.service.js';

export default {
    login,
    signup
}

async function login(userCred) {
    const user = await httpService.post('http://localhost:3001/api/auth/login', userCred)
    return _handleLogin(user)
}

async function signup(userCred) {
    const user = await httpService.post('http://localhost:3001/api/auth/signup', userCred)
    return _handleLogin(user)
}

function _handleLogin(user) {
    sessionStorage.setItem('user', JSON.stringify(user))
    return user;
}