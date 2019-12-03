const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;

const Debate = sequelize.define('debate', {
    title: DataTypes.STRING,
    alias: DataTypes.STRING,
    image: DataTypes.STRING,
    smallDesc: DataTypes.TEXT,
    longDesc: DataTypes.TEXT,
    params: DataTypes.TEXT,
    ordering: DataTypes.INTEGER,
    releaseDate: {
        type: DataTypes.DATEONLY
    },
    publishedAt: DataTypes.DATE,
    metaKeywords: DataTypes.TEXT,
    metaDescription: DataTypes.TEXT
}, {});

module.exports = Debate