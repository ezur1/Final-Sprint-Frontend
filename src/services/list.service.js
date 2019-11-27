import { httpService } from '../services/http.service.js';

function query() {

    return httpService.get('http://localhost:3000/lists')
}

function update(edited) {
    console.log('edited._id',edited);
    return httpService.put(`http://localhost:3000/lists/${edited._id}`, edited)
}

function getById(id) {
    return httpService.get(`http://localhost:3000/lists/${id}`)
}

function remove(id) {
    return httpService.delete(`http://localhost:3000/lists/${id}`)
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