const Event = require('../models/index').Event
const Catalog = require('../models/index').Catalog
const Region = require('../models/index').Region
const City = require('../models/index').City
const Attraction = require('../models/index').Attraction
const Theme = require('../models/index').Theme
const Age = require('../models/index').Age
const Day = require('../models/index').Day
const {
    map
} = require('p-iteration');

class CriteriaRepository {


    async getCriteria() {

        var criteria = {}

        var rs = await Region.findAll()

        await map(rs, async (r, i) => {
            rs[i].dataValues.cities = await r.getCities()
            rs[i].dataValues.attractions = await r.getAttractions()
            await map(rs[i].dataValues.cities, async (c, j) => {
                rs[i].dataValues.cities[j].dataValues.attractions = await c.getAttractions()
                // console.log(c)
            })
            rs[i].dataValues.attractions = await r.getAttractions()
        })

        criteria.regions = rs;
        criteria.cities = await City.findAll();
        criteria.attractions = await Attraction.findAll();
        criteria.themes = await Theme.findAll();
        criteria.ages = await Age.findAll()
        criteria.days = await Day.findAll()
        criteria.catalogs = await Catalog.findAll({
            order: [
                ['createdAt', 'DESC'],
                ['current', 'DESC']
            ]
        })

        return criteria;

    }
}


module.exports = new CriteriaRepository()