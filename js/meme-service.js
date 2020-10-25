'use strict';
console.log('memes service')

const STORAGE_MEMES_KEY = 'memesDB'
var gMemes = getSavedMemes();

const gEmojis = [
    {id: 1, url: 'img/emoji/emoji1.gif'},
    {id: 2, url: 'img/emoji/emoji2.gif'},
    {id: 3, url: 'img/emoji/emoji3.gif'},
    {id: 4, url: 'img/emoji/emoji4.gif'},
    {id: 5, url: 'img/emoji/emoji5.gif'},
    {id: 6, url: 'img/emoji/emoji6.gif'},
    {id: 7, url: 'img/emoji/emoji7.gif'},
    {id: 8, url: 'img/emoji/emoji8.gif'},
    {id: 9, url: 'img/emoji/emoji9.gif'},
    {id: 10, url: 'img/emoji/emoji10.gif'},
    {id: 11, url: 'img/emoji/emoji11.gif'},
    {id: 12, url: 'img/emoji/emoji12.gif'},
  
];


var gMeme = {
    selectedImgId: 1,
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
    ],
    stickers: [

    ]  
};


// set functions
function updateGMemeFromSaved(index){ //ok
    var savedMemes = getSavedMemes();
    var selectMeme = savedMemes[index];
    console.log(selectMeme)
    gMeme = selectMeme;

}

function addSticker(src){ //ok
    var meme = getGMeme();
    var sticker =  _createSticker(src)
    meme.stickers.push(sticker)
    //console.log(sticker)
}
 
function saveMeme(){  // ok
    var meme = getGMeme();
    var clone = JSON.parse(JSON.stringify(meme));
    //console.log(result)
    gMemes.push(clone)
    _saveMemesToStorage()
}

function updateMemesPositionCenter(canvas){ //ok
    //console.log(canvas.width / 2) 
    var lines = getLines();  
    lines.forEach((line,index,array) => {  
        line.x = canvas.width / 2;

    });
    lines[0].y = 30;
    lines[1].y = canvas.height-20;
}

function addLine(){ // ok
    var meme = getGMeme();
    var line = _createLine();
    if(meme.lines.length > 3) return
    meme.lines.push(line)
    //console.log(meme);
}

function updateLineColor(color){ //ok
    var meme = getGMeme();
    var selectedLine = gMeme.selectedLineIdx;
    meme.lines[selectedLine].color = color;
}

function updateLineColorStroke(color){ //ok
    var meme = getGMeme();
    var selectedLine = gMeme.selectedLineIdx;
    meme.lines[selectedLine].colorStroke = color;
}

function updateLineFont(font){ //ok
    var meme = getGMeme();
    var selectedLine = gMeme.selectedLineIdx;
    meme.lines[selectedLine].font = font;
}

function textAlign(align ,selectedLine){ //ok
    var meme = getGMeme();
    var selectedLine = gMeme.selectedLineIdx;
    meme.lines[selectedLine].align = align;
}

function setSelectedLine(){ //ok
    var meme = getGMeme();
    var lines = getLines();
    var selectedLine = getSelectedLineIdx();

    selectedLine < lines.length ? selectedLine++ : console.log('');
    if (selectedLine === lines.length) selectedLine = 0;
    meme.selectedLineIdx = selectedLine;
    return selectedLine;
}

function setSelectedLineIdx(index){ //ok
    gMeme.selectedLineIdx = index;
}

/* set meme initial font size */
function setMemesFontSize(){ //not in use font size taken from modal
    var meme = getGMeme();
    meme.lines.forEach((line ,index,array) => {  
        line.fontSize = gFontSize;
    });
}

function changeTxtPosition(isUP,inputId){ //ok
    var meme = getGMeme();
    var lineInx = meme.selectedLineIdx;
    var diff = 10;
    (isUP) ? gMeme.lines[lineInx].y -= diff : meme.lines[lineInx].y += diff;
}

function changeFontSizeInceace(){ //ok
    var meme = getGMeme();
    var lineInx = getSelectedLineIdx()
    var inputIdx = getSelectedLineIdx();
    var fontSize = getSelectedFontSize(inputIdx);

    if (fontSize >= 120 ) return  
    fontSize++

    meme.lines[lineInx].fontSize = fontSize;
    console.log(gMeme.lines[lineInx].fontSize)
}

function changeFontSizeDecrese(){ //ok
    var meme = getGMeme();
    var lineInx = getSelectedLineIdx()
    var inputIdx = getSelectedLineIdx();
    var fontSize = getSelectedFontSize(inputIdx);

    if (gFontSize <= 12) return  
    fontSize--

    meme.lines[lineInx].fontSize = fontSize;
    console.log(gMeme.lines[lineInx].fontSize)
}

function changeMemeText(value,memeTxtInx){ //ok
    var meme = getGMeme();
    meme.lines[memeTxtInx].txt = value;
}

function updateGMeme(imageId){ //ok
    var meme = getGMeme();
    var image = getImageById(imageId);
    meme.selectedImgId = image.id;
}

function prevPage() { //ok
    gPageIdx--;
    console.log(gPageIdx)
    if (gPageIdx * PAGE_SIZE < 0) gPageIdx = 0;
}

function nextPage() { //ok
    var images = getGImages()
    gPageIdx++;
    if (gPageIdx * PAGE_SIZE >= images.length) gPageIdx = 0;
}

// get functions
function getEmojis(){ //ok
    return gEmojis;
}

function getSticker(){ //ok
    return gMeme.stickers;
}

function getStickerUrlByIndex(stickerIndex){ //not in use
    var url = gMeme.stickers[stickerIndex].imgUrl;
    return url
}

function getStickerBySrc(src){ //not in use
    var sticker = gMeme.stickers.find(element => element.imgUrl = src);
    return sticker;
}

function getStickerIndexBySrc(src){ //not in use
    var index = gMeme.stickers.map(function(e) { return e.imgUrl; }).indexOf(`${src}`); 
    return index;
}

function getLineIdByTxt(txt='We need Coffee'){ //ok 
    var index = gMeme.lines.map(function(e) { return e.txt; }).indexOf(`${txt}`); 
    return index;
}

function getSavedMemes(){ //ok
    var memes = _loadMemesFromStorage();
    if (!memes || !memes.length || memes===null) memes =[]
    //console.log(memes)
    return memes
}

function getSelectedLineIdx(){ //ok
    return gMeme.selectedLineIdx;
}

function getSelectedFontSize(inputIdx){ //ok
    return gMeme.lines[inputIdx].fontSize
}

function getFontSizeBYInputFocus(inputId){ // not in use
    return gMeme.lines[inputId].fontSize
}

function getMemesFontSize(){ //ok
    let fontSizes = []
    gMeme.lines.forEach((line ,index,array) => {  
        fontSizes.push(line.fontSize)
    });
    return fontSizes
}

function getMemesTxt(){ //ok
    var values= [];
    gMeme.lines.forEach((line ,index,array) => {  
        values.push(line.txt)
    });
    return values
}

function getLines(){ //ok
    let lines = []
    gMeme.lines.forEach((line ,index,array) => {  
        lines.push(line)
    });
    return lines
}

function getGMemes(){ //ok
    let memes = gMemes
    return memes
}

function getGMeme(){ //ok
    var meme = gMeme
    return meme
}

function _createSticker(src){
    var sticker =  {
        imgUrl:src,
        x:10,
        y:10,
        width:40,
        height:40,
    };

    return sticker

}

function _createLine(txt,size,align,color,font,fontSize,x,y){
    var line = {
        txt: 'We need more Coffee',
        size: 22,
        align: 'left',
        color: 'white',
        colorStroke: 'black',
        font: 'Ariel',
        fontSize:'16px',
        x:40,
        y:40,
    };
    return line

}

function _saveMemesToStorage() { // save to.....
    console.log('save to')
    saveToStorage(STORAGE_MEMES_KEY, gMemes)
}

function _loadMemesFromStorage() { // load.....
    var memes = loadFromStorage(STORAGE_MEMES_KEY)
    return memes
}