'use strict';
console.log('gallery controller');

var gCanvas;
var gCtx;
var gCurrShape = 'text';
const fontArial ="Ariel"; // create array fonts
const fontIMPACT ="impact";
const defaultInput = document.querySelector('.input-txt-first');
let gCurrInput = defaultInput;
let gCurrInputId = 0;
let gFontSize = 22;


function init(){
    console.log('init')
    renderGallery();
    addInputEventOnchange();
    addInputEventOnfocus();

    setMemesFontSize();
    setInputsValue();
    setInputsFontSize();
    setInputsInitialFocus();
}

function renderGallery() {
    var images = getImages();  
    //console.log('images', images)
    let strHTML = images.map((currentImage, index, array) => {
        //console.log(currentImage)    
       return `<img class="imgMemeGallery" data-imageid="${currentImage.id}" src="${currentImage.url}" onclick="selectImage(${currentImage.id})">`;
       
    })
    document.querySelector('.images').innerHTML = strHTML.join('');
    return strHTML;

}

function selectImage(imageId){
    //var image = getImage(imageId);
    //console.log('image', image)
    //let imageUrl = image.url;
    updategMeme(imageId); 
    createCanvas();
}

function setInputsInitialFocus(){

}

function onSwitchLines() {
    var lines = getLines();

    console.log('lines.length',typeof lines.length, gCurrInputId);
    if (gCurrInputId < lines.length) {
        gCurrInputId++ ;
    } 
    if (gCurrInputId === lines.length){ 
        console.log('0') 
        gCurrInputId = 0;
    }

    //console.log('final',gCurrInputId)
    let el = document.querySelector(`[data-inputid="${gCurrInputId}"]`);
    el.focus();
}

function onTxtUp(){
    let inputId = gCurrInputId;
    changeTxtYposition(true,inputId)
    renderCanvas(); //render meme
}

function onTxtDown(){
    let inputId = gCurrInputId;
    changeTxtYposition(false,inputId)
    renderCanvas(); //render meme
}


/* change font size */
function onIncreaseFontSize(diff){ 
    if (gFontSize >= 50 ) return  
    let input = gCurrInput;
    let inputId = gCurrInputId;
    let fontSize = gFontSize;

    gFontSize = gFontSize+diff;
    input.style.fontSize = fontSize+'px'; //update input dont size
    changeFontSize(inputId, fontSize); //update meme fontsize
    renderCanvas(); //render meme
}

function onDecreaseFontSize(diff){ 
    if (gFontSize <= 12) return        
    let input = gCurrInput;
    let inputId = gCurrInputId;
    let fontSize = gFontSize;

    gFontSize = gFontSize+diff;
    input.style.fontSize = fontSize+'px'; //update input dont size
    changeFontSize(inputId, fontSize); //update meme fontsize
    renderCanvas();  //render meme
}

/* set meme initial font size */


/* set input initial values */
function setInputsFontSize(){
    var values = getMemesFontSize();
    console.log(values)
    var els = document.querySelectorAll('.input')
    els.forEach((input ,index,array) => {  
        input.style.fontSize = values[index];
    });
}

function setInputsValue(){
    var values = getMemesValue();
    //console.log(values)
    var els = document.querySelectorAll('.input')
    els.forEach((input ,index,array) => {  
        input.value = values[index]
    });
}

/* event listener */
function addInputEventOnchange(){
    var els = document.querySelectorAll('.input')
    els.forEach((input ,index,array) => { 
        input.dataset.inputid = index;
        input.addEventListener('input', function () {
            gCurrInput = input;      
            var memeTxtInx = index; 
            changeMemeText(this.value,memeTxtInx); // call update gMeme servise
            renderCanvas() // render canvas
        });
    });
}

function addInputEventOnfocus(){
    var els = document.querySelectorAll('.input')
    els.forEach((input ,index,array) => {  
        input.addEventListener('focus', function () {
            gCurrInput = input;
            gCurrInputId = input.dataset.inputid;
            console.log(gCurrInput)
        });
    });
}

/* create canvas */
function createCanvas(){
    gCanvas = document.querySelector('#canvas-meme');
    gCtx = gCanvas.getContext('2d');
    console.log('The context:', gCtx);
    //console.log('image', imageUrl)
    renderCanvas(); 
}

function clearCanvas() {
    if(!gCtx) return;
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}

function renderCanvas(){
    if(!gCtx) return;
    clearCanvas(); // clear canvas for meme change
    drawImg();
}

/* draw img */
function drawImg(){
    var img = new Image()
    var imageUrl = getImageUrl();

    img.src = `${imageUrl}`;
    img.src = `${imageUrl}`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        /* draw txts on image load*/ 
        drawTexts()     
    }
}

function drawTexts(){
    //let inputId = gCurrInputId;
    gMeme.lines[1].font = fontIMPACT;
    gMeme.lines.forEach((line,index,array) => {  
        var font = `${line.fontSize} ${line.font}`
        //console.log('font',font)
        drawText(line.txt, line.x, line.y, font);  
        
    });
    
    //drawText(gMeme.lines[1].txt, gMeme.lines[1].x, gMeme.lines[1].y,gMeme.lines[1].font);
}


function drawText(text, x, y, font) {
    //console.log('draw txt',text, x, y,font)
    gCtx.strokeStyle = '#000000';
    gCtx.fillStyle = '#ffffff';
    gCtx.lineWidth = '1';
    gCtx.font = font;
    gCtx.textAlign = 'left'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

/* drag and drop txt */
var click = 0;
function draw(ev) {
    ev.preventDefault();
    //console.log(ev);
    //console.log(ev.type);

    var { offsetX, offsetY } = ev;
    console.log('ev.offsetX',ev.offsetX);
    console.log('ev.offsetY',ev.offsetY);

     const clickedText = gMeme.lines.find(line => {
         //console.log('asd',line.x,line.y)
         return offsetX > line.x && offsetX < line.x + 1000 && offsetY > line.y-40 && offsetY < line.y;
     })
    // console.log(clickedText);
 
    function onMouseMove(event){
        click++;
        offsetX = event.offsetX;
        offsetY = event.offsetY;
        console.log("switch",click,event , offsetX, offsetY)

    }


}
