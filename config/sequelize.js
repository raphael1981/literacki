const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://root:@localhost:3306/literacki', {
    // Look to the next section for possible options
    // logging: false
})

module.exports = sequelize;