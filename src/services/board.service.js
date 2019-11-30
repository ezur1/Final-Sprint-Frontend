import { httpService } from '../services/http.service.js';

function query() {
    // return httpService.get('http://localhost:3000/boards')
    return httpService.get('http://localhost:3001/api/board')
}

function update(board) {
    // return httpService.put(`http://localhost:3000/boards/${board._id}`, board)
    return httpService.put(`http://localhost:3001/api/board/${board._id}`, board)
}

function getById(id) {
    console.log('the id is: ', id);
    // return httpService.get(`http://localhost:3000/boards/${id}`)
    return httpService.get(`http://localhost:3001/api/board/${id}`)
}

function remove(id) {
    // return httpService.delete(`http://localhost:3000/boards/${id}`)
    return httpService.delete(`http://localhost:300/api/board/${id}`)
}

function add(added) {
    // return httpService.post(`http://localhost:3000/boards`, added)
    return httpService.post(`http://localhost:3001/api/boards`, added)
}

export default {
    query,
    remove,
    add,
    update,
    getById
};