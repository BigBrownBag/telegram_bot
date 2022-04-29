const { Sequelize } = require('sequelize');
module.exports = new Sequelize(
    'telega',
    'root',
    'root',
    {
        host: '77.223.123.38',
        port: '6432',
        dialect: 'postgres'
    }
)