var gTrans = {
    english:{
        en:'english',
        he:'אנגלית'
    },
    hebrew:{
        en:'hebrew',
        he:'עברית'
    },
    mainTitle:{
        en:'Meme Generator',
        he:'מחולל המימים'
    },
    gallery: {
        en: 'Gallery',
        he:  'גלריה',
    },
    editor: {
        en: 'Editor',
        he:  'עריכה',
    },
    memes: {
        en: 'Memes',
        he:  'מימז',
    },
    selectLang: {
        en: 'Select language',
        he:  'בחר שפה',
    },
    btnUpdate: {
        en: 'Update',
        he: 'עדכן'
    },
    btnDelete:{
        en: 'Delete',
        he: 'מחק',
    },
    Read: {
        en: 'Read',
        he: 'קרא',
    },
    add: {
        en: 'Add',
        he: 'הוסף',
    },
    Id: {
        en: 'Id',
        he: 'מ.ז',
    },
    Title: {
        en: 'Title',
        he: 'כותרת',
    },
    Action: {
        en: 'Action',
        he: 'פעולות',
    },
    BtnNextPage: {
        en: 'Next Page',
        he: 'עמוד הבא',
    },
    BtnPrevPage: {
        en: 'Prev Page',
        he: 'עמוד קודם',
    },
    editTextLines: {
        en: 'Edit Text Lines',
        he: 'עריכת טקסטים',
    },
    selectFont: {
        en: 'Select Font',
        he: 'בחר פונט',
    },
    moreTags: {
        en: 'More Tags',
        he: 'עוד תגיות',
    },
    share: {
        en: 'Share',
        he: 'שתף',
    },
    save: {
        en: 'Save',
        he: 'שמירה',
    },
    download: {
        en: 'Download',
        he: 'הורדה',
    },
    upload: {
        en: 'Upload',
        he: 'העלת קובץ',
    },
    savedMemes: {
        en: 'Saved Memes',
        he:'מימז שנשמרו'
    },
    search: {
        en: 'search',
        he: 'חיפוש',
    },
    'all': {
        en: 'All',
        he: 'הכל',
    },
    'active': {
        en: 'Active',
        he: 'פעיל'
    },
}

var gCurrLang = 'en'

function getTrans(transKey) {
    const transMap = gTrans[transKey] // get vlaue to translate
    if (!transMap) return 'UNKNOWN';

    var trans = transMap[gCurrLang] // get lang to translate
    if (!trans) trans = transMap['en'];
    return trans;
}

function doTrans() {
    var els = document.querySelectorAll('[data-trans]'); // get all elemnts to trans
    els.forEach(function(el){
        const transKey = el.dataset.trans; // get key to trans from element dataset
        if (el.placeholder) el.placeholder = getTrans(transKey) // trans for placeholder
        else el.innerHTML = getTrans(transKey) // trans for element by transKey to getTrans
    })
}

function setLang(lang) {
    gCurrLang = lang;
}

function formatNumOlder(num) {
    return num.toLocaleString('he')
}

function formatNum(num) {
    return new Intl.NumberFormat(gCurrLang).format(num);
}

function formatCurrency(num) {
    if (gCurrLang === 'he') return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(num);
    if (gCurrLang === 'en') return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'USD' }).format(num);
    
}

function formatDate(time) {

    var options = {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: 'numeric',
        hour12: true,
    };

    return new Intl.DateTimeFormat(gCurrLang,options).format(time);
}

function kmToMiles(km) {
    return km / 1.609;
}