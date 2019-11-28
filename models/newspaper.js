const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;
const Sequelize = require('sequelize')


const NewsPaper = sequelize.define('newspaper', {
    title: DataTypes.STRING(255),
    alias: {
        type: DataTypes.STRING(255),
        unique: true
    },
    image: DataTypes.STRING,
    metaDescription: DataTypes.TEXT,
    metaKeywords: DataTypes.TEXT,
    number: {
        type: DataTypes.STRING(30),
        unique: true
    },
    releaseDate: {
        type: DataTypes.DATEONLY
    },
    publishedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
    }
}, {});

module.exports = NewsPaper