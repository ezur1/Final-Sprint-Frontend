import { httpService } from '../services/http.service.js';

function query() {

    return httpService.get('http://localhost:3000/boards')
}

function update(board) {
    console.log('edited._id', board._id);
    return httpService.put(`http://localhost:3000/boards/${board._id}`, board)
}

function getById(id) {
    return httpService.get(`http://localhost:3000/boards/${id}`)
}

function remove(id) {
    return httpService.delete(`http://localhost:3000/boards/${id}`)
}

function add(added) {
    return httpService.post(`http://localhost:3000/boards`, added)
}

export default {
    query,
    remove,
    add,
    update,
    getById
};