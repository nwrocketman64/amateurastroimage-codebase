# Overview
This is the main codebase for the my Astrophotography website. The code here is made open-source under Apache License 2.0 and you are free to look at the code to either add any suggestments to improve the code or to copy it and use it as the base template for your website. This website includes features such as session and image uploads. The website is designed to run on any Linux server or Windows server. This website is designed to run on Nodejs version 19 or higher.

# Installing
To install the website for running on your computer, you can clone the codebase either by using the GitHub website or through git. Once it is on your computer, to get the website running you must create an .env.process which contains the enviroment variable for DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASS, and DATABASE for database configuration. SESSION_SECRET and SECRET_KEY for configuring the session for the website. GMAIL_USER and GMAIL_PASS for nodemailer in the contact form. RECAPTCHA_SITE and RECAPTCHA_SECRET for Google ReCaptcha. PORT for which port the website will use on the server. Once that file is created, you can install all the needed libraries using the npm package manager.
```
npm install
```
Once it is done installing, there are a still a few things that need to be configured before the website can be run and be fully operational. To start, you get a Google ReCaptcha Site Key and Secret Key for the contact form. Then, you need to make a Gmail account a provide a username and password for the nodemailer. Once that is done, you will then need to configure the database and the database configuration can be found below.


# Configure Database
You can use these table templates to create the tables for an SQL-based database.

Session Database table
```
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
);
```

Request Table
```
CREATE TABLE astro_image.requests (
  request_id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  date DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (request_id)
);
```

Users Table
```
CREATE TABLE astro_image.users (
  user_id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id)
);
```

Images Table
```
CREATE TABLE astro_image.images (
  image_id INT NOT NULL AUTO_INCREMENT,
  object VARCHAR(255) NOT NULL,
  path VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  telescope VARCHAR(255) NOT NULL,
  comments TEXT NOT NULL,
  date DATETIME NOT NULL,
  PRIMARY KEY (image_id)
);
```

If you have any problems with the tables, you might need to convert the tables to UTF-8 characterset.
```
ALTER TABLE the_table CONVERT TO CHARACTER SET utf8;
```

# Starting the Website
Once that is all done, you can start the website using this command below with nodemon.
```
npm start
```

# Development Environment
I used [VS code](https://code.visualstudio.com/) as the main IDE for creating the source code. I used [MariaDB](https://mariadb.org/) in both the development and production. Microsoft Edge and Mozilla FireFox where the main web browser that I tested this website on.

# Libraries Used
Some of the key libraries that I used for this website include

* [Bcypt](https://www.npmjs.com/package/bcrypt) - Used to encrypt passwords and compare hashes.
* [Custom-env](https://github.com/erisanolasheni/custom-env) - A tool used to load the enviroment variables.
* [Express](https://expressjs.com/) - The main web framework.
* [Express MySQL Session](https://github.com/chill117/express-mysql-session) - Middleware to help save a session to the database.
* [Express ReCaptcha](https://github.com/pdupavillon/express-recaptcha) - A tool to use to load Google's ReCaptcha on the page.
* [Express Validator](https://express-validator.github.io/docs/) - Used to validate and sanitize user inputs.
* [Express Session](http://expressjs.com/en/resources/middleware/session.html) - Used to make logging in possible.
* [Multer](https://www.npmjs.com/package/multer) - Used to process images submitted to the webite.
* [MySql2](http://sidorares.github.io/node-mysql2/) - A library used to manage the connection to the MariaDB database.
* [Normalize.css](https://necolas.github.io/normalize.css/) - It is used in the Pico.css framework.
* [Nodemailer](https://nodemailer.com/about/) - Used in the contact form to send an email.
* [Nodemon](https://nodemon.io/) - Used in developing the web app as it restarts the app every time you make a change.
* [Nunjucks](https://mozilla.github.io/nunjucks/) - The main templating engine used in the project.
* [Nunjucks Date](https://www.npmjs.com/package/nunjucks-date) - Provides a date filter for the templating engine.
* [Pico.css](https://picocss.com/) - The lightweight CSS framework that I used for the this website.
* [Sharp](https://sharp.pixelplumbing.com/) - The library used to process the images when received.

# Useful Websites
These were a few website that I found to be very helpful in building this website

* [NodeJS - The Complete Guide (MVC, REST APIs, GraphQL, Deno)](https://www.udemy.com/course/nodejs-the-complete-guide/)
* [How To Process Images in Node.js With Sharp](https://www.digitalocean.com/community/tutorials/how-to-process-images-in-node-js-with-sharp)
* [Templating](https://mozilla.github.io/nunjucks/templating.html)
* [Node.js Send an Email](https://www.w3schools.com/nodejs/nodejs_email.asp)
* [ExpressJS Tutorial](https://www.tutorialspoint.com/expressjs/index.htm)

# Website Link
This is the link to active website deployed.

[Amateur Astro Image](https://www.amateurastroimage.com/)