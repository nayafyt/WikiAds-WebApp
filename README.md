# WikiAds-WebApp

This project is a simple web application that interacts with a backend server to fetch and display categories and advertisements.

## Project Structure

```bash
├── [index.js]
├── models/
│   └── contacts.js
├── [package.json]
├── public/
│   ├── category.html
│   ├── css/
│   │   └── style.css
│   ├── favorite-ads.html
│   ├── index.html
│   ├── js/
│   │   ├── ads.js
│   │   ├── [categories.js]
│   │   ├── favorites.js
│   │   └── [main.js]
│   └── subcategories.html
```
## Installation
To install the necessary dependencies, run:
```
npm install
```
## Running the Application
To start the application, run:
```
node index.js
```
## Technical Details

***Backend***
- Express: The backend server is built using Express, a minimal and flexible Node.js web application framework.
- UUID: Used for generating unique identifiers.

***Frontend***
- HTML/CSS: The frontend is built using standard HTML and CSS.
- JavaScript: The client-side logic is implemented in JavaScript.
- Handlebars: A templating engine used to dynamically generate HTML content.
- Fetch API: Used for making HTTP requests to the backend server.

## File Descriptions
- index.js: The main entry point for the backend server.
- models/contacts.js: Contains the data model for contacts.
- public/index.html: The main HTML file for the application.
- public/css/style.css: The main CSS file for styling the application.
- public/js/main.js: Contains the main client-side JavaScript code.
- public/js/categories.js: Contains JavaScript code for handling categories.
- public/js/ads.js: Contains JavaScript code for handling advertisements.
- public/js/favorites.js: Contains JavaScript code for handling favorite ads.

## Usage
The application fetches categories and advertisements from the backend server and displays them on the frontend. Users can view categories, subcategories, and advertisements. They can also log in and manage their favorite ads.

## Author
This was a group project that was created as part of the Web Application Programming course.



