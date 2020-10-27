'use strict';
console.log('gallery service')

const gImages = [
    {id: 1, url: 'img/0.jpg', keywords: ['matrix' , 'politic']},
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
    {id: 23, url: 'img/23.jpg', keywords: ['movie']},
    {id: 24, url: 'img/24.jpg', keywords: ['baby', 'win']},
    {id: 25, url: 'img/25.jpg', keywords: ['movie','smile']},
];

var gKeywords =  getAllKeywords();

function getImgesByFilter() {
    gFilterBy.toLowerCase();
    if (gFilterBy === 'all') return gImages;
    var res = []
    gImages.forEach(function(image){      
        image.keywords.filter(function(keyword){
            keyword.toLowerCase()
            if(keyword === gFilterBy){
                res.push(image)     
            }
        })      
    })
    return res;
}

function increaceTagSize(filterBy){
    if (gKeywords[filterBy] > 8 ) return
    gKeywords[filterBy]++;
}

function setFilter(filterBy) {
    gFilterBy = filterBy;
}

function getKeywords(){
    return gKeywords;
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
        image.keywords.forEach((tag) => {
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

function filterGallery(searchTag){ //ok
    if(searchTag === '') return gImages;
    var images = getGImages()
    var results=[];
    images.map((image,indexImage) => {
        image.keywords.find((tag,indexTag) => {
            if(tag === searchTag || tag.includes(searchTag)){
                results.push(images[indexImage]);
            }
        });  
    });
    return results   
}

function getGImages(){ //ok
    let images = gImages
    return images
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

function getImageUrl(){ //ok
    const image = getImageById(gMeme.selectedImgId)
    //console.log(image)
    return image.url;
}

function getSelectedImageId(){
    let meme = gMemes;
    return meme.selectedImgId
}
