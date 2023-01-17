// Import the NPM packages.
const { validationResult } = require('express-validator');

// Import the database connection.
const db = require('../models/database');

// GET / aka the homepage.
// The function renders the homepage.
exports.getHome = (req, res, next) => {
    return res.render('index.html', {
        title: 'Home',
        path: '/home',
    });
};

// GET /images/:page?
exports.getImages = (req, res, next) => {
    // Render the images list page.
    return res.render('images-list.html', {
        title: 'Full List of Images',
        path: '/images',
    });
};

// GET /contact
// The function delivers the contact form to the user.
exports.getContact = (req, res, next) => {
    // Get the csft token for the form.
    const csrfToken = req.csrfToken();
    
    // Render the contact view.
    return res.render('contact.html', {
        title: 'Contact Us',
        path: '/contact',
        csrfToken: csrfToken,
    });
};

// POST /contact
// The function processes the contact form's post request.
exports.postContact = (req, res, next) => {
    // Pull the validation results.
    const errors = validationResult(req);

    // If there was an error in validation, reload the contact page.
    if (!errors.isEmpty()) {
        return res.render('contact.html', {
            title: 'Contact Us',
            path: '/contact',
            errorMessage: 'Please fill out everything in the form.',
            firstName: req.body.fname,
            lastName: req.body.lname,
            email: req.body.email,
            comment: req.body.comment,
        });
    };

    // Pull the form data.
    const formData = [
        req.body.fname,
        req.body.lname,
        req.body.email,
        req.body.comment,
    ];

    // Build the query to insert the request.
    const query = `
        INSERT INTO requests
        (first_name, last_name, email, comment)
        VALUE (?)
    `;

    // Push the data into the database.
    db.query(query, [formData])
        .then(([rows, fields]) => {
            // Redirect to the success page.
            return res.redirect('/form-sent')
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// GET /form-sent
// The function renders the form sent page.
exports.getFormSent = (req, res, next) => {
    return res.render('contact-submit.html', {
        title: 'Form Submitted',
        path: '/contact',
    });
};

// GET /about
// The function delivers the about us page to the user.
exports.getAbout = (req, res, next) => {
    // Render the about page.
    return res.render('about.html', {
        title: 'About Us',
        path: '/about',
    });
};

// GET /patch-notes
// The function delivers the patch notes page.
exports.getPatchNotes = (req, res, next) => {
    // Render the patch notes page.
    return res.render('patch-notes.html', {
        title: 'Patch Notes',
        path: '/about',
    });
};