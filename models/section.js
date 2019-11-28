const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;
const Sequelize = require('sequelize')


const Section = sequelize.define('section', {
    title: DataTypes.STRING(255),
    alias: {
        type: DataTypes.STRING(255),
        unique: true
    },
    sectionType: {
        type: DataTypes.ENUM,
        values: ['newspaper', 'program', 'kanon', 'none'],
        defaultValue: 'none'
    },
    image: DataTypes.STRING,
    smallDesc: DataTypes.TEXT,
    longDesc: DataTypes.TEXT,
    ordering: DataTypes.INTEGER,
    metaDescription: DataTypes.TEXT,
    metaKeywords: DataTypes.TEXT,
    publishedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
    }
}, {});

module.exports = Section