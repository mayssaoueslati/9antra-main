const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'bridge',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});


pool.promise().query('SELECT 1')
    .then(() => console.log('Database connected successfully'))
    .catch(err => {
        console.error('Database connection failed:', err);
        process.exit(1);
    });

module.exports = pool.promise();