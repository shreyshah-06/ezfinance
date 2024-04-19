const Sequelize = require('sequelize')
module.exports = new Sequelize('ezfinance','postgres','admin',{
    host: 'localhost',
    dialect:"postgres",
});