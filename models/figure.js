const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;

const Figure = sequelize.define('figure', {
    title: DataTypes.STRING,
    alias: DataTypes.STRING,
    image: DataTypes.STRING,
    smallDesc: DataTypes.TEXT,
    longDesc: DataTypes.TEXT,
    figureType: {
        type: DataTypes.ENUM,
        values: ['author', 'journalist', 'any'],
        defaultValue: 'any'
    },
    releaseDate: {
        type: DataTypes.DATEONLY
    },
    publishedAt: DataTypes.DATE,
    metaKeywords: DataTypes.TEXT,
    metaDescription: DataTypes.TEXT
}, {});

module.exports = Figure