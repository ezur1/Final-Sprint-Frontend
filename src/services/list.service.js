import { httpService } from '../services/http.service.js';

function query() {

    return httpService.get('http://localhost:3000/lists')
}

function update(edited) {
    return httpService.put(`http://localhost:3000/api/toy/${edited._id}`, edited)
}

function getById(id) {
    return httpService.get(`http://localhost:3000/api/toy/${id}`)
}

function remove(id) {
    return httpService.delete(`http://localhost:3000/api/toy/${id}`)
}

function add(added) {
    return httpService.post(`http://localhost:3000/lists`, added)
}

export default {
    query,
    remove,
    add,
    update,
    getById
};