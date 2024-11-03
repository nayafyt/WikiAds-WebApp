console.log("working on categories.js")

console.log("Full URL Search:", window.location.search);
// Get the category ID from the URL parameters

let isLoggedIn = false; // Global variable to track login status

let urlParams = new URLSearchParams(window.location.search);
let categoryId = urlParams.get('id');
console.log("Category ID:", categoryId);
let url = `https://wiki-ads.onrender.com/ads?category=`;


async function fetchCategories() {
    const url = 'https://wiki-ads.onrender.com/categories';
    const response = await fetch(url);
    return response.json();
}
async function getTitle() {
    categoriesArray = await fetchCategories();
    category = categoriesArray[categoryId - 1];
    console.log('category id', category);
    document.getElementById('catID').innerHTML = '';
    // Add message to the content div
    const messageDiv = document.createElement('div');
    messageDiv.textContent = category.title;

    document.getElementById('catID').appendChild(messageDiv);
}

async function fetchCategoryAds(id) {
    const response = await fetch(url + id);
    return response.json();
}

async function loadData() {
    advertisementArray = await fetchCategoryAds(categoryId);
    if (advertisementArray.length == 0) {
        document.getElementById('content').innerHTML = '';
        // Add message to the content div
        const messageDiv = document.createElement('div');
        messageDiv.textContent = "We are sorry our site does not provide ads for this particular category!!";
        messageDiv.style.fontSize = '24px';
        messageDiv.style.textAlign = 'center';
        messageDiv.style.marginTop = '50px';
        messageDiv.style.marginBottom = '50px';
        document.getElementById('content').appendChild(messageDiv);
        return;
    }

    advertisementArray.forEach(cat => {
        cat.images = cat.images[0]
    });

    var source = document.getElementById('category-ads-template').innerHTML;
    var template = Handlebars.compile(source);
    var html = template({
        advertisements: advertisementArray,
        category: category
    });
    document.getElementById('advertisements').innerHTML = html;

}

getTitle();
loadData();

let userLog = "";
let sessionId = "";
document.addEventListener('DOMContentLoaded', (event) => {
    // Select the form element
    const form = document.getElementById('login-form');

    // Check if the form element exists
    if (form) {
        // Add event listener to the form submit event
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            // Get form data
            const formData = {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            };

            // Send POST request using fetch API
            fetch('http://localhost:8080/category', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => {
                    // Check if the response is successful
                    if (response.ok) {
                        return response.json(); // Parse the JSON response
                    } else {
                        isLoggedIn = false;
                        throw new Error('Response was not ok.');
                    }
                })
                .then(data => {
                    console.log(data);
                    userLog = document.getElementById('username').value;
                    sessionId = data['sessionId'];
                    console.log("username:", userLog, " sessionID", sessionId);
                    const messageSection = document.getElementById('message');
                    messageSection.style.color = 'darkgreen';
                    messageSection.innerHTML = 'Successful login';
                    messageSection.classList.add('success');
                    isLoggedIn = true; // Set isLoggedIn to true when user logs in
                    updateFavoritesLink();
                })
                .catch(error => {
                    console.error('Error:', error);
                    const messageSection = document.getElementById('message');
                    messageSection.style.color = 'red';
                    messageSection.innerHTML = 'Failed to login';
                    messageSection.classList.add('error');
                });
        });
        updateFavoritesLink();
    } else {
        console.error('Form element not found');
    }
});


const AFS = 'http://localhost:8080/favorite-ads';

function handleClick(adId, title, description, cost, images) {

    //Έλεγχος αν έχει γίνει η σύνδεση
    if (!isLoggedIn) {
        displayAlert('Παρακαλώ συνδεθείτε για προσθήκη στη λίστα αγαπημένων', 'error');

        return;
    }

    const adData = {
        adId: adId,
        title: title,
        description: description,
        cost: cost,
        imageUrl: images,
        username: userLog,
        sessionId: sessionId
    };

    console.log(adData);

    fetch(AFS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    displayAlert(error.message, 'error', true);
                    throw new Error(response.status + ': ' + error.message);
                });
            }
            return response.json();
        })
        .then(data => {
            displayAlert(data.message, 'success', true);
        })
        .catch(error => {

            console.error('Error:', error);
        });
}

function updateFavoritesLink() {
    const favoritesLinkContainer = document.getElementById('favorites-link-container');
    if (isLoggedIn) {
        const favoritesLink = document.createElement('a');
        favoritesLink.href = `favorite-ads.html?username=${userLog}&sessionId=${sessionId}`;
        favoritesLink.target = "_blank";
        favoritesLink.textContent = 'Προβολή Αγαπημένων';
        // Έλεγχος αν υπάρχει ήδη ένας σύνδεσμος στο container και αντικατάσταση του
        if (favoritesLinkContainer.firstChild) {
            favoritesLinkContainer.replaceChild(favoritesLink, favoritesLinkContainer.firstChild);
        } else {
            // Αν δεν υπάρχει κανένας σύνδεσμος στο container, προσθέτουμε τον νέο
            favoritesLinkContainer.appendChild(favoritesLink);
        }
    } else {
        // If user is not logged in, remove the link from the container
        favoritesLinkContainer.innerHTML = '';
    }
}

function displayAlert(message, type, showFavoritesLink = false) {
    const alertContent = document.getElementById('alertContent');
    const customAlert = document.getElementById('customAlert');
    customAlert.classList.remove('hidden');
    if (type === 'success') {
        alertContent.style.color = 'darkgreen';
        alertContent.classList.add('success');

    } else {
        alertContent.style.color = 'red';
        alertContent.classList.add('error');

    }
    alertContent.innerHTML = message;

    // Add event listener to the OK button
    const okButton = document.getElementById('okButton');
    okButton.addEventListener('click', function() {
        customAlert.classList.add('hidden'); // Hide the modal
    });

    // Display the favorites link if showFavoritesLink is true
    const favoritesLinkContainer = document.getElementById('favoriteslink');
    if (showFavoritesLink) {
        const favoritesLink = document.createElement('a');
        favoritesLink.href = `favorite-ads.html?username=${userLog}&sessionId=${sessionId}`;
        favoritesLink.target = "_blank";
        favoritesLink.textContent = 'Προβολή Αγαπημένων';
        favoritesLinkContainer.innerHTML = ''; // Clear existing content
        favoritesLinkContainer.appendChild(favoritesLink); // Add the link
    } else {
        favoritesLinkContainer.innerHTML = ''; // Clear the favorites link container
    }
}