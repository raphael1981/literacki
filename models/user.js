const sequelize = require('../config/sequelize')
const DataTypes = require('sequelize').DataTypes;

const User = sequelize.define('user', {
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  status: DataTypes.SMALLINT
}, {});

module.exports = User