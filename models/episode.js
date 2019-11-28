const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;

const Episode = sequelize.define('episode', {
    name: DataTypes.STRING,
    alias: DataTypes.STRING,
    image: DataTypes.STRING,
    smallDesc: DataTypes.TEXT,
    longDesc: DataTypes.TEXT,
    movie: {
        type: DataTypes.TEXT
    },
    ordering: DataTypes.INTEGER,
    releaseDate: {
        type: DataTypes.DATEONLY
    },
    metaKeywords: DataTypes.TEXT,
    metaDescription: DataTypes.TEXT
}, {});

module.exports = Episode