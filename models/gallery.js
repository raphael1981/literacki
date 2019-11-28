const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;
const Sequelize = require('sequelize')


const Gallery = sequelize.define('gallery', {
  name: DataTypes.STRING(255),
  alias: {
    type: DataTypes.STRING(255),
    unique: true
  },
  imageIcon: DataTypes.STRING(255),
  galleryImages: {
    type: DataTypes.TEXT,
    get() {

      if (this.getDataValue('galleryImages')) {
        return JSON.parse(this.getDataValue('galleryImages'));
      } else {
        return null
      }
    },
    set(val) {
      this.setDataValue('galleryImages', JSON.stringify(val))
    }
  },
  publishedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
});

module.exports = Gallery