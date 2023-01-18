// Import the NPM packages.
const { validationResult } = require('express-validator');

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
exports.postAddImage = (req, res, next) => {
    return res.redirect('/admin');
};

// GET /admin/edit-image/:id
// The function renders the edit image page.
exports.getEditImage = (req, res, next) => {
    return res.render('edit-image.html', {
        title: 'Edit Image',
        path: '/home',
    });
};

// POST /admin/edit-image
// The function processes the image data changes.
exports.postEditImage = (req, res, next) => {
    return res.redirect('/admin');
};

// GET /admin/delete-image/:id
// The function return the delete image page.
exports.getDeleteImage = (req, res, next) => {
    return res.render('delete-image.html', {
        title: 'Delete Image',
        path: '/home',
    });
};

// POST /admin/delete-image/:id
// The function delete the request image from the database.
exports.postDeleteImage = (req, res, next) => {
    return res.redirect('/admin');
};

// GET /admin/reset-password
// The function returns the reset password page.
exports.getResetPassword = (req, res, next) => {
    return res.render('reset-password.html', {
        title: 'Reset Password',
        path: '/home',
    });
};

// POST /admin/reset-password
// The function resets the user's password.
exports.postResetPassword = (req, res, next) => {
    return res.redirect('/admin');
};

// GET /admin/images
// The function returns the image section of admins.
exports.getAdminImages = (req, res, next) => {
    // Get the csft token for the form.
    const csrfToken = req.csrfToken();

    // Render the admin page.
    return res.render('admin-images.html', {
        title: 'Admin - Full List of Images',
        path: '/home',
        csrfToken: csrfToken,
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
            // Get the csrt token for the form.
            const csrfToken = req.csrfToken();

            // Render the delete request page.
            return res.render('delete-request.html', {
                title: 'Delete Request from ' + rows[0].first_name + ' ' + rows[0].last_name,
                path: '/home',
                request: rows[0],
                csrfToken: csrfToken,
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
            // Get the csft token for the form.
            const csrfToken = req.csrfToken();

            // Render the admin page.
            return res.render('admin-requests.html', {
                title: 'Admin - Full List of Request',
                path: '/home',
                csrfToken: csrfToken,
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

// GET /admin
// The function returns the admin page.
exports.getAdmin = (req, res, next) => {
    // Get the csft token for the form.
    const csrfToken = req.csrfToken();

    // Render the admin page.
    return res.render('admin.html', {
        title: 'Admins',
        path: '/home',
        csrfToken: csrfToken,
    });
};