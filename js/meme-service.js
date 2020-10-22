'use strict';
console.log('gallery service')

const PAGE_SIZE = 10;
let gPageIdx = 0;
const STORAGE_MEMES_KEY = 'memesDB'
var gMemes = getSavedMemes();

const gImages = [
    {id: 1, url: 'img/1.jpg', keywords: ['trump' , 'politic']},
    {id: 2, url: 'img/2.jpg', keywords: ['happy' , 'dog' , 'smile']},
    {id: 3, url: 'img/3.jpg', keywords: ['dog' , 'sleep','baby' , 'animal']},
    {id: 4, url: 'img/4.jpg', keywords: ['computer', 'cat' ,'animal']},
    {id: 5, url: 'img/5.jpg', keywords: ['baby' , 'funny' ]},
    {id: 6, url: 'img/6.jpg', keywords: ['tv', 'know']},
    {id: 7, url: 'img/7.jpg', keywords: ['happy','baby','smile','suprise']},
    {id: 8, url: 'img/8.jpg', keywords: ['happy', 'funny' , 'tv']},
    {id: 9, url: 'img/9.jpg', keywords: ['happy','smile']},
    {id: 10, url: 'img/10.jpg', keywords: ['happy', 'smile', 'politic','obama']},
    {id: 11, url: 'img/11.jpg', keywords: ['hug' , 'kiss','sport']},
    {id: 12, url: 'img/12.jpg', keywords: ['tv','point','funny']},
    {id: 13, url: 'img/13.jpg', keywords: ['happy','cheers','smile','celeb','leo']},
    {id: 14, url: 'img/14.jpg', keywords: ['matrix', 'movie']},
    {id: 15, url: 'img/15.jpg', keywords: ['movie']},
    {id: 16, url: 'img/16.jpg', keywords: ['movie','startrek']},
    {id: 17, url: 'img/17.jpg', keywords: ['politics', 'russia']},
    {id: 18, url: 'img/18.jpg', keywords: ['movie','toy']},
];
 

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'We need Coffee',
            size: 20,
            align: 'center',
            color: 'white',
            colorStroke: 'black',
            font: 'impact',
            fontSize:30,
            x:350,
            y:50,
        },
        {
            txt: 'Lots of Coffee',
            size: 22,
            align: 'center',
            color: 'white',
            colorStroke: 'black',
            font: 'impact',
            fontSize:30,
            x:350,
            y:400,
        },

    ]
};

getSavedMemes()
function getSavedMemes(){
    var memes = _loadMemesFromStorage();
    if (!memes || !memes.length) return undefined
    console.log(memes)
    return memes
}
 
function saveMeme(){ 
    gMemes.push(gMeme)
    _saveMemesToStorage()
}

function updateMemesPosition(canvas){
    console.log(canvas.width / 2)   
    gMeme.lines.forEach((line,index,array) => {  
        line.x = canvas.width / 2;
    });
}

function filterGallery(searchTag){
    var results=[];
    gImages.map((image,indexImage) => {
        //console.log(image,index)      
        image.keywords.find((tag,indexTag) => {
            //console.log(tag)
            if(tag === searchTag){
                results.push(gImages[indexImage]);
                //console.log(results)
            }
        });  

    });
    return results 
   
}

function UpdateLines(){
    var line = _createLine();
    if(gMeme.lines.length > 4) return
    gMeme.lines.push(line)
    console.log(gMeme);
}

function updateLineColor(color){
    var selectedLine = gMeme.selectedLineIdx;
    gMeme.lines[selectedLine].color = color;
}

function updateLineColorStroke(color){
    var selectedLine = gMeme.selectedLineIdx;
    gMeme.lines[selectedLine].colorStroke = color;
}

function updateLineFont(font){
    var selectedLine = gMeme.selectedLineIdx;
    gMeme.lines[selectedLine].font = font;
}

function textAlign(align ,selectedLine){
    var selectedLine = gMeme.selectedLineIdx;
    gMeme.lines[selectedLine].align = align;
}

function setSelectedLine(){
    var lines = getLines();
    var selectedLine = getSelectedLineIdx();
    console.log(selectedLine,lines,lines.length)
    selectedLine < lines.length ? selectedLine++ : console.log('');
    if (selectedLine === lines.length) selectedLine = 0;
    console.log('selectedLine after',selectedLine)
    gMeme.selectedLineIdx = selectedLine;
    console.log('gMeme.selectedLineIdx',gMeme.selectedLineIdx)
    return selectedLine;
}

function setSelectedLineIdx(index){
    return gMeme.selectedLineIdx = index;
}

function getSelectedLineIdx(){
    return gMeme.selectedLineIdx;
}

/*
function updateSelectedLine(selectedInputId){
    gMeme.selectedLineIdx = selectedInputId;
    console.log(gMeme);
}
*/

function getSelectedFontSize(inputIdx){
    //console.log(gMeme.lines[inputIdx].fontSize);
    return gMeme.lines[inputIdx].fontSize
}

function getFontSizeBYInputFocus(inputId){
    return gMeme.lines[inputId].fontSize
}

function getMemesFontSize(){
    let fontSizes = []
    gMeme.lines.forEach((line ,index,array) => {  
        fontSizes.push(line.fontSize)
    });
    return fontSizes
}

/* set meme initial font size */
function setMemesFontSize(){
    gMeme.lines.forEach((line ,index,array) => {  
        line.fontSize = gFontSize;
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

function changeFontSizeInceace(){
    var lineInx = getSelectedLineIdx()
    var inputIdx = getSelectedLineIdx();
    var fontSize = getSelectedFontSize(inputIdx);

    if (fontSize >= 120 ) return  
    fontSize++

    gMeme.lines[lineInx].fontSize = fontSize;
    console.log(gMeme.lines[lineInx].fontSize)
}

function changeFontSizeDecrese(){
    var lineInx = getSelectedLineIdx()
    var inputIdx = getSelectedLineIdx();
    var fontSize = getSelectedFontSize(inputIdx);

    if (gFontSize <= 12) return  
    fontSize--

    gMeme.lines[lineInx].fontSize = fontSize;
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

function prevPage() {
    gPageIdx--;
    console.log(gPageIdx)
    if (gPageIdx * PAGE_SIZE < 0) gPageIdx = 0;
}

function nextPage() {
    gPageIdx++;
    if (gPageIdx * PAGE_SIZE >= gImages.length) gPageIdx = 0;
}

function getImages() {
    var fromIdx = gPageIdx * PAGE_SIZE;  
    return gImages.slice(fromIdx, fromIdx + PAGE_SIZE)
   
}

function _createLine(txt,size,align,color,font,fontSize,x,y){
    var line = {
        txt: 'We need more Coffee',
        size: 22,
        align: 'center',
        color: 'white',
        colorStroke: 'black',
        font: 'Ariel',
        fontSize:'16px',
        x:100,
        y:200,
    };
    return line

}

function _saveMemesToStorage() { // save to.....
    saveToStorage(STORAGE_MEMES_KEY, gMemes)
}

function _loadMemesFromStorage() { // load.....
    var memes = loadFromStorage(STORAGE_MEMES_KEY)
    return memes
}