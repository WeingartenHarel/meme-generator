'use strict';
console.log('meme controller');

var gCanvas;
var gCtx;
var gCurrShape = 'text';
const fontArial ="Ariel"; // create array fonts
const fontIMPACT ="impact";
const defaultInput = document.querySelector('.input-txt-first');
let gCurrInput = defaultInput;
let gFontSize = 22;
let gFilterBy = 'ALL';
let gCurrPage = 'galleryPage'
const gPages = ['galleryPage','editPage','memesPage']


function init(){
    console.log('init')  
    renderGallery();
    renderInputs()
    addInputEventOnchange();
    addInputEventOnfocus();
    setInputsValue();
    setInputsFontSize();
    setInputsInitialFocus();
    addEventOnWindowResize()
    renderSavedMemes();
    renderEmojis();
    initUpload();
    renderTags();
    //createCanvas();
}


function renderInputs(){
    var lines = getLines();
    let strHTML = lines.map((line ,index,array) => {  
        //console.log('index',line,index)
        return `<input class="input input-txt-line" data-inputid="${index}" name="input-txt-first" value="${line.txt}" placeHolder="${line.txt}"/>`;
    });
    //console.log('index',strHTML)
    document.querySelector('.inputs').innerHTML = strHTML.join('');
    return strHTML;
}

function renderEmojis(){
    var emojis = getEmojis();
    let strHTML = emojis.map((emoji ,index,array) => {  
        return `<img class="emoji" data-id="${emoji.id}" data-src="${emoji.url}" src="${emoji.url}" onclick="onAddEmoji(this,this.src)"/>`;
    });
    document.querySelector('.stickers').innerHTML = strHTML.join('');
    return strHTML;
}

function renderSavedMemes(){
    var memes = getSavedMemes()
    console.log(memes)
    if(memes ===  undefined ||  memes === null) return

    // create canvas elements
    var targets= []
    var strHTML = memes.map((meme ,index,array) => { 
        //console.log(meme)
        targets.push(`meme0${index}`);       
        return `<div class="canvasSaved">
            <canvas  class="canvasSavedMeme meme0${index}" width="750" height="500" onclick="selectMeme(${index})"></canvas>
        </div>`;       
    });
    document.querySelector('.memes').innerHTML = strHTML.join('');
    
     //create canvas
     targets.map((target ,index,array) => {
        createCanvasSavedMemes(target,memes[index])
    }); 
   
}



//i18n translation service
function setPageDirection() {
    var el = document.querySelector('body');
    //if (gLang === 'he') el.classList.add('direction-rtl')
    if (gCurrLang === 'he') {
        console.log('he')
        el.classList.add("direction-rtl");
        el.classList.remove("direction-ltr");
    } else {
        console.log('en')
        el.classList.add("direction-ltr");
        el.classList.remove("direction-rtl");
    }
    
}

function setFont() {
    var el = document.querySelector('body');
    var elMainHeader = document.querySelector('.header-books-table');
    console.log(el, elMainHeader)

    if (gCurrLang === 'he') {
        console.log('he')
        //el.style.fontFamily = 'Arimo, sans-serif !important';
    } else if (gCurrLang === 'en') {
        console.log('en')
        el.style.fontFamily = 'Roboto, sans-serif';     
    }
}

function onCHangeLang(lang) {
    console.log(lang)
    setLang(lang);
    doTrans();
    setFont()
    setPageDirection();
}


// broswer go to link
function windowLocation(url,btnName){
    window.location.href = `#${url}`;
    setActiveLink(btnName)
}

// set active link
function setActiveLink(btnName){
    var links = document.querySelectorAll(`.link`);
    var el = document.querySelector(`.link.${btnName}`);

    links.forEach(link =>{ // remove active from all links
        link.classList.remove('active');
    });
    el.classList.add('active'); //set to curr clicked btn
}

// select meme from saved meme
function selectMeme(index){
    updateGMemeFromSaved(index)
    clearCanvas()
    resetCanvas()
    renderCanvas()
}

// add emoji to meme
function onAddEmoji(el,src){
    addSticker(src);
    renderCanvas(); //render meme
}

// save meme
function onSaveMeme(){
    if (!gCanvas) return;
    if(!confirm("Save Meme to server...?") || !gCanvas) return;
    
    var meme = getGMeme();
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    console.log()
    if(vw < 750){
        //var rect = gCanvas.getBoundingClientRect(); // relative to canvas coordinates
        saveMeme(true);
        renderSavedMemes();
        return
    }

    saveMeme(false);
    renderSavedMemes();
}

// select text color
function onSelectColor(color){
    updateLineColor(color)
    renderCanvas(); //render meme
}

// select text color stroke
function onSelectColorStroke(color){
    console.log('font',color)
    updateLineColorStroke(color)
    renderCanvas(); //render meme
}

//select font
function onSelectFont(font){
    if(font==="undefined") return
    updateLineFont(font)
    renderCanvas(); //render meme
}

//select text align
function onTextAlign(align){
    textAlign(align)
    renderCanvas(); //render meme
}

// add text input (line)
function onAddLine(){
    var isCanvas = gMeme;
    if(!isCanvas) return
    addLine();
    renderInputs();
    addInputEventOnchange();
    addInputEventOnfocus();
    setInputsFontSize();
    renderCanvas(); //render meme
    //addCanvasEventListener()
}

// set inputs inital focus
function setInputsInitialFocus(){
    var selectedLine = getSelectedLineIdx();
    //console.log(selectedLine,'selectedLine')
    let el = document.querySelector(`[data-inputid="${selectedLine}"]`);
    el.focus();
}

// switch beetween input lines 
function onSwitchLines() {
    var selectedLine = setSelectedLine();
    let el = document.querySelector(`[data-inputid="${selectedLine}"]`);
    el.focus();  
}

// change text pos up
function onTxtUp(){
    let inputId = getSelectedLineIdx();
    changeTxtPosition(true,inputId)
    renderCanvas(); //render meme
}

// change text pos down
function onTxtDown(){
    let inputId = getSelectedLineIdx();
    changeTxtPosition(false,inputId)
    renderCanvas(); //render meme
}

/* change font size increace */
function onIncreaseFontSize(){
    var inputIdx = getSelectedLineIdx();
    var fontSize = getSelectedFontSize(inputIdx);   
    var input = document.querySelector(`[data-inputid="${inputIdx}"]`);

    changeFontSizeInceace() //update meme fontsize
    input.style.fontSize = fontSize+'px'; //update input dont size
    renderCanvas(); //render meme
}

/* change font size decreace */
function onDecreaseFontSize(){
    var inputIdx = getSelectedLineIdx();        
    var fontSize = getSelectedFontSize(inputIdx);render
    var input = document.querySelector(`[data-inputid="${inputIdx}"]`);

    changeFontSizeDecrese(); //update meme fontsize
    input.style.fontSize = fontSize+'px'; //update input dont size
    renderCanvas(); //render meme
}

/* set input initial values */
function setInputsFontSize(){
    var values = getMemesFontSize();
    var els = document.querySelectorAll('.input-txt-line')
    els.forEach((input ,index,array) => { 
        //console.log(input)
        input.style.fontSize = values[index]+'px';
    });
}

// set input value (txt)
function setInputsValue(){
    var values = getMemesTxt();
    var els = document.querySelectorAll('.input-txt-line')
    els.forEach((input ,index,array) => {  
        input.value = values[index]
    });
}

/* se event listener oncahnge to all inputs*/
function addInputEventOnchange(){
    var elSearch = document.querySelector('.inputSearch')
    elSearch.addEventListener('input', searchGallery);
    
    var els = document.querySelectorAll('.input-txt-line')
    els.forEach((input ,index,array) => { 
        input.dataset.inputid = index;
        input.addEventListener('input', function () {   
            var memeTxtInx = index; 
            changeMemeText(this.value,memeTxtInx); // call update gMeme servise
            renderCanvas() // render canvas on input txt change
        });
    });
}

// set event listener focus to all input
function addInputEventOnfocus(){
    var els = document.querySelectorAll('.input-txt-line')
    els.forEach((input ,index,array) => {  
        input.addEventListener('focus', function () {
            setSelectedLineIdx(index)  
        });
    });
}

// add event listener for window resize 
function addEventOnWindowResize(){
    if(!gCanvas) return
    window.addEventListener('resize', resizeCanvasByContainer);
}

/* create canvas for saved memes */
function createCanvasSavedMemes(target = '#canvas-meme',meme){
    var canvas = document.querySelector(`.${target}`);
    var ctx = canvas.getContext('2d')

    var img = new Image()
    var imageUrl = 'img/'+meme.selectedImgId+'.jpg';

    img.src = `${imageUrl}`;
    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        /* draw txts on image load*/ 
        drawMemesTexts(meme,ctx)  
        drawMemesStickers(meme,ctx)   
    }
}

// draw saved meme text
function drawMemesTexts(meme,ctx){
    meme.lines.forEach((line,index,array) => {  
        var font = `${line.fontSize}px ${line.font}`
        drawMemeText(ctx,line,font);         
    });
}

// draw each txt
function drawMemeText(ctx,line,font) {
    ctx.strokeStyle = line.colorStroke;
    ctx.fillStyle = line.color;
    ctx.lineWidth = '1';
    ctx.font = font;
    ctx.textAlign = line.align
    ctx.fillText(line.txt, line.x, line.y)
    ctx.strokeText(line.txt, line.x, line.y)
}

// draw saved meme stickers
function drawMemesStickers(meme,ctx){
    meme.stickers.forEach((sticker,index,array) => { 
        drawMemesSticker(ctx,sticker);         
    });
   
}

// draw each sticker
function drawMemesSticker(ctx,sticker){
    var img = new Image();
    img.src = sticker.imgUrl;
    img.onload = () => {
        ctx.drawImage(img, sticker.x, sticker.y, sticker.width , sticker.height);
    }
}

/* create canvas meme*/
function createCanvas(target = '#canvas-meme',meme){
    gCanvas = document.querySelector(`${target}`);
    gCtx = gCanvas.getContext('2d');
    resetCanvas() 
}

//reset canvas
function resetCanvas(){
    //resizeCanvasByContainer() //contains renderCanvas();     
    addCanvasEventListener()
    setInputsInitialFocus()
}

//clear canvas
function clearCanvas() {
    if(!gCtx) return;
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}

//render canvas
function renderCanvas(imgUpload){
    if(!gCtx) return;
    //clearCanvas(); // clear canvas for meme change
    resizeCanvasByContainer
    drawImg(imgUpload);  //img
}

/* draw img */
function drawImg(imgUpload){
    //console.log('render canvas',imgUpload)
    if(imgUpload) gCtx.drawImage(imgUpload, 0, 0, gCanvas.width, gCanvas.height) , drawTexts() , drawStickers()  // img = imgUpload 
    else {
        var img = new Image()
        var imageUrl = getImageUrl();
        if(!imageUrl) return
        img.src = `${imageUrl}`;
        img.onload = (ev) => {
            gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);

            /* draw txts on image load*/        
            drawTexts() 
            drawStickers()       
        }
    }
}

// draw meme texts
function drawTexts(){
    var lines = getLines();
    lines.forEach((line,index )=> {  
        var font = `${line.fontSize}px ${line.font}`
        drawText(line,index, font);         
    });
}

// draw each text
function drawText(line,index, font) {
    gCtx.strokeStyle = line.colorStroke;
    gCtx.fillStyle = line.color;
    gCtx.lineWidth = '1';
    gCtx.font = font;
    gCtx.textAlign = line.align
    gCtx.fillText(line.txt, line.x, line.y)
    gCtx.strokeText(line.txt, line.x, line.y)
}

// draw meme stickers
function drawStickers(){
    var stickers =  getSticker()
    if(!stickers || stickers.length === 0 ) return
    stickers.map((sticker, index, array) => {
        var img = new Image();
        img.src = sticker.imgUrl;
        img.onload = () => {
            gCtx.drawImage(img, sticker.x, sticker.y, sticker.width , sticker.height);                  
        }     
    })  

}

/* add event listener to canvas */
function addCanvasEventListener(){   
    var el = document.querySelector('.canvas-meme');
       
    el.addEventListener('mousedown', canvasOnMouseDown); // click event   
    el.addEventListener("touchstart", canvasOnTouchStart , false); // touch event
}

/* drag and drop txt click*/
function canvasOnMouseDown(ev) {
    ev.preventDefault();
    var el = ev.target;
    var mouseDownOffsetX = ev.offsetX
    var mouseDownOffsetY = ev.offsetY;

    // check click text
    var lines = getLines();
    console.log ('lines',lines)
    var checkClickedLine = lines.find(line => {
        console.log(line)
        var lineTxtWidth = gCtx.measureText(line.txt).width;
        switch(line.align) {
            case 'left':
                return mouseDownOffsetX > line.x && mouseDownOffsetX < line.x + lineTxtWidth && mouseDownOffsetY > line.y-line.fontSize && mouseDownOffsetY < line.y;       
            case 'center':
                return mouseDownOffsetX > line.x - (lineTxtWidth/2) && mouseDownOffsetX < line.x + (lineTxtWidth/2)  && mouseDownOffsetY > line.y-line.fontSize && mouseDownOffsetY < line.y;
            case 'right':
                return mouseDownOffsetX > line.x && mouseDownOffsetX < line.x - lineTxtWidth && mouseDownOffsetY > line.y-line.fontSize && mouseDownOffsetY < line.y;    
            }
    })

    var mouseMoveOffsetX = 0;
    var mouseMoveOffsetY = 0;

    if(checkClickedLine){ 
        console.log(checkClickedLine)
        var lineIndex =  getLineIdByTxt(checkClickedLine.txt)
        var elInput = document.querySelector(`[data-inputid="${lineIndex}"]`);
        elInput.focus();
        el.onmousemove  = dragText;
        
    };
    
    function dragText(ev){ 
        mouseMoveOffsetX = ev.offsetX;
        mouseMoveOffsetY = ev.offsetY;
        checkClickedLine.x = mouseMoveOffsetX;
        checkClickedLine.y = mouseMoveOffsetY;
        renderCanvas() // render canvas
    }
    
    // check click sticker
    var checkClickedSticker = gMeme.stickers.find(sticker => {
        return mouseDownOffsetX > sticker.x && mouseDownOffsetX < sticker.x+sticker.width && mouseDownOffsetY > sticker.y && mouseDownOffsetY < sticker.y+sticker.height;       

    });

    if(checkClickedSticker){ 
        el.onmousemove  = dragSticker;        
    };

    function dragSticker(ev){ 
        console.log(ev)
        mouseMoveOffsetX = ev.offsetX;
        mouseMoveOffsetY = ev.offsetY;
        checkClickedSticker.x = mouseMoveOffsetX;
        checkClickedSticker.y = mouseMoveOffsetY;
        renderCanvas() // render canvas
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        el.onmouseup = null;
        el.onmousemove = null;
    } 
    el.onmouseup = closeDragElement;
}

/* drag and drop txt touch*/
function canvasOnTouchStart(ev) {
    ev.preventDefault();
    console.log(ev.type);
    var el = ev.target;
    var rect = gCanvas.getBoundingClientRect(); // relative to canvas coordinates
    var mouseDownOffsetX = ev.touches[0].clientX - rect.left;
    var mouseDownOffsetY = ev.touches[0].clientY - rect.top;

    console.log(mouseDownOffsetX, mouseDownOffsetY)
       // check click text
    var checkClickedLine = gMeme.lines.find(line => {
        var lineTxtWidth = gCtx.measureText(line.txt).width;
        //console.log('click line.align',line.align)
        switch(line.align) {
            case 'left':
                return mouseDownOffsetX > line.x && mouseDownOffsetX < line.x + lineTxtWidth && mouseDownOffsetY > line.y-line.fontSize && mouseDownOffsetY < line.y;         
            case 'center':
                return mouseDownOffsetX > line.x - (lineTxtWidth/2) && mouseDownOffsetX < line.x + (lineTxtWidth/2)  && mouseDownOffsetY > line.y-line.fontSize && mouseDownOffsetY < line.y;
            case 'right':
                return mouseDownOffsetX > line.x && mouseDownOffsetX < line.x - lineTxtWidth && mouseDownOffsetY > line.y-line.fontSize && mouseDownOffsetY < line.y;         
            }
    })

    var [mouseMoveOffsetX , mouseMoveOffsetY] = [0,0];
    //console.log('line drag',mouseMoveOffsetX,mouseMoveOffsetY)
    if(checkClickedLine) {
        var lineIndex =  getLineIdByTxt(checkClickedLine.txt)
        var elInput = document.querySelector(`[data-inputid="${lineIndex}"]`);
        if(screen.width > 1100 ) elInput.focus();     
        el.ontouchmove = dragText;
    }  
   
    function dragText(ev){  
        ev.preventDefault();
        //console.log(ev);    
        mouseMoveOffsetX = ev.touches[0].clientX - rect.left;
        mouseMoveOffsetY = ev.touches[0].clientY - rect.top;
        checkClickedLine.x = mouseMoveOffsetX;
        checkClickedLine.y = mouseMoveOffsetY;
        renderCanvas() // render canvas
    }

    // check click sticker
    var checkClickedSticker = gMeme.stickers.find(sticker => {
        return mouseDownOffsetX > sticker.x && mouseDownOffsetX < sticker.x+sticker.width && mouseDownOffsetY > sticker.y && mouseDownOffsetY < sticker.y+sticker.height;       
    });

    if(checkClickedSticker){ 
        console.log(checkClickedSticker)
        el.ontouchmove  = dragSticker;
    };

    function dragSticker(ev){ 
        console.log('ev.touches[0].clientX',ev.touches[0].clientX)
        mouseMoveOffsetX = ev.touches[0].clientX - rect.left;
        mouseMoveOffsetY = ev.touches[0].clientY - rect.top;
        checkClickedSticker.x = mouseMoveOffsetX;
        checkClickedSticker.y = mouseMoveOffsetY;
        renderCanvas() // render canvas
    }

    function closeDragElement() {
    // stop moving when mouse button is released:
        el.onmouseup = null;
        el.onmousemove = null;
    } 

    el.ontouchend = closeDragElement;

}

//resize canvas by container size with render canvas
function resizeCanvasByContainer() {
    var ratio = 500 / 750; // canvas height aspect ratio 

    var elContainer = document.querySelector('.canvas');    
    var elCanvasMeme = document.querySelector('.canvas-meme');
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)

    console.log('vw',vw)
    //elContainer.style.height =  elContainer.offsetWidth * ratio +"px"// set 1:1 ratio to .canvas 
    //console.log("resize" , elContainer.offsetWidth ,ratio)
    if(vw < 750){
        elCanvasMeme.width  = elContainer.offsetWidth 
        elCanvasMeme.height = elContainer.offsetWidth
    }
    //elContainer.height
    //if(!gCanvas) return 
    //renderCanvas(); //render meme
}


// open menu on mobile
function toggleMenu() {
    document.body.classList.toggle('menu-open');
}

//open close dropdown menu
function toggleDropDown(){
    document.body.classList.toggle('drop-down-open'); 
}  