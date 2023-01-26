// Import the Nodejs Libraries.
const path = require('path');

// Import the NPM packages.
const { validationResult } = require('express-validator');
const sharp = require('sharp');
const bcrypt = require('bcryptjs');

// Import the database connection.
const db = require('../models/database');

// GET /admin/add-image
// The function renders the add image page.
exports.getAddImage = (req, res, next) => {
    // Render the add image view.
    return res.render('add-image.html', {
        title: 'Add Image',
        path: '/home',
    });
};

// POST /admin/add-image
// The function processes the image being posted.
exports.postAddImage = async (req, res, next) => {
    // Get the data from the form.
    const image = req.file;
    const object = req.body.object;
    const date = req.body.date;
    const location = req.body.location;
    const telescope = req.body.telescope;
    const comments = req.body.comments;
    const errors = validationResult(req);

    // Validate the form data.
    if (!image || !errors.isEmpty()) {

        // Return to the add image page.
        return res.status(422).render('add-image.html', {
            title: 'Add Image',
            path: '/home',
            object: object,
            date: date,
            location: location,
            telescope: telescope,
            comments: comments,
            errorMessage: 'Please fill out all the form elements',
        });
    };

    // Load the image saved by multer to buffer with sharp.
    let imgBuffer = await sharp(path.join(path.dirname(process.mainModule.filename), 'bucket', image.filename))
        .toFormat('jpeg')
        .toBuffer()
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    
    // Resize the image to standard size and save a copy of it.
    let standImage = await sharp(imgBuffer)
        .rotate()
        .resize({
            fit: sharp.fit.contain,
            width: 800,
        })
        .toFormat('jpeg')
        .jpeg({
            quality: 80,
        })
        .toFile(path.join(path.dirname(process.mainModule.filename), 'bucket', 'stand-' + image.filename))
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

    // Resize the image to standard size and save a copy of it.
    let thumbImage = await sharp(imgBuffer)
        .rotate()
        .resize({
            fit: sharp.fit.contain,
            width: 300,
        })
        .toFormat('jpeg')
        .jpeg({
            quality: 80,
        })
        .toFile(path.join(path.dirname(process.mainModule.filename), 'bucket', 'thumb-' + image.filename))
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

    // Collect the form data into an array.
    const newImage = [
        object,
        new Date(date).toISOString().slice(0, 19).replace('T', ' '),
        location,
        telescope,
        comments,
        image.filename,
    ];

    // Build a new query.
    const query = `
        INSERT INTO images
        (object, date, location, telescope, comments, path)
        VALUE (?)
    `;

    // Push the data into the database.
    db.query(query, [newImage])
        .then(([rows, fields]) => {
            // Redirect to the admin image page.
            return res.redirect('/admin/images');
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// GET /admin/edit-image/:id
// The function renders the edit image page.
exports.getEditImage = (req, res, next) => {
    // Get the request id from the URL.
    const requestId = req.params.id;

    // Build the query to get the single request.
    const query = `
        SELECT * FROM images
        WHERE image_id = ?
    `;

    // Run the query.
    db.query(query, [requestId])
        .then(([rows, fields]) => {
            // Render the edit image page.
            return res.render('edit-image.html', {
                title: 'Edit Image',
                path: '/home',
                ...rows[0],
            });
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// POST /admin/edit-image
// The function processes the image data changes.
exports.postEditImage = (req, res, next) => {
    // Get the data from the form.
    const object = req.body.object;
    const date = req.body.date;
    const location = req.body.location;
    const telescope = req.body.telescope;
    const comments = req.body.comments;
    const imageId = req.body.imageId;
    const errors = validationResult(req);

    // Validate the form data.
    if (!errors.isEmpty()) {

        // Return to the add image page.
        return res.status(422).render('add-image.html', {
            title: 'Add Image',
            path: '/home',
            object: object,
            date: date,
            location: location,
            telescope: telescope,
            comments: comments,
            image_id: imageId,
            errorMessage: 'Please fill out all the form elements',
        });
    };

    // Collect the form data into an array.
    const updatedImage = [
        object,
        new Date(date).toISOString().slice(0, 19).replace('T', ' '),
        location,
        telescope,
        comments,
    ];

    // Build the query.
    const query1 = `
        UPDATE images
        SET
            object = '${updatedImage[0]}',
            date = '${updatedImage[1]}',
            location = '${updatedImage[2]}',
            telescope = '${updatedImage[3]}',
            comments = '${updatedImage[4]}'
        WHERE image_id = ${imageId}
    `;

    // Push the data into the database.
    db.query(query1)
        .then(([rows, fields]) => {
            // Redirect to the admin image page.
            return res.redirect('/admin/images');
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// GET /admin/delete-image/:id
// The function return the delete image page.
exports.getDeleteImage = (req, res, next) => {
    // Get the request id from the URL.
    const imageId = req.params.id;

    // Build the query to get the single request.
    const query = `
        SELECT * FROM images
        WHERE image_id = ?
    `;

    // Run the query.
    db.query(query, [imageId])
        .then(([rows, fields]) => {
            // Render the delete image page.
            return res.render('delete-image.html', {
                title: 'Delete Image',
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

// POST /admin/delete-image
// The function delete the request image from the database.
exports.postDeleteImage = (req, res, next) => {
    // Pull the validation results.
    const errors = validationResult(req);

    // If there was an error in validation, redirect to admin.
    if (!errors.isEmpty()) {
        return res.redirect('/admin');
    };

    // Get the request id.
    const imageId = req.body.id;

    // Build the query.
    const query = `
        DELETE FROM images
        WHERE image_id = ?
    `;

    // Run the query to delete the request.
    db.query(query, [imageId])
        .then(([rows, fields]) => {
            // Redirect to admin images.
            return res.redirect('/admin/images');
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// GET /admin/images
// The function returns the image section of admins.
exports.getAdminImages = (req, res, next) => {
    // Build the query.
    const query = `SELECT * FROM images`;

    // Run the the query.
    db.query(query)
        .then(([rows, fields]) => {
            // Render the admin image page.
            return res.render('admin-images.html', {
                title: 'Admin - Full List of Images',
                path: '/home',
                images: rows,
            });
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// GET /admin/view-request/:id
// The function returns one request.
exports.getViewRequest = (req, res, next) => {
    // Get the request id from the URL.
    const requestId = req.params.id;

    // Build the query to get the single request.
    const query = `
        SELECT * FROM requests
        WHERE request_id = ?
    `;

    // Run the query.
    db.query(query, [requestId])
        .then(([rows, fields]) => {
            return res.render('admin-request-view.html', {
                title: 'Request from ' + rows[0].first_name + ' ' + rows[0].last_name,
                path: '/home',
                request: rows[0],
            });
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// GET /admin/delete-request/:id
// The function returns the delete request page.
exports.getDeleteRequest = (req, res, next) => {
    // Get the request id from the URL.
    const requestId = req.params.id;

    // Build the query to get the single request.
    const query = `
        SELECT * FROM requests
        WHERE request_id = ?
    `;

    // Run the query.
    db.query(query, [requestId])
        .then(([rows, fields]) => {
            // Render the delete request page.
            return res.render('delete-request.html', {
                title: 'Delete Request from ' + rows[0].first_name + ' ' + rows[0].last_name,
                path: '/home',
                request: rows[0],
            });
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// POST /admin/delete-request/
// The function deletes the request from the database.
exports.postDeleteRequest = (req, res, next) => {
    // Pull the validation results.
    const errors = validationResult(req);

    // If there was an error in validation, redirect to admin.
    if (!errors.isEmpty()) {
        return res.redirect('/admin');
    };

    // Get the request id.
    const requestId = req.body.id;

    // Build the query.
    const query = `
        DELETE FROM requests
        WHERE request_id = ?
    `;

    // Run the query to delete the request.
    db.query(query, [requestId])
        .then(([rows, fields]) => {
            return res.redirect('/admin/requests');
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// GET /admin/requests
// The function returns the request section of admins.
exports.getAdminRequests = (req, res, next) => {
    // Build the query to pull the requests.
    const query = `SELECT * FROM requests ORDER BY date`;

    // Run the query to pull the list of request.
    db.query(query)
        .then(([rows, fields]) => {
            // Render the admin page.
            return res.render('admin-requests.html', {
                title: 'Admin - Full List of Request',
                path: '/home',
                requests: rows,
            });
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// GET /admin/reset-password
// The function returns the reset password page.
exports.getResetPassword = (req, res, next) => {
    // Render the Reset password page.
    return res.render('reset-password.html', {
        title: 'Reset Password',
        path: '/home',
    });
};

// POST /admin/reset-password
// The function resets the user's password.
exports.postResetPassword = async (req, res, next) => {
    // Pull the data from the form.
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    const errors = validationResult(req);

    // Validate the form.
    if (!errors.isEmpty()) {
        // If the form is not validated, reload the page.
        return res.status(422).render('reset-password.html', {
            title: 'Reset Password',
            path: '/home',
            errorMessage: 'Please fill out the form completely',
        });
    };

    // Check to make sure the passwords match.
    if (cpassword != password) {
        // If not, reload the page.
        return res.status(422).render('reset-password.html', {
            title: 'Reset Password',
            path: '/home',
            errorMessage: 'Passwords do not match',
        });
    };

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Get the user id from the session.
    const user_id = req.session.user.id;

    // Build the query.
    const query = `
        UPDATE users
        SET
            password = ?
        WHERE user_id = ?
    `;

    // Run the query.
    db.query(query, [hashedPassword, user_id])
        .then(([rows, fields]) => {
            // Redirect to the admin page.
            return res.redirect('/admin');
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// GET /admin
// The function returns the admin page.
exports.getAdmin = (req, res, next) => {
    // Render the admin page.
    return res.render('admin.html', {
        title: 'Admins',
        path: '/home',
    });
};