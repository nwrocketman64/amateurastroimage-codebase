// Import the NPM libraries.
const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');

// Import the auth code middleware.
const isAuth = require('../middleware/is-auth');

// Import the admin controller
const adminController = require('../controllers/admin');

// Configure Multer
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'bucket');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({
    storage: storageConfig,
});

// Setup the router.
const router = express.Router();

// GET /admin/add-image
router.get('/add-image', isAuth, adminController.getAddImage);

// POST /admin/add-image
router.post(
    '/add-image',
    isAuth,
    upload.single('image'),
    [
        body('object').not().isEmpty().trim().escape(),
        body('date').not().isEmpty().trim().escape(),
        body('location').not().isEmpty().trim().escape(),
        body('telescope').not().isEmpty().trim().escape(),
        body('comments').not().isEmpty().trim(),
    ],
    adminController.postAddImage
);

// GET /admin/edit-image/:id
router.get('/edit-image/:id', isAuth, adminController.getEditImage);

// POST /admin/edit-image
router.post(
    '/edit-image',
    isAuth,
    [
        body('object').not().isEmpty().trim().escape(),
        body('date').not().isEmpty().trim().escape(),
        body('location').not().isEmpty().trim().escape(),
        body('telescope').not().isEmpty().trim().escape(),
        body('comments').not().isEmpty().trim(),
    ],
    adminController.postEditImage
);

// GET /admin/delete-image/:id
router.get('/delete-image/:id', isAuth, adminController.getDeleteImage);

// POST /admin/delete-image
router.post(
    '/delete-image',
    isAuth,
    [
        body('id').not().isEmpty().trim().escape(),
    ],
    adminController.postDeleteImage
);

// GET /admin/images
router.get('/images', isAuth, adminController.getAdminImages);

// GET /admin/view-request/:id
router.get('/view-request/:id', isAuth, adminController.getViewRequest);

// GET /admin/delete-request/:id
router.get('/delete-request/:id', isAuth, adminController.getDeleteRequest);

// POST /admin/delete-request/
router.post(
    '/delete-request',
    isAuth,
    [
        body('id').not().isEmpty().trim().escape(),
    ],
    adminController.postDeleteRequest
);

// GET /admin/requests
router.get('/requests', isAuth, adminController.getAdminRequests);

// GET /admin/reset-password
router.get('/reset-password', isAuth, adminController.getResetPassword);

// POST /admin/reset-password
router.post(
    '/reset-password',
    isAuth,
    [
        body('password').isLength({ min: 5 }).trim(),
        body('cpassword').isLength({ min: 5 }).trim(),
    ],
    adminController.postResetPassword
);

// GET /admin
router.get('/', isAuth, adminController.getAdmin);

// Export the router.
module.exports = router;