'use strict';
console.log('util')

function getFileName(fileNameFull) {
        var fileNameSplit = fileNameFull.split(".");
        var fileName = fileNameSplit[0];
        return fileName;
}

function stringSplit(content){
    let strings = []
    var s = content;
    var idx = s.length / 2;

    var s1 = s.substring(0, idx);
    var s2 = s.substring(idx);
    //console.log(s1, s2)
    strings.push(s1, s2)
    return strings
}


function makeId(length = 4) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return txt;
}


function sortByString(array,sortby) { // sortBy
    //console.log(array);
    array.sort(function (a, b) {
        //console.log(a, b);
        var nameA = a[sortby].toUpperCase(); // ignore upper and lowercase
        var nameB = b[sortby].toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;

    });
    return array
}

function sortByNumber(array, sortby) {
    array.sort(function (a, b) {
        var dateA = a[sortby];
        var dateB = b[sortby];
        return dateA - dateB;
    });
}


function makePrice(min=10, max=100) {
    var price = getRandomIntInclusive(min, max);
    //console.log(price)
    return price;
}

function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn'];
    var txt = '';
    while (size > 0) {
        size--;
        txt += words[Math.floor(Math.random() * words.length)] + ' ';
    }
    return txt;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function randomColorByPallete() {
    var colors = ['#007bff', '#28a745', '#dc3545']
    var currColorIdx = getRandomIntInclusive(0, 2)
    //console.log(currColorIdx)
    var color = colors[currColorIdx];
    return color;
}

function randomColor() {
    var color = "";
    for (var i = 0; i < 3; i++) {
        color += getRandomIntInclusive(0, 255) + ',';
    }
    color = 'rgb('+color.slice(1, -1)+')';
    //console.log('color', color)
    return color;
}


function displayTime() {
    var str = "";

    var currentTime = new Date()
    var year = currentTime.getYear()
    var month = currentTime.getMonth()
    var day = currentTime.getDay()

    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()

    str += day + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds + ' ';

    //console.log(str)
    //console.log(currentTime)
    return currentTime;
}


function getDateAndTime(){
    var objToday = new Date(),
	weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
	dayOfWeek = weekday[objToday.getDay()],
	domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }(),
	dayOfMonth = today + ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
	months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
	curMonth = months[objToday.getMonth()],
	curYear = objToday.getFullYear(),
	curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
	curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
	curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
	curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
    var today = curHour + ":" + curMinute + "." + curSeconds + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;
    console.log(today);
    return today;
    //console.log(today);
}