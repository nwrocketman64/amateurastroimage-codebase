// Import the Nodejs Libraries.
const path = require('path');

// This will load .env file and the enviroment variables.
require('custom-env').env('process');

// Import the NPM Libraries.
const express = require('express');
const nunjucks = require('nunjucks');
const nunjucksDate = require('nunjucks-date');

// Import the error controller.
const errorController = require('./controllers/error');

// Import the routes.
const siteRoutes = require('./routes/site');

// Create the web app.
const app = express();
const PORT = process.env.PORT || 5000

// Configure nunjucksDate.
nunjucksDate.setDefaultFormat("MMMM Do, YYYY, h:mm a");

// Set render engine.
let nunjucksEnv = nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.set('view engine', 'html');

// Pass the enviroment variable to NunJucksDate.
nunjucksDate.install(nunjucksEnv);

// Parse the incoming request bodies.
app.use(express.urlencoded({ extended: true }));

// Make the static file folder open.
app.use(express.static(path.join(__dirname, 'public')));

// The following routes for the website.
app.use(siteRoutes);

// Code for the 404 and 500.
// Deliver the 500 page.
app.use('/500', errorController.get500);

// Deliver the 404 page if the resource is not found.
app.use(errorController.get404);

// Deliver the 500 page if there was an error.
app.use((error, req, res, next) => {
    // Console log the error.
    console.log(error);

    // Render the 500 page.
    return res.status(500).render('500.html', {
        title: 'Error has Occured',
        path: '/home',
    });
});

// Start the app.
app.listen(PORT);
console.log('Listening on port ' + PORT);