'use strict';
console.log('gallery controller');

var gCanvas;
var gCtx;
var gCurrShape = 'text';
const fontArial ="Ariel"; // create array fonts
const fontIMPACT ="impact";
const defaultInput = document.querySelector('.input-txt-first');
let gCurrInput = defaultInput;
let gFontSize = 22;
let gFilterBy = 'ALL';

function init(){
    console.log('init')
    resizeCanvasByContainer()
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
}

function renderGallery(imagesResult) {
    //console.log('imagesResult',imagesResult)
    
    var images 
    if (!imagesResult) images = getImages();
    else images = imagesResult;    
    //console.log('images', images)  
    
    let strHTML = images.map((currentImage, index, array) => {
       //console.log(currentImage)    
       return `<img class="imgMemeGallery" data-imageid="${currentImage.id}" src="${currentImage.url}" onclick="selectImage(${currentImage.id})">`;
       
    })
    document.querySelector('.images').innerHTML = strHTML.join('');
    return strHTML;

}

function renderInputs(){
    var lines = getLines();
    let strHTML = lines.map((line ,index,array) => {  
        return `<input class="input input-txt-line" data-inputid="${index}" name="input-txt-first" value="${line.txt}" placeHolder="${line.txt}"/>`;
    });
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

function renderTags(){
    console.log('keywords')
    var keywords =  getAllKeywords();
    keywords.ALL = 8;
    console.log(keywords)
    var strHTML =  Object.entries(keywords).map(([key, value]) => {
        //console.log(`${key} ${value}`);
        return `<div class="tag align-self-center" onclick="onSetFilter('${key}')" style="font-size:calc(20px + ${value}*2px)">${key}</div>`;
    });
    //console.log(strHTML)  
    document.querySelector('.tags').innerHTML = strHTML.join(''); 
}

function onSetFilter(filterBy) {
    setFilter(filterBy)
    var images = getImgesByFilter();
    //console.log(images)
    renderGallery(images);
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

// paganition 
function onPrevPage() {
    prevPage();
    renderGallery();
    windowLocation('#galleryMain');
}

function onNextPage() {
    nextPage();
    renderGallery();
    windowLocation('#galleryMain');
}

// broswer go to link
function windowLocation(url){
    window.location.href = url;
}

// select image for meme
function selectImage(imageId){
    //debugger
    var canvas = gCanvas;
    updateGMeme(imageId);
    updateMemesPositionCenter(canvas); 
    createCanvas();
}

// select meme from saved meme
function selectMeme(index){
    updateGMemeFromSaved(index)
    renderCanvas()
}

// add emoji to meme
function onAddEmoji(el,src){
    //console.log(el) //console.log(src)//console.log(gCtx)
    addSticker(src);
    renderCanvas(); //render meme
}

// save meme
function onSaveMeme(){
    if (!gCanvas) return;
    if(!confirm("Save Meme to server...?") || !gCanvas) return;
    saveMeme();
    renderSavedMemes();
}

//search gallery by filter
function searchGallery(e){
    //console.log(e.target.value)
    var searchTag = e.target.value
    var results = filterGallery(searchTag)
    renderGallery(results)
}

// select text color
function onSelectColor(color){
    //console.log('font',color)
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
    var isCanvas = getSelectedLineIdx();
    if(!isCanvas) return
    addLine();
    renderInputs();
    setInputsFontSize();
    renderCanvas(); //render meme
}

// set inputs inital focus
function setInputsInitialFocus(){
    var selectedLine = getSelectedLineIdx();
    let el = document.querySelector(`[data-inputid="${selectedLine}"]`);
    //console.log('setFocus',el)
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
    //console.log(values)
    var els = document.querySelectorAll('.input-txt-line')
    els.forEach((input ,index,array) => { 
        //console.log(input)
        input.style.fontSize = values[index]+'px';
    });
}

// set input value (txt)
function setInputsValue(){
    var values = getMemesTxt();
    //console.log(values)
    var els = document.querySelectorAll('.input-txt-line')
    //console.log(els)
    els.forEach((input ,index,array) => {  
        input.value = values[index]
    });
}

/* se event listener oncahnge to all inputs*/
function addInputEventOnchange(){
    var elSearch = document.querySelector('.inputSearch')
    elSearch.addEventListener('change', searchGallery);
    
    var els = document.querySelectorAll('.input')
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
    var els = document.querySelectorAll('.input')
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
    //console.log('target',target,canvas , meme)   
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
        //console.log('font',font,line.txt,line.x)
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
    //console.log(meme)
    meme.stickers.forEach((sticker,index,array) => { 
        drawMemesSticker(ctx,sticker);         
    });
   
}

// draw each sticker
function drawMemesSticker(ctx,sticker){
    //console.log(sticker)
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
    resizeCanvasByContainer() //contains renderCanvas();     
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
    //console.log('render canvas',imgUpload)
    if(!gCtx) return;
    clearCanvas(); // clear canvas for meme change
    drawImg(imgUpload);  //img
}

/* draw img */
function drawImg(imgUpload){
    //console.log('render canvas',imgUpload)
    if(imgUpload) gCtx.drawImage(imgUpload, 0, 0, gCanvas.width, gCanvas.height) , drawTexts() , drawStickers()  // img = imgUpload 
    else {
        var img = new Image()
        var imageUrl = getImageUrl();
        img.src = `${imageUrl}`;
        img.onload = (ev) => {
            var imgWidth = ev.path[0].naturalWidth;
            var imgHeight = ev.path[0].naturalHeight;
            var ratio  = imgWidth / imgHeight;
            //console.log(ev, imgWidth, imgHeight, ratio, imgWidth*ratio )

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
    //console.log('line l',lines,lines.length)  
    lines.forEach((line,index )=> {  
        var font = `${line.fontSize}px ${line.font}`
        //console.log('line',line)
        drawText(line,index, font);         
    });
}

// draw each text
function drawText(line,index, font) {
    //console.log('draw txt',line, font,line)
    gCtx.strokeStyle = line.colorStroke;
    gCtx.fillStyle = line.color;
    gCtx.lineWidth = '1';
    gCtx.font = font;
    gCtx.textAlign = line.align
    //gCtx.fillText(line.txt, line.x, line.y)
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
    //console.log(ev);
    //console.log(el);

    var mouseDownOffsetX = ev.offsetX
    var mouseDownOffsetY = ev.offsetY;


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

    var mouseMoveOffsetX = 0;
    var mouseMoveOffsetY = 0;

    if(checkClickedLine){ 
        var lineIndex =  getLineIdByTxt(checkClickedLine.txt)
        var elInput = document.querySelector(`[data-inputid="${lineIndex}"]`);
        elInput.focus();
        el.onmousemove  = dragText;
        
    };
    
    function dragText(ev){ 
        //console.log(ev.offsetX,ev.offsetY)
        mouseMoveOffsetX = ev.offsetX;
        mouseMoveOffsetY = ev.offsetY;
        checkClickedLine.x = mouseMoveOffsetX;
        checkClickedLine.y = mouseMoveOffsetY;
        renderCanvas() // render canvas
    }
    
    // check click sticker
    var checkClickedSticker = gMeme.stickers.find(sticker => {
        //console.log('click sticker',mouseDownOffsetX ,mouseDownOffsetY,sticker.x ,sticker.y ,sticker.y+stickerTxtWidth)       
        return mouseDownOffsetX > sticker.x && mouseDownOffsetX < sticker.x+sticker.width && mouseDownOffsetY > sticker.y && mouseDownOffsetY < sticker.y+sticker.height;       

    });

    if(checkClickedSticker){ 
        //console.log(checkClickedSticker)
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
    //console.log(mouseDownOffsetX,mouseDownOffsetY);

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
    console.log('line drag',mouseMoveOffsetX,mouseMoveOffsetY)
    if(checkClickedLine) {
        var lineIndex =  getLineIdByTxt(checkClickedLine.txt)
        var elInput = document.querySelector(`[data-inputid="${lineIndex}"]`);
        if(screen.width > 1100 ) elInput.focus();     
        el.ontouchmove = dragText;
    }  
   

    function dragText(ev){  
        console.log(ev);    
        mouseMoveOffsetX = ev.touches[0].clientX - rect.left;
        mouseMoveOffsetY = ev.touches[0].clientY - rect.top;
        checkClickedLine.x = mouseMoveOffsetX;
        checkClickedLine.y = mouseMoveOffsetY;
        renderCanvas() // render canvas
    }

    // check click sticker
    var checkClickedSticker = gMeme.stickers.find(sticker => {
        var stickerWidth = 40
        var stickerHeight = 40
        console.log('click sticker',mouseDownOffsetX ,mouseDownOffsetY,sticker.x ,sticker.y ,sticker.y+stickerWidth)       
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
    elContainer.style.height =  elContainer.offsetWidth * ratio +"px"// set 1:1 ratio to .canvas 
    //console.log("resize" , elContainer.offsetWidth ,ratio)
    elCanvasMeme.width  = elContainer.offsetWidth 
    elCanvasMeme.height = elContainer.offsetHeight

    if(!gCanvas) return
    console.log("render")  
    renderCanvas(); //render meme
}

// open menu on mobile
function toggleMenu() {
    document.body.classList.toggle('menu-open');
    console.log('open menu')
}

//open close dropdown menu
function toggleDropDown(){
    document.body.classList.toggle('drop-down-open'); 
}  