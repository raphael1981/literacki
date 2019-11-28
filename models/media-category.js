const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;

const MediaCategory = sequelize.define('mediacategory', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    metaKeywords: DataTypes.TEXT,
    metaDescription: DataTypes.TEXT
}, {});

module.exports = MediaCategory