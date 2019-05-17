const Sequelize = require('sequelize');

const db = new Sequelize('omniconnect', 'root', 'yourpassword', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = db;