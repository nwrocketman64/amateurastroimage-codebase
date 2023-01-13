// Import the need libraries.
const express = require('express');
const { body } = require('express-validator');

// Import the shop controller
const siteController = require('../controllers/site');

// Setup the router.
const router = express.Router();

// GET / aka the homepage
router.get('/', siteController.getHome);

// // GET /images/:page?
// router.get('/images/:page?', siteController.getImages);
router.get('/images', siteController.getImages);

// // GET /image-view/:id
// router.get('/image-view/:id', siteController.getImage);

// GET /contact
router.get('/contact', siteController.getContact);

// POST /contact
router.post(
    '/contact',
    [
        body('fname').not().isEmpty().trim().escape().isLength({ max: 255 }),
        body('lname').not().isEmpty().trim().escape().isLength({ max: 255 }),
        body('email').isEmail().normalizeEmail().isLength({ max: 255 }),
        body('comment').not().isEmpty().trim().escape().isLength({ max: 65535 }),
    ],
    siteController.postContact
);

// GET /form-sent
router.get('/form-sent', siteController.getFormSent);

// GET /about
router.get('/about', siteController.getAbout);

// GET /patch-notes
router.get('/patch-notes', siteController.getPatchNotes);

// Export the router
module.exports = router;