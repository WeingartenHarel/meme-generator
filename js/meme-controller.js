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


function init(){
    console.log('init')
    renderGallery();
    addInputEventOnchange();
    addInputEventOnfocus();
    setInputsValue();
    setInputsFontSize();
    setInputsInitialFocus();
    windowResize()
    resizeCanvasByContainer()
    renderSavedMemes();
}



function renderGallery(imagesResult) {
    console.log('imagesResult',imagesResult)
    var images 
    if (!imagesResult){
       images = getImages();
    }else{
        images = imagesResult;
        console.log(images)
    }
      
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
        return `<input class="input input-txt-first" data-inputid="${index}" name="input-txt-first" value="${line.txt}" placeHolder="${line.txt}"/>`;
    });
    document.querySelector('.inputs').innerHTML = strHTML.join('');
    return strHTML;
}


function onPrevPage() {
    prevPage();
    renderGallery();
}

function onNextPage() {
    nextPage();
    renderGallery();
}

function renderSavedMemes(){
    var memes = getSavedMemes()
    if(memes ===  undefined) return
    //console.log(memes)

    // create canvas elements
    var targets= []
    var strHTML = memes.map((meme ,index,array) => { 
        targets.push(`meme0${index}`);       
        return `<div class="canvasSaved"> 
            <canvas class="canvasSavedMeme ${targets[index]}" width="750" height="500"></canvas>
        </div>`;       
    });
    document.querySelector('.memes').innerHTML = strHTML.join('');
    
     // create canvas
     targets.map((target ,index,array) => {
        createCanvases(target,memes[index])
    }); 
   
}

function selectImage(imageId){
    updategMeme(imageId); 
    createCanvas();
    setInputsInitialFocus()
}

function onSaveMeme(){
    if (!gCanvas) return;
    if(!confirm("Save Meme to server...?") || !gCanvas) return;
    saveMeme();
    renderSavedMemes();
}

function searchGallery(e){
    console.log(e.target.value)
    var searchTag = e.target.value
    var results = filterGallery(searchTag)
    renderGallery(results)
}

function onSelectColor(color){
    console.log('font',color)
    updateLineColor(color)
    renderCanvas(); //render meme
}

function onSelectColorStroke(color){
    console.log('font',color)
    updateLineColorStroke(color)
    renderCanvas(); //render meme
}

function onSelectFont(font){
    if(font==="undefined") return
    updateLineFont(font)
    renderCanvas(); //render meme
}

function onTextAlign(align){
    //var selectedLine = getSelectedLineIdx();
    textAlign(align)
    renderCanvas(); //render meme
}

function onAddLine(){
    UpdateLines();
    renderInputs();
    setInputsFontSize();
    renderCanvas(); //render meme
}

function setInputsInitialFocus(){
    var selectedLine = getSelectedLineIdx();
    let el = document.querySelector(`[data-inputid="${selectedLine}"]`);
    //console.log('setFocus',el)
    el.focus();
}

function onSwitchLines() {
    var selectedLine = setSelectedLine();
    let el = document.querySelector(`[data-inputid="${selectedLine}"]`);
    el.focus();  
}

function onTxtUp(){
    let inputId = getSelectedLineIdx();
    changeTxtYposition(true,inputId)
    renderCanvas(); //render meme
}

function onTxtDown(){
    let inputId = getSelectedLineIdx();
    changeTxtYposition(false,inputId)
    renderCanvas(); //render meme
}


/* change font size */
function onIncreaseFontSize(){
    var inputIdx = getSelectedLineIdx();
    var fontSize = getSelectedFontSize(inputIdx);   
    var input = document.querySelector(`[data-inputid="${inputIdx}"]`);

    changeFontSizeInceace() //update meme fontsize
    input.style.fontSize = fontSize+'px'; //update input dont size
    renderCanvas(); //render meme
}

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
    console.log(values)
    var els = document.querySelectorAll('.input')
    els.forEach((input ,index,array) => { 
        //console.log(input)
        input.style.fontSize = values[index]+'px';
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

/* se event listener oncahnge to all inputs*/
function addInputEventOnchange(){
    var elSearch = document.querySelector('.inputSearch')
    elSearch.addEventListener('change', searchGallery);

    var els = document.querySelectorAll('.input')
    els.forEach((input ,index,array) => { 
        input.dataset.inputid = index;
        input.addEventListener('input', function () {
            //setSelectedLineIdx(index)     
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
function windowResize(){
    window.addEventListener('resize', resizeCanvasByContainer);
}
/* create canvass */
function createCanvases(target = '#canvas-meme',meme){
    var canvas = document.querySelector(`.${target}`);
    console.log('target',target,canvas , meme)
    
    var ctx = canvas.getContext('2d')

    
    var img = new Image()
    var imageUrl = getImageUrl();

    img.src = `${imageUrl}`;
    img.src = `${imageUrl}`;
    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        /* draw txts on image load*/ 
        drawTexts()     
    }

    function drawTexts(){
        meme.lines.forEach((line,index,array) => {  
            var font = `${line.fontSize}px ${line.font}`
            console.log('font',font,line.txt,line.x)
            drawText(line.txt, line.x, line.y, font, line.align, line.color , line.colorStroke);         
        });
    }

    function drawText(text, x, y, font, align, color, colorStroke) {
        //console.log('draw txt',text, x, y,font)
        ctx.strokeStyle = colorStroke;
        ctx.fillStyle = color;
        ctx.lineWidth = '1';
        ctx.font = font;
        ctx.textAlign = align
        ctx.fillText(text, x, y)
        ctx.strokeText(text, x, y)
    }
}

/* create canvas */
function createCanvas(target = '#canvas-meme'){
    gCanvas = document.querySelector(`${target}`);
    console.log('target',target)
    gCtx = gCanvas.getContext('2d');
    console.log('The context:', gCtx);
    //console.log('image', imageUrl)
    resizeCanvas()
    updateMemesPosition(gCanvas);
    renderCanvas(); 
    addCanvasEventListener()
}

function clearCanvas() {
    if(!gCtx) return;
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}

function renderCanvas(){
    if(!gCtx) return;
    clearCanvas(); // clear canvas for meme change
    //resizeCanvas()
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
    gMeme.lines.forEach((line,index,array) => {  
        var font = `${line.fontSize}px ${line.font}`
        //console.log('font',font)
        drawText(line.txt, line.x, line.y, font, line.align, line.color , line.colorStroke);         
    });
}


function drawText(text, x, y, font, align, color, colorStroke) {
    //console.log('draw txt',text, x, y,font)
    gCtx.strokeStyle = colorStroke;
    gCtx.fillStyle = color;
    gCtx.lineWidth = '1';
    gCtx.font = font;
    gCtx.textAlign = align
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}


function addCanvasEventListener(){
    
    var el = document.querySelector('.canvas-meme');
    // click event
    el.addEventListener('mousedown', canvasOnMouseDown);
    // touch event
    el.addEventListener("touchstart", canvasOnTouchStart , false);
}

/* drag and drop txt */
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
        console.log('click line.align',line.align)
        switch(line.align) {
            case 'left':
                console.log('left' ,line)
                return mouseDownOffsetX > line.x && mouseDownOffsetX < line.x + lineTxtWidth && mouseDownOffsetY > line.y-line.fontSize && mouseDownOffsetY < line.y;
            
            case 'center':
                //console.log('center', line.x ,lineTxtWidth ,(lineTxtWidth/2) , line.x - (lineTxtWidth/2) ,line.x + (lineTxtWidth/2))
                return mouseDownOffsetX > line.x - (lineTxtWidth/2) && mouseDownOffsetX < line.x + (lineTxtWidth/2)  && mouseDownOffsetY > line.y-line.fontSize && mouseDownOffsetY < line.y;

            case 'right':
                console.log('right')
                return mouseDownOffsetX > line.x && mouseDownOffsetX < line.x - lineTxtWidth && mouseDownOffsetY > line.y-line.fontSize && mouseDownOffsetY < line.y;
          
            }
    })

    var mouseMoveOffsetX = 0;
    var mouseMoveOffsetY = 0;
    //console.log('line drag',mouseMoveOffsetX,mouseMoveOffsetY)
    if(checkClickedLine) el.onmousemove  = dragText ;  
    el.onmouseup = closeDragElement;

    function dragText(ev){ 
        console.log(ev.offsetX,ev.offsetY)
        mouseMoveOffsetX = ev.offsetX;
        mouseMoveOffsetY = ev.offsetY;
        checkClickedLine.x = mouseMoveOffsetX;
        checkClickedLine.y = mouseMoveOffsetY;
        renderCanvas() // render canvas
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        el.onmouseup = null;
        el.onmousemove = null;
    } 
}


function canvasOnTouchStart(ev) {
    ev.preventDefault();
    //console.log(ev.type);
    var el = ev.target;

     var rect = gCanvas.getBoundingClientRect(); // relative to canvas coordinates
     var mouseDownOffsetX = ev.touches[0].clientX - rect.left;
     var mouseDownOffsetY = ev.touches[0].clientY - rect.top;
     console.log(mouseDownOffsetX,mouseDownOffsetY);


       // check click text
    var checkClickedLine = gMeme.lines.find(line => {
        var lineTxtWidth = gCtx.measureText(line.txt).width;
        console.log('click line.align',line.align)
        switch(line.align) {
            case 'left':
                console.log('left' ,line)
                return mouseDownOffsetX > line.x && mouseDownOffsetX < line.x + lineTxtWidth && mouseDownOffsetY > line.y-line.fontSize && mouseDownOffsetY < line.y;
            
            case 'center':
                //console.log('center', line.x ,lineTxtWidth ,(lineTxtWidth/2) , line.x - (lineTxtWidth/2) ,line.x + (lineTxtWidth/2))
                return mouseDownOffsetX > line.x - (lineTxtWidth/2) && mouseDownOffsetX < line.x + (lineTxtWidth/2)  && mouseDownOffsetY > line.y-line.fontSize && mouseDownOffsetY < line.y;

            case 'right':
                console.log('right')
                return mouseDownOffsetX > line.x && mouseDownOffsetX < line.x - lineTxtWidth && mouseDownOffsetY > line.y-line.fontSize && mouseDownOffsetY < line.y;
          
            }
    })

    var [mouseMoveOffsetX , mouseMoveOffsetY] = [0,0];
    //console.log('line drag',mouseMoveOffsetX,mouseMoveOffsetY)
    if(checkClickedLine) el.ontouchmove = dragText;  
    el.ontouchend = closeDragElement;

    function dragText(ev){  
        console.log(ev);    
        mouseMoveOffsetX = ev.touches[0].clientX - rect.left;
        mouseMoveOffsetY = ev.touches[0].clientY - rect.top;
        checkClickedLine.x = mouseMoveOffsetX;
        checkClickedLine.y = mouseMoveOffsetY;
        renderCanvas() // render canvas
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        el.onmouseup = null;
        el.onmousemove = null;
    } 

}

function resizeCanvasByContainer() {
    var elContainer = document.querySelector('.canvas');
    var elCanvasMeme = document.querySelector('.canvas-meme');

    elCanvasMeme.width  = elContainer.offsetWidth 
    elCanvasMeme.height = elContainer.offsetHeight
    if(!gCanvas) return
    renderCanvas(); //render meme
}

function resizeCanvas() {
    var el = document.querySelector('.canvas');
    // Note: changing the canvas dimension this way clears the canvas
    gCanvas.width = el.offsetWidth 
    gCanvas.height = el.offsetHeight
}