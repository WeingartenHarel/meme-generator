'use strict';
console.log('gallery service')

const PAGE_SIZE = 10;
let gPageIdx = 0;
const STORAGE_MEMES_KEY = 'memesDB'


const gImages = [
    {id: 1, url: 'img/1.jpg', keywords: ['happy']},
    {id: 2, url: 'img/2.jpg', keywords: ['happy']},
    {id: 3, url: 'img/3.jpg', keywords: ['happy']},
    {id: 4, url: 'img/4.jpg', keywords: ['happy']},
    {id: 5, url: 'img/5.jpg', keywords: ['happy']},
    {id: 6, url: 'img/6.jpg', keywords: ['happy']},
    {id: 7, url: 'img/7.jpg', keywords: ['happy']},
    {id: 8, url: 'img/8.jpg', keywords: ['happy']},
    {id: 9, url: 'img/9.jpg', keywords: ['happy']},
    {id: 10, url: 'img/10.jpg', keywords: ['happy']},
    {id: 11, url: 'img/11.jpg', keywords: ['happy']},
    {id: 12, url: 'img/12.jpg', keywords: ['happy']},
    {id: 13, url: 'img/13.jpg', keywords: ['happy']},
    {id: 14, url: 'img/14.jpg', keywords: ['happy']},
    {id: 15, url: 'img/15.jpg', keywords: ['happy']},
    {id: 16, url: 'img/16.jpg', keywords: ['happy']},
    {id: 17, url: 'img/17.jpg', keywords: ['happy']},
    {id: 18, url: 'img/18.jpg', keywords: ['happy']},

];
 

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I never eat Falafel',
            size: 20,
            align: 'left',
            color: 'red',
            font: 'Ariel',
            fontSize:'16px',
            x:100,
            y:100,
        },
        {
            txt: 'I never eat Falafel to',
            size: 22,
            align: 'center',
            color: 'blue',
            font: 'Ariel',
            fontSize:'16px',
            x:100,
            y:200,
        },

    ]
};
 
function getMemesFontSize(){
    let fontSizes = []
    gMeme.lines.forEach((line ,index,array) => {  
        fontSizes.push(line.fontSize)
    });
    return fontSizes
}

function setMemesFontSize(){
    gMeme.lines.forEach((line ,index,array) => {  
        line.fontSize = gFontSize+'px';
    });
}

function getLines(){
    let lines = []
    gMeme.lines.forEach((line ,index,array) => {  
        lines.push(line)
    });
    return lines
}

function changeTxtYposition(isUP,inputId){
    var lineInx = inputId;
    var diff = 10;
    (isUP) ? gMeme.lines[lineInx].y -= diff : gMeme.lines[lineInx].y += diff;
}

function getMemesValue(){
    var values= [];
    gMeme.lines.forEach((line ,index,array) => {  
        values.push(line.txt)
    });
    return values
}

function changeFontSize(inputId,fontSize){
    var lineInx = inputId
    //console.log(inputId,fontSize,lineInx,gMeme.lines[lineInx])
    gMeme.lines[lineInx].fontSize = fontSize+'px'
    console.log(gMeme.lines[lineInx].fontSize)
}

function changeMemeText(value,memeTxtInx){
    //console.log('changeMemeText',value,memeTxtInx ,gMeme.lines[memeTxtInx].txt)
    gMeme.lines[memeTxtInx].txt = value;
}

function updategMeme(imageId){
    var image = getImageById(imageId);
    //console.log('image', image)
    gMeme.selectedImgId = image.id;
}

function getImageUrl(){
    const image = getImageById(gMeme.selectedImgId)
    //console.log(image)
    return image.url;
}

function getImage(imageId){  
    //const imageIdx = getImageIdx(imageId);
    //const image = gImages[imageIdx];
    const image = getImageById(imageId)
    return image;
}

function getImageById(imageId) {
    return gImages.find(image => imageId === image.id);
}


function getImageIdx(imageId) {
    var imageIndex = gImages.findIndex(function (image) {
        return imageId === image.id
    })
    return imageIndex
}


function getImages() {
    var fromIdx = gPageIdx * PAGE_SIZE;  
    return gImages.slice(fromIdx, fromIdx + PAGE_SIZE)
   
}

function _saveMemesToStorage() { // save to.....
    saveToStorage(STORAGE_imageS_KEY, gMemes)
}