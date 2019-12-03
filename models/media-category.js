const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;

const Mediacategory = sequelize.define('mediacategory', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    metaKeywords: DataTypes.TEXT,
    metaDescription: DataTypes.TEXT
}, {});

module.exports = Mediacategory