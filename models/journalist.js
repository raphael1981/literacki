const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;

const Journalist = sequelize.define('journalist', {
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    alias: DataTypes.STRING,
    image: DataTypes.STRING,
    bio: DataTypes.TEXT,
    params: DataTypes.TEXT,
    ordering: DataTypes.INTEGER,
    metaKeywords: DataTypes.TEXT,
    metaDescription: DataTypes.TEXT
}, {});

module.exports = Journalist