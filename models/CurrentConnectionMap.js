const Sequelize = require('sequelize');
const db = require('../config/database');

const CurrentConnectionMap = db.define('currentConnectionMap', {
    agentId: {
        type: Sequelize.INTEGER
    },
    agentServiceId : {
        type: Sequelize.INTEGER
    },
    clientId: {
        type: Sequelize.INTEGER
    },
    clientServiceId : {
        type: Sequelize.INTEGER
    }
});

module.exports = CurrentConnectionMap;