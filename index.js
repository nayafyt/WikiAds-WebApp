const express = require('express')
const path = require('path')
const app = express()
const uuid = require('uuid');
const port = 8080
app.listen(port)

/* 
    Serve static content from directory "public",
    it will be accessible under path /, 
    e.g. http://localhost:8080/index.html
*/
app.use(express.static('public'))

// parse url-encoded content from body
app.use(express.urlencoded({ extended: false }))

// parse application/json content from body
app.use(express.json())

// serve index.html as content root
app.get('/', function(req, res) {


    var options = {

        root: path.join(__dirname, 'public')
    }

    res.sendFile('index.html', options, function(err) {
        console.log(err)

    })
})

app.get('/category', function(req, res) {
    var options = {
        root: path.join(__dirname, 'public')
    }

    res.sendFile('category.html', options, function(err) {
        console.log(err)

    })
})


app.get('/ads', function(req, res) {
    var options = {
        root: path.join(__dirname, 'public')
    };
    res.sendFile('subcategories.html', options, function(err) {

        console.log(err);

    });
})

const contacts = require('./models/contacts'); // Import contacts array


app.post('/category', (req, res) => {
    console.log("Received login service request");
    const { username, password } = req.body;

    const user = contacts.find(u => u.username === username && u.password === password);
    if (user) {
        const sessionId = uuid.v4();
        res.status(200).json({ sessionId });
    } else {
        res.status(401).json({ error: 'Invalid username or password...' })
    }
})


// Λίστα αγαπημένων αγγελιών (Χάνεται κατά την επανεκκίνηση του διακομιστή) (για έλεγχο διπλότυπων εισαγωγών στα αγαπημένα)
const userFavorites = {};
// Λίστα με πληροφορίες των αγγελιών 
const infoAd = {};

//Προσθήκη στις αγαπημένες αγγελίες
app.post('/favorite-ads', (req, res) => {
    const {
        adId,
        username,
        sessionId
    } = req.body;
    // Έλεγχος αν ο χρήστης είναι εξουσιοδοτημένος να κάνει χρήση των αγαπημένων
    if (!username || !sessionId) {
        username = "";
        sessionId = "";
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!userFavorites[username + " " + sessionId]) {
        userFavorites[username + " " + sessionId] = [];
        infoAd[sessionId] = []
    }

    // Ελέγχουμε αν υπάρχει ήδη το adId που πάει να προσθέσει ο συγκεκριμένος χρήστης
    if (userFavorites[username + " " + sessionId].includes(adId)) {


        return res.status(400).json({ success: false, message: '400 (Bad Request): Η αγγελία υπάρχει ήδη στη λίστα αγαπημένων.' });
    }

    // Άμα δεν υπάρχει το προσθέτουμε στην λίστα του συγκεκριμένου χρήστη
    userFavorites[username + " " + sessionId].push(adId);
    infoAd[sessionId].push(req.body);



    // Δεν παρουσιάστηκε κανένα πρόβλημα γίνεται κανονικά η προσθήκη της αγγελίας.
    return res.status(200).json({ success: true, message: '200 (OK): Η αγγελία προστέθηκε επιτυχώς στη λίστα αγαπημένων.' });


});


app.get('/get-favorites', (req, res) => {
    const { username, sessionId } = req.query;

    if (!username || !sessionId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (userFavorites[username + " " + sessionId]) {
        const userFavAds = userFavorites[username + " " + sessionId];

        res.json(infoAd[sessionId]);
    } else {
        res.status(404).json({ message: 'Favorites not found' });
    }
});


//FRS
const favItems= [];
app.get('/FRS', (req, res) => {
    console.log("Received Favorites Retrieval Service - FRS");

    const { username, sessionId } = req.query; // Use req.body instead of req.query

    if (!username || !sessionId) {
        return res.status(401).json({ message: 'Unauthorized:Not loged in' });
    } else {
        if (userFavorites[username + " " + sessionId]) {
            const userFavAds = userFavorites[username + " " + sessionId];
            const favData = {
                favItems: userFavAds.map(adId => {
                    const adDetails = infoAd[sessionId].find(ad => ad.adId === adId);

                    // Add your 'description' field here
                    return {
                        title: adDetails.title,
                        cost: adDetails.cost,
                        description: adDetails.description // Add this line
                    };
                })
            };
            return res.json(favData);

            return res.json({ favorites: favItems }); // Send the list of favorite ads as JSON
        } else {
            return res.status(404).json({ message: 'Favorites not found' });
        }
    }
});
