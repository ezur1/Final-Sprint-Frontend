import axios from 'axios'
import router from '../router/index.js'

// const BASE_URL = "http://localhost:3001/api"

const BASE_URL = (process.env.NODE_ENV !== 'development') ?
    '/api' :
    '//localhost:3001/api';

export const httpService = {
    get,
    delete: remove,
    post,
    put
}

function get(route) {
    return axios.get(BASE_URL + route)
        .then(res => res.data)
        .catch(_handleError)
}

function remove(route) {
    return axios.delete(BASE_URL + route)
        .catch(_handleError)
}

function post(route, data) {
    return axios.post(BASE_URL + route, data)
        .then(res => res.data)
        .catch(_handleError)
}

function put(route, data) {
    return axios.put(BASE_URL + route, data)
        .then(res => res.data)
        .catch(_handleError)
}

function _handleError(err) {
    // console.log('Err:', err.response.data.error);

    if (err.response.status === 401) {
        sessionStorage.clear();
        router.push('/');
    }
    throw err; //// this line ensures that only a successfull login will advance.
}