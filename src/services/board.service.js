import { httpService } from '../services/http.service.js';

const ROUTE = "/board"

function query() {
    return httpService.get(ROUTE)
}

function update(board) {
    return httpService.put(`${ROUTE}/${board._id}`, board)
}

function getById(id) {
    return httpService.get(`${ROUTE}/${id}`)
}

function remove(id) {
    return httpService.delete(`${ROUTE}/${id}`)
}

function add(added) {
    return httpService.post(ROUTE, added)
}

export default {
    query,
    remove,
    add,
    update,
    getById
};