const Sequelize = require('sequelize');
const db = require('../config/database');

const Company = db.define('company', {
    name: {
        type: Sequelize.STRING
    }
});

module.exports = Company;