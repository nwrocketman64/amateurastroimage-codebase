// Import the needed NPM libraries.
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Import the model.
const db = require('../models/database');

// GET /login
// The function delievers the login view.
exports.getLogin = (req, res, next) => {
    // Get the csft token for the form.
    const csrfToken = req.csrfToken();

    // Render the login page
    return res.render('login.html', {
        title: 'Login',
        path: '/home',
        errorMessage: '',
        email: '',
        csrfToken: csrfToken,
    });
};

// POST /login
// The function logins in a user.
exports.postLogin = (req, res, next) => {
    // Get the user input from the form.
    const email = req.body.username;
    const password = req.body.password;
    const errors = validationResult(req);

    // Validate the inputs.
    if (!errors.isEmpty()) {
        // Get the csft token for the form.
        const csrfToken = req.csrfToken();

        // If it does not validate, return the login page.
        return res.status(422).render('login.html', {
            title: 'Login',
            path: '/home',
            errorMessage: 'Please fill out all the forms',
            email: email,
            csrfToken: csrfToken,
        });
    }

    // Prepare the query.
    const query = `
        SELECT * FROM users
        WHERE username = ?
    `;

    // Run the query.
    db.query(query, [email])
        .then(([rows, fields]) => {
            // If the query comes up empty, reload the login page.
            if (rows.length === 0) {
                // Get the csft token for the form.
                const csrfToken = req.csrfToken();

                // Render the login page.
                return res.status(422).render('login.html', {
                    title: 'Login',
                    path: '/home',
                    errorMessage: 'Username Not Found',
                    email: email,
                    csrfToken: csrfToken,
                });
            } else {
                // If the username was found, compare the password with the hashed password.
                bcrypt.compare(password, rows[0].password)
                    .then((passwordsAreEqual) => {
                        // If the passwords are equal.
                        if (passwordsAreEqual) {
                            // Save the user information in the session.
                            req.session.user = {
                                id: rows[0].user_id,
                                username: rows[0].username,
                            };

                            // List the user as Authenticated.
                            req.session.isLoggedIn = true;

                            // Save the session and the redirect to the admin page.
                            return req.session.save(() => {
                                res.redirect('/admin');
                            });
                        } else {
                            // Get the csft token for the form.
                            const csrfToken = req.csrfToken();
                            
                            // If not, reload the login page.
                            return res.status(422).render('login.html', {
                                title: 'Login',
                                path: '/home',
                                errorMessage: 'Password is Incorrect',
                                email: email,
                                csrfToken: csrfToken,
                            });
                        };
                    });
            };
        })
     .catch(err => {
        // If there was an error, redirect to the 500 page.
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

// POST /logout
// The function logouts the user.
exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
};