'use strict';
console.log('gallery controller')

const PAGE_SIZE = 10;
let gPageIdx = 0;

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

function renderTags(){
    var keywords =  getKeywords();
    keywords.ALL = 8;
    //console.log(keywords)
    var strHTML =  Object.entries(keywords).map(([key, value]) => {
        return `<div class="tag align-self-center" onclick="onSetFilter('${key}')" style="font-size:calc(20px + ${value}*2px)">${key}</div>`;
    });
    document.querySelector('.tags').innerHTML = strHTML.join(''); 
}

function onSetFilter(filterBy) {
    setFilter(filterBy)
    //console.log(filterBy)
    increaceTagSize(filterBy)
    renderTags()
    var images = getImgesByFilter();
    renderGallery(images);
}
// paganition 
function onPrevPage() {
    prevPage();
    renderGallery();   
}

function onNextPage() {
    nextPage();
    renderGallery();
}

// select image for meme
function selectImage(imageId){
    isUploaded = false;
    var error = errorDisaply(); 
    if(error) return  
    
    var canvas = gCanvas;
    updateGMeme(imageId);
    createCanvas();
    resizeCanvasByContainer()
    updateMemesPositionCenter(canvas); 
    renderCanvas()
    windowLocation('editPage','editorLink')
}

//search gallery by filter
function searchGallery(e){
    var searchTag = e.target.value
    var results = filterGallery(searchTag)
    renderGallery(results)
}

// open tags
function toggleTags() {
    document.body.classList.toggle('show-tags');
    var el = document.querySelector('.toggleTags')

    if (document.body.classList.contains('show-tags')){
        console.log('show')
        el.innerHTML = 'פחות תגיות <i class="fas fa-toggle-off"></i>' ;
    }else{
        el.innerHTML = 'עוד תגיות <i class="fas fa-toggle-on"></i>' ;
    }
    if(document.body.classList.contains('direction-rtl')) return
    if (document.body.classList.contains('show-tags')){
        console.log('show')
        el.innerHTML = 'Show less <i class="fas fa-toggle-off"></i>' ;
    }else{
        el.innerHTML = 'Show more <i class="fas fa-toggle-on"></i>' ;
    }
}