'use strict';
console.log('storage')

function saveToStorage(key, val) {
    console.log(val)
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}