// GET / aka the homepage.
// The function renders the homepage.
exports.getHome = (req, res, next) => {
    return res.render('index.html', {
        title: 'Home',
        path: '/home',
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

// GET /about
// The function delivers the about us page to the user.
exports.getAbout = (req, res, next) => {
    // Render the about apge.
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