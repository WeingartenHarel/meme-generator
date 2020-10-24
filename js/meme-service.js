'use strict';
console.log('gallery service')

const PAGE_SIZE = 10;
let gPageIdx = 0;
const STORAGE_MEMES_KEY = 'memesDB'
var gMemes = getSavedMemes();

const gImages = [
    {id: 1, url: 'img/1.jpg', keywords: ['trump' , 'politic']},
    {id: 2, url: 'img/2.jpg', keywords: ['baby' , 'funny' ]},
    {id: 3, url: 'img/3.jpg', keywords: ['tv', 'know' ]},
    {id: 4, url: 'img/4.jpg', keywords: ['tv', 'quets','austin','film' ]},
    {id: 5, url: 'img/5.jpg', keywords: ['happy', 'smile', 'politic','obama']},
    {id: 6, url: 'img/6.jpg', keywords: ['hug' , 'kiss','sport']},
    {id: 7, url: 'img/7.jpg', keywords: ['kids','dance','happy']},
    {id: 8, url: 'img/8.jpg', keywords: ['trump' , 'politic' ]},
    {id: 9, url: 'img/9.jpg', keywords: ['happy','baby','smile','suprise']},
    {id: 10, url: 'img/10.jpg', keywords: ['happy' , 'dog' , 'funny']},
    {id: 11, url: 'img/11.jpg', keywords: ['happy','cheers','smile','celeb','leo']},
    {id: 12, url: 'img/12.jpg', keywords: ['dog' , 'animal','smile']},
    {id: 13, url: 'img/13.jpg', keywords: ['matrix', 'movie']},
    {id: 14, url: 'img/14.jpg', keywords: ['movie']},
    {id: 15, url: 'img/15.jpg', keywords: ['tv','show','oprah']},
    {id: 16, url: 'img/16.jpg', keywords: ['movie','startrek']},
    {id: 17, url: 'img/17.jpg', keywords: ['politics', 'russia']},
    {id: 18, url: 'img/18.jpg', keywords: ['movie','toy']},
    {id: 19, url: 'img/19.jpg', keywords: ['dog' , 'sleep','baby' , 'animal']},
    {id: 20, url: 'img/20.jpg', keywords: ['cat', 'animal','computer']},
    {id: 21, url: 'img/21.jpg', keywords: ['tv','show', 'point']},
    {id: 22, url: 'img/22.jpg', keywords: ['tv','show','reality']},
    {id: 23, url: 'img/23.jpg', keywords: ['movie','']},
    {id: 24, url: 'img/24.jpg', keywords: ['baby', 'win']},
    {id: 25, url: 'img/25.jpg', keywords: ['movie','smile']},
];

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
    selectedImgId: undefined,
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


function getImgesByFilter() {
    if (gFilterBy === 'ALL') return gImages;
    var res = []
    gImages.forEach(function(image){
        //console.log(image);
        //console.log(gFilterBy);
        
        image.keywords.filter(function(keyword){
            //console.log(keyword);
            if(keyword === gFilterBy){
                res.push(image)     
            }
        })
        
    })
    //console.log(res)
    return res;
}

function setFilter(filterBy) {
    gFilterBy = filterBy;
}

function getAllKeywords(){
    var images = getGImages()
    var tags = getAllTags(images);
    var tagsMaped =  mapArrayToValueCount(tags)

    return tagsMaped
}

function getAllTags(images){ //ok
    var tags =[]
    images.forEach((image) => {
        //console.log(image)
        image.keywords.forEach((tag) => {
            //console.log(tag)
            tags.push(tag)
        });
    });
    return tags
}

function mapArrayToValueCount(array){
    var counts = array.reduce(function (acc, tag) { //ok
        // console.log('Called with ', acc, tag);
        if (!acc[tag]) acc[tag] = 0;
        acc[tag]++
        return acc;
    }, {})
    return counts
}

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
 
function saveMeme(){  //
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

function filterGallery(searchTag){ //ok
    var images = getGImages()
    var results=[];
    images.map((image,indexImage) => {
        image.keywords.find((tag,indexTag) => {
            if(tag === searchTag){
                results.push(images[indexImage]);
            }
        });  
    });
    return results   
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
    var meme = getGMeme();
    return meme.selectedLineIdx = index;
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
    var lineInx = inputId;
    var diff = 10;
    (isUP) ? meme.lines[lineInx].y -= diff : meme.lines[lineInx].y += diff;
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
    let meme = gMeme
    return meme
}

function getGImages(){ //ok
    let images = gImages
    return images
}

function getImageUrl(){ //ok
    const image = getImageById(gMeme.selectedImgId)
    return image.url;
}

function getImage(imageId){  //ok
    const image = getImageById(imageId)
    return image;
}

function getImageById(imageId) { //ok
    return gImages.find(image => imageId === image.id);
}

function getImageIdx(imageId) { // not in use error on server sync
    var imageIndex = gImages.findIndex(function (image) {
        return imageId === image.id
    })
    return imageIndex
}

function getImages() { //ok
    var fromIdx = gPageIdx * PAGE_SIZE;  
    return gImages.slice(fromIdx, fromIdx + PAGE_SIZE)
   
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