// Import the NPM packages.
const mysql = require('mysql2/promise');

// Create the database connection.
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    waitForConnections: true,
    multipleStatements: true,
});

// Export the connection pool.
module.exports = pool;