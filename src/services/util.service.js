'use strict'

function makeId(length = 3) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
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
    setSort
}