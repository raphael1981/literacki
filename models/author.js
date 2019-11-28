const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;

const Author = sequelize.define('author', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    image: DataTypes.STRING,
    bio: DataTypes.TEXT,
    params: DataTypes.TEXT,
    ordering: DataTypes.INTEGER,
    metaKeywords: DataTypes.TEXT,
    metaDescription: DataTypes.TEXT
}, {});

module.exports = Author