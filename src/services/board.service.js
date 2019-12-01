import { httpService } from '../services/http.service.js';

function query() {
    return httpService.get('http://localhost:3001/api/board')
}

function update(board) {
    return httpService.put(`http://localhost:3001/api/board/${board._id}`, board)
}

function getById(id) {
    return httpService.get(`http://localhost:3001/api/board/${id}`)
}

function remove(id) {
    return httpService.delete(`http://localhost:300/api/board/${id}`)
}

function add(added) {
    return httpService.post(`http://localhost:3001/api/boards`, added)
}

export default {
    query,
    remove,
    add,
    update,
    getById
};