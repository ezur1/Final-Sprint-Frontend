'use strict'

function makeId(length = 3) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

const applyDrag = (arr, dragResult) => {
    const { removedIndex, addedIndex, payload } = dragResult
    if (removedIndex === null && addedIndex === null) return arr
    const result = [...arr]
    let itemToAdd = payload
    if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0]
    }
    if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd)
    }
    return result
}

function setSort(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        // return ((x < y) ? -1 : 1);
        if (typeof x === 'number' && typeof y === 'number') {
            return ((x < y) ? -1 : 1);
        } else return ((x.toLowerCase() < y.toLowerCase()) ? -1 : 1);
    });
}

export const utilService = {
    makeId,
    applyDrag,
    setSort
}