import { httpService } from '../services/http.service.js';

function query() {
    // console.log('now got to the list.service');

    // return httpService.get('http://localhost:3000/lists')
    var x = httpService.get('http://localhost:3000/lists')
        // console.log('these are the gotten lists: ', x);
    return x

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
    return httpService.post(`http://localhost:3000/api/toy`, added)
}

export default {
    query,
    remove,
    add,
    update,
    getById
};