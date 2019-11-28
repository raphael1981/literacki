const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;


const Link = sequelize.define('link', {
  title: DataTypes.STRING,
  alias: DataTypes.STRING,
  path: DataTypes.STRING,
  dataType: {
    type: DataTypes.ENUM,
    values: [
      'home',
      'section_newspaper',
      'category_debate',
      'category_weekprofile',
      'category_recomendations',
      'section_program',
      'category_program',
      'section_kanon',
      'category_intro',
      'category_articles_series',
      'category_articles_single',
      'category_authors',
      'category_scenerio_index',
      'category_events',
      'custom_view'
    ]
  },
  externalLink: DataTypes.STRING,
  customView: DataTypes.STRING,
  linkedMenus: {
    type: DataTypes.TEXT
  },
  imageIcon: DataTypes.INTEGER,
  metaTitle: DataTypes.STRING,
  metaDesc: DataTypes.STRING,
  metaKeywords: DataTypes.STRING,
  ordering: DataTypes.INTEGER,
  params: DataTypes.TEXT,
  status: DataTypes.SMALLINT
}, {});


module.exports = Link