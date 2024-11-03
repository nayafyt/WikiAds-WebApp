// Λήψη των παραμέτρων URL
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const sessionId = urlParams.get('sessionId');

// Function to fetch user favorites from the server and populate the page
async function fetchUserFavorites(username, sessionId) {
    const url = `http://localhost:8080/get-favorites?username=${username}&sessionId=${sessionId}`;

    try {
        const response = await fetch(url);
        if (response.ok) {

            return response.json();
        } else {
            console.error('Failed to fetch favorites');
        }
    } catch (error) {
        console.error('Error fetching favorites:', error);
    }
}

async function loadData() {
    advertisementArray = await fetchUserFavorites(username, sessionId);
    console.log(advertisementArray);
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
    console.log(advertisementArray);

    var source = document.getElementById('category-ads-template').innerHTML;
    var template = Handlebars.compile(source);
    var html = template({
        advertisements: advertisementArray
    });
    document.getElementById('advertisements').innerHTML = html;

}
async function getTitle() {
    advertisementArray = await fetchUserFavorites(username, sessionId);
    document.getElementById('catID').innerHTML = '';
    // Add message to the content div
    const messageDiv = document.createElement('div');
    messageDiv.textContent = "Λίστα αγαπημένων του " + username;

    document.getElementById('catID').appendChild(messageDiv);
}

getTitle();
loadData();

async function FRS(){
    let params = new URLSearchParams(window.location.search);
	let Username = params.get('username');
	let sessionId = params.get('sessionId');

    console.log("Called FRS");
    const url ='http://localhost:8080/FRS?username=${Username}&sessionId=${sessionId}'
    try {
        const response = await fetch(url);
        if (response.ok) {

            return response.json();
        } else {
            console.error('Could not be retrieved');
        }
    } catch (error) {
        console.error('Error fetching favorites:', error);
    }

}
document.addEventListener('DOMContentLoaded', function () {
    FRS();
});
