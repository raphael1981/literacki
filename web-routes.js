const router = require('express').Router();
const RouteParseRepository = require('./repositories/RouteParseRepository');
const HomeController = require('./controllers/HomeController');
const PageController = require('./controllers/PageController');

// router.get('/wyszukiwanie', RouteParseRepository.getCacheMenus, PageController.searchIndexShow)
router.get('/', RouteParseRepository.homeParseData, RouteParseRepository.getCacheMenus, HomeController.index)
router.get('/:a/:b?/:c?', RouteParseRepository.parseUrl, RouteParseRepository.getResourcesFullData, RouteParseRepository.getCacheMenus, RouteParseRepository.getCustomData, PageController.indexPage)

/*
const MenuRepository = require('./repositories/MenuRepository')
const Menu = require('./models/index').Menu
const Region = require('./models/index').Region
const City = require('./models/index').City
const Event = require('./models/index').Event
const Attraction = require('./models/index').Attraction
const Theme = require('./models/index').Theme
const Age = require('./models/index').Age
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

const {
  map
} = require('p-iteration');
var moment = require('moment');

async function getAssoc(evs) {
  await map(evs, async (el, i) => {
    evs[i].dataValues.all_cities = await el.getCities();
    evs[i].dataValues.all_regions = await el.getRegions();
    evs[i].dataValues.all_attraction = await el.getAttractions();
    evs[i].dataValues.all_themes = await el.getThemes();
    evs[i].dataValues.all_ages = await el.getAges();
  })
  return evs;
}

router.get('/', (req, res) => {
  // MenuRepository.getLinksTree().then(tree => {
  //   return res.json(tree)
  // })

  // Menu.findOne({ where: { id: 1 } }).then(m => {
  //   return res.json(m)
  // })

  // MenuRepository.getMenuLinksData(1).then(tree => {
  //   return res.json(tree)
  // })


  Event.findAll({
    where: {

      startAt: {
        [Op.gte]: moment().toDate()
      }

    },
    order: Sequelize.literal('startAt DESC'),
    include: [
      // {
      //   model: Region,
      //   as: 'Regions',
      //   where: { id: 1 }
      // },
      {
        model: Region,
        as: 'Regions',
        where: { [Op.or]: [{ id: 1 }, { id: 2 }] }
      },
      // {
      //   model: City,
      //   as: 'Cities',
      //   where: {
      //     [Op.or]: [{ id: 1 }, { id: 2 }]
      //   }
      // },
      {
        model: Theme,
        as: 'Themes',
        where: { [Op.or]: [{ id: 4 }, { id: 3 }] }
      },
      {
        model: Age,
        as: 'Ages',
        where: { [Op.or]: [{ id: 1 }, { id: 2 }] }
      }
    ]
  }).then(d => {

    // console.log(d)
    // return res.json(d)
    getAssoc(d).then(d => {
      // return res.json(d)
      return res.render('home-page', { d: d })
    })

  });

})

*/


module.exports = router;