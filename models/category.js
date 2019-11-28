const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;

const Category = sequelize.define('category', {
  name: DataTypes.STRING,
  alias: DataTypes.STRING,
  path: DataTypes.STRING,
  image: DataTypes.STRING,
  categoryViewType: {
    type: DataTypes.ENUM,
    values: [
      'none',
      'debate',
      'week_profile',
      'recomendation',
      'program',
      'kanon_articles',
      'scenerio_index',
      'authors',
      'events'
    ],
    defaultValue: 'none'
  },
  intro: DataTypes.TEXT,
  params: DataTypes.TEXT,
  ordering: DataTypes.INTEGER,
  metaKeywords: DataTypes.TEXT,
  metaDescription: DataTypes.TEXT
}, {});

module.exports = Category