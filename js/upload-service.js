
function downloadImg(elLink) {
    console.log(gCanvas);
    confirm("Download Meme....?")
    if(!gCanvas) return;
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}

// on submit call to this function
function uploadImg(elForm, ev) {
    ev.preventDefault();
    console.log(elForm, ev)
    if(!gCanvas) return;
    document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg");

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
       //document.querySelector('.share-container').innerHTML = `
       //<a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
       //   Share   
       //</a>`
       window.open(`https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`); return false;
    }

    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);

    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
    .then(function (res) {
        return res.text()
    })
    .then(onSuccess)
    .catch(function (err) {
        console.error(err)
    })
}


