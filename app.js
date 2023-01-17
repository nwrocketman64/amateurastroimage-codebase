// Import the Nodejs Libraries.
const path = require('path');

// This will load .env file and the enviroment variables.
require('custom-env').env('process');

// Import the NPM Libraries.
const express = require('express');
const nunjucks = require('nunjucks');
const nunjucksDate = require('nunjucks-date');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const csurf = require("tiny-csrf");
const cookieParser = require('cookie-parser');

// Import the error controller.
const errorController = require('./controllers/error');

// Import the routes.
const siteRoutes = require('./routes/site');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// Create the web app.
const app = express();
const PORT = process.env.PORT || 5000;

// Create the session store.
const sessionStore = new MySQLStore({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE,
});

// Configure Sessions.
app.use(session({
    key: process.env.SECRET_KEY,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    maxAge: 604800000,        // Session should only remain for one full week.
}));

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
app.use(cookieParser(process.env.COOKIE_PARSER));

// Setup the CSRF protection.
app.use(csurf(process.env.CSURF));

// Make the static file folder open.
app.use(express.static(path.join(__dirname, 'public')));

// The following routes for the website.
app.use('/admin', adminRoutes);
app.use(authRoutes);
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