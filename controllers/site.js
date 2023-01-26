// Import the NPM packages.
const { validationResult } = require('express-validator');

// Import the database connection.
const db = require('../models/database');

// GET / aka the homepage.
// The function renders the homepage.
exports.getHome = (req, res, next) => {
    // Build the query to get latest image from the database.
    const query = 'SELECT * FROM images ORDER BY date DESC LIMIT 1';

    // Run the query to get the latest image from the database.
    db.query(query)
        .then(([rows, fields]) => {
            // Render the home page.
            return res.render('index.html', {
                title: 'Home',
                path: '/home',
                image: rows[0],
            });
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// GET /images/:page?
exports.getImages = (req, res, next) => {
    // Get the page number.
    let currentPage = parseInt(req.params.page);

    // Validate the page number.
    if (!currentPage || currentPage === "" || currentPage <= 0 || !Number.isInteger(currentPage)) {
        // If the validation fails, set page to one as default.
        currentPage = 1;
    };

    // Build the query to get the total amount images.
    const queryAmount = 'SELECT image_id FROM images';
    
    // Run the query to get the total amount of images.
    db.query(queryAmount)
        .then(([image_ids, meta]) => {
            // Build the query to get the set of image data.
            const query = `
                SELECT *
                FROM images
                ORDER BY date DESC
                LIMIT ?, ?
            `;
            
            // Define and calculate all the values for paging.
            const limit = 9;                                   // Set the number of items that can appear per page.
            const total_items = image_ids.length;              // Compute the total amount of items.
            const totalPages = Math.ceil(total_items / limit); // Compute the total number of pages.
            const offset = (currentPage * limit) - limit;      // (Current Page - limit) - limit to get the correct offset for the query.
            const prevPage = currentPage - 1;                  // Compute the page number for the previous page.
            const nextPage = currentPage + 1;                  // Compute the page number for the next page.
            const hasPrev = prevPage > 0;                      // Compute to see if the previous page back button is needed.
            const hasNext = currentPage < totalPages;          // Compute to see if the next page button is needed.

            // Run the second query to get the dataset.
            db.query(query, [offset, limit])
                .then(([rows, fields]) => {
                    // Render the images list page.
                    return res.render('images-list.html', {
                        title: 'Full List of Images',
                        path: '/images',
                        images: rows,
                        hasPrevious: hasPrev,
                        hasNext: hasNext,
                        prev: prevPage,
                        next: nextPage,
                        pageNumber: currentPage,
                        totalPages: totalPages
                    });
                });
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// // GET /image-view/:id
// The function returns the view for a single image.
exports.getImage = (req, res, next) => {
    // Get the image id from the URL.
    const imageId = req.params.id;

    // Build the query.
    const query = `
        SELECT *
        FROM images
        WHERE image_id = ?
    `;

    // Run the query to get the data for the image.
    db.query(query, [imageId])
        .then(([rows, fields]) => {
            // Render the image page.
            return res.render('image-view.html', {
                title: 'View of ' + rows[0].object,
                path: '/images',
                image: rows[0],
            });
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// GET /contact
// The function delivers the contact form to the user.
exports.getContact = (req, res, next) => {
    // Render the contact view.
    return res.render('contact.html', {
        title: 'Contact Us',
        path: '/contact',
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