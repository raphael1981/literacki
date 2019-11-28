const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;


const Menu = sequelize.define('menu', {
  name: DataTypes.STRING,
  alias: DataTypes.STRING,
  linksJson: {
    type: DataTypes.TEXT,
    get() {
      return JSON.parse(this.getDataValue('linksJson'))
    }
  },
  params: DataTypes.TEXT,
  status: DataTypes.SMALLINT
}, {});

module.exports = Menu