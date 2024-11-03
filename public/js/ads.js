console.log('using ads.js');
const subcategAdUrl = 'https://wiki-ads.onrender.com/ads?subcategory={id}';
let id = window.location.href.substring(38);
let idC = 1;
if (id <= 8) {
    idC = 1;
} else if (id <= 14) {
    idC = 2;
    id = id - 8;
} else if (id <= 19) {
    idC = 3;
    id = id - 14;
} else {
    idC = 4;
    id = id - 19;
}

console.log('idOK', id);
async function fetchSubs() {
    const url1 = 'https://wiki-ads.onrender.com/categories/:id/subcategories';
    const url = url1.replace(':id', idC);
    const response = await fetch(url);
    return response.json();
}

async function getTitle() {
    categoriesArray = await fetchSubs();
    category = categoriesArray[id - 1];
    console.log('category id', categoriesArray);
    document.getElementById('catID').innerHTML = '';
    // Add message to the content div
    const messageDiv = document.createElement('div');
    messageDiv.textContent = category.title;

    document.getElementById('catID').appendChild(messageDiv);
}


var image = [];


async function fetchAds(id) {
    const AdFetchUrl = subcategAdUrl.replace('{id}', id);
    const response = await fetch(AdFetchUrl);
    return response.json();
}
async function loadData() {
    adsArray = await fetchAds(window.location.href.substring(38));
    console.log(adsArray);
    if (adsArray.length == 0) {
        document.getElementById('content').innerHTML = '';

        // Add message to the content div
        const messageDiv = document.createElement('div');
        messageDiv.textContent = "We are sorry our site does not provide ads for this particular subcategory!!";
        messageDiv.style.fontSize = '24px';
        messageDiv.style.textAlign = 'center';
        messageDiv.style.marginTop = '50px';
        messageDiv.style.marginBottom = '50px';
        document.getElementById('content').appendChild(messageDiv);
        return;
    }
    adsArray.forEach(ad => {
        if (typeof ad.features === 'string') {
            console.log();
            ad.features = ad.features.split(';');
            console.log("ads", ad.features);
        }
    });
    var source = document.getElementById('ads-template').innerHTML;
    var template = Handlebars.compile(source);
    var html = template({
        ads: adsArray,
    });
    document.getElementById('ads').innerHTML = html;

    // Initialize slide index for each ad and start slideshow
    for (let i = 0; i < adsArray.length; i++) {
        slideIndex[adsArray[i].id] = 1;
        showSlides(adsArray[i].id);
    }
}

// Function to show slideshow
// Function to show slides based on index
// Function to show slides based on index
function showSlides(adIndex) {
    var slides = document.getElementsByClassName("mySlides-" + adIndex);

    // Hide all slides initially
    for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    // Check if any slides exist
    if (slides.length > 0) {
        // Ensure the slide index is within bounds
        if (slideIndex[adIndex] > slides.length) {
            slideIndex[adIndex] = 1;
        }
        if (slideIndex[adIndex] < 1) {
            slideIndex[adIndex] = slides.length;
        }
        // Display the first slide by default
        slides[slideIndex[adIndex] - 1].style.display = "block";
    }
}


// Function to navigate through slides using arrows
function plusSlides(n, adIndex) {
    slideIndex[adIndex] += n;
    showSlides(adIndex);
}

// Initialize slide index for each ad
var slideIndex = {};
getTitle();
loadData();
