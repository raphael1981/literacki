const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;
const Sequelize = require('sequelize')


const NewsPaperArticle = sequelize.define('newspaperarticle', {
    title: DataTypes.STRING(255),
    alias: {
        type: DataTypes.STRING(255),
        unique: true
    },
    image: DataTypes.STRING,
    smallDesc: DataTypes.TEXT,
    longDesc: DataTypes.TEXT,
    newspaperArticleType: {
        type: DataTypes.ENUM,
        values: [
            'none',
            'debate',
            'weekProfile',
            'mediaRecomendation'
        ],
        defaultValue: 'none'
    },
    ordering: DataTypes.INTEGER,
    attachments: {
        type: DataTypes.TEXT
    },
    movie: {
        type: DataTypes.TEXT
    },
    metaDescription: DataTypes.TEXT,
    metaKeywords: DataTypes.TEXT,
    publishedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
    }
}, {});

module.exports = NewsPaperArticle