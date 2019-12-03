const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;
const Sequelize = require('sequelize')


const Event = sequelize.define('event', {
    title: DataTypes.STRING(255),
    alias: {
        type: DataTypes.STRING(255),
        unique: true
    },
    image: DataTypes.STRING,
    smallDesc: DataTypes.TEXT,
    longDesc: DataTypes.TEXT,
    metaDescription: DataTypes.TEXT,
    metaKeywords: DataTypes.TEXT,
    publishedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
    }
}, {});

module.exports = Event