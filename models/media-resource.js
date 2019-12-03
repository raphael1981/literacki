const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;
const Sequelize = require('sequelize')


const Mediaresource = sequelize.define('mediaresource', {
    title: DataTypes.STRING(255),
    alias: {
        type: DataTypes.STRING(255),
        unique: true
    },
    dataJson: DataTypes.TEXT
}, {});

module.exports = Mediaresource